import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = String(body.token ?? "").trim();
    const password = String(body.password ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Activation token and both password fields are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const activation = await prisma.ownerActivationToken.findUnique({
      where: {
        tokenHash,
      },
      include: {
        owner: {
          include: {
            account: true,
          },
        },
      },
    });

    if (!activation) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid activation link.",
        },
        { status: 400 }
      );
    }

    if (activation.usedAt) {
      return NextResponse.json(
        {
          success: false,
          message: "This activation link has already been used.",
        },
        { status: 400 }
      );
    }

    if (activation.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        {
          success: false,
          message: "This activation link has expired.",
        },
        { status: 400 }
      );
    }

    if (!activation.owner.account) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account is not available.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      await tx.ownerAccount.update({
        where: {
          ownerId: activation.owner.id,
        },
        data: {
          passwordHash,
          mustSetPassword: false,
          isActive: true,
        },
      });

      await tx.vehicleOwner.update({
        where: {
          id: activation.owner.id,
        },
        data: {
          accountStatus: "ACTIVE",
        },
      });

      await tx.ownerActivationToken.update({
        where: {
          id: activation.id,
        },
        data: {
          usedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Owner account activated successfully.",
      data: {
        ownerId: activation.owner.ownerId,
        ownerName: activation.owner.name,
      },
    });
  } catch (error) {
    console.error("Owner account activation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to activate owner account.",
      },
      { status: 500 }
    );
  }
}