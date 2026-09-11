import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name = normalize(body.name);
    const ownerType = normalize(body.ownerType) || "INDIVIDUAL";
    const companyName = normalize(body.companyName);
    const phone = normalize(body.phone);
    const email = normalize(body.email).toLowerCase();
    const address = normalize(body.address);
    const pan = normalize(body.pan).toUpperCase();
    const gstin = normalize(body.gstin).toUpperCase();

    if (!name || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner name and phone are required.",
        },
        { status: 400 }
      );
    }

    if (email) {
      const existing = await prisma.vehicleOwner.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: "An owner with this email already exists.",
          },
          { status: 409 }
        );
      }
    }

    const owner = await prisma.$transaction(async (tx) => {
      const latest = await tx.vehicleOwner.findFirst({
        orderBy: {
          ownerId: "desc",
        },
        select: {
          ownerId: true,
        },
      });

      let nextNumber = 1;

      if (latest?.ownerId) {
        const match = latest.ownerId.match(/(\d+)$/);

        if (match) {
          nextNumber = Number(match[1]) + 1;
        }
      }

      const ownerId = `ETW-OWN-${String(nextNumber).padStart(6, "0")}`;

      const createdOwner = await tx.vehicleOwner.create({
        data: {
          ownerId,
          ownerType,
          name,
          companyName: companyName || null,
          phone,
          email: email || null,
          address: address || null,
          pan: pan || null,
          gstin: gstin || null,
          kycStatus: "PENDING",
          accountStatus: "PENDING",
        },
      });

      await tx.ownerAccount.create({
        data: {
          ownerId: createdOwner.id,
          passwordHash: "",
          isActive: true,
          mustSetPassword: true,
        },
      });

      return createdOwner;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle owner registered successfully.",
        data: {
          id: owner.id,
          ownerId: owner.ownerId,
          name: owner.name,
          companyName: owner.companyName,
          phone: owner.phone,
          email: owner.email,
          kycStatus: owner.kycStatus,
          accountStatus: owner.accountStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Vehicle owner registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to register vehicle owner.",
      },
      { status: 500 }
    );
  }
}