import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const owner = await prisma.vehicleOwner.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!owner || !owner.account) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account not found.",
        },
        { status: 404 }
      );
    }

    await prisma.ownerActivationToken.updateMany({
      where: {
        ownerId: owner.id,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.ownerActivationToken.create({
      data: {
        ownerId: owner.id,
        tokenHash,
        expiresAt,
      },
    });

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const activationUrl =
      `${origin}/owner/activate?token=${encodeURIComponent(rawToken)}`;

    return NextResponse.json({
      success: true,
      message: "Owner activation link generated successfully.",
      data: {
        ownerId: owner.ownerId,
        ownerName: owner.name,
        activationUrl,
        expiresAt,
      },
    });
  } catch (error) {
    console.error("Owner activation generation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate owner activation link.",
      },
      { status: 500 }
    );
  }
}