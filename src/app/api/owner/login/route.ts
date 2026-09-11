import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createOwnerSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ownerId = String(body.ownerId ?? "")
      .trim()
      .toUpperCase();

    const password = String(body.password ?? "");

    if (!ownerId || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner ID and password are required.",
        },
        { status: 400 }
      );
    }

    const owner = await prisma.vehicleOwner.findUnique({
      where: { ownerId },
      include: { account: true },
    });

    if (!owner || !owner.account) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Owner ID or password.",
        },
        { status: 401 }
      );
    }

    if (owner.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account is not active.",
        },
        { status: 403 }
      );
    }

    if (!owner.account.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account has been disabled.",
        },
        { status: 403 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      owner.account.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Owner ID or password.",
        },
        { status: 401 }
      );
    }

    await prisma.ownerAccount.update({
      where: { ownerId: owner.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await createOwnerSession({
      ownerId: owner.ownerId,
      name: owner.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Owner login successful.",
      data: {
        ownerId: owner.ownerId,
        name: owner.name,
        companyName: owner.companyName,
        phone: owner.phone,
      },
    });

    response.cookies.set("etw_owner_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Owner login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process owner login.",
      },
      { status: 500 }
    );
  }
}
