import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth/guard";

export async function GET() {
  try {
    const ownerSession = await requireOwner();

    if (!ownerSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner authentication is required.",
        },
        { status: 401 }
      );
    }

    const owner = await prisma.vehicleOwner.findUnique({
      where: {
        ownerId: ownerSession.ownerId,
      },
      select: {
        id: true,
        accountStatus: true,
      },
    });

    if (!owner) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account was not found.",
        },
        { status: 404 }
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

    const vehicles = await prisma.vehicle.findMany({
      where: {
        ownerId: owner.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        vehicleId: true,
        registrationNumber: true,
        vehicleType: true,
        make: true,
        model: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Owner vehicle listing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load vehicles.",
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const ownerSession = await requireOwner();

    if (!ownerSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner authentication is required.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const registrationNumber = String(
      body.registrationNumber ?? ""
    )
      .trim()
      .toUpperCase();

    const vehicleType = String(body.vehicleType ?? "").trim();
    const make = String(body.make ?? "").trim();
    const model = String(body.model ?? "").trim();

    const manufacturingYearValue = String(
      body.manufacturingYear ?? ""
    ).trim();

    const ownershipType = String(
      body.ownershipType ?? ""
    ).trim().toUpperCase();

    const rcNumber = String(body.rcNumber ?? "").trim();
    const rcExpiryDateValue = String(
      body.rcExpiryDate ?? ""
    ).trim();

    if (
      !registrationNumber ||
      !vehicleType ||
      !manufacturingYearValue ||
      !ownershipType
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Registration number, vehicle type, manufacturing year and ownership type are required.",
        },
        { status: 400 }
      );
    }

    const manufacturingYear = Number(manufacturingYearValue);

    const currentYear = new Date().getFullYear();

    if (
      !Number.isInteger(manufacturingYear) ||
      manufacturingYear < 1900 ||
      manufacturingYear > currentYear + 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid manufacturing year.",
        },
        { status: 400 }
      );
    }

    let rcExpiryDate: Date | null = null;

    if (rcExpiryDateValue) {
      const parsedDate = new Date(rcExpiryDateValue);

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Please provide a valid RC expiry date.",
          },
          { status: 400 }
        );
      }

      rcExpiryDate = parsedDate;
    }

    const owner = await prisma.vehicleOwner.findUnique({
      where: {
        ownerId: ownerSession.ownerId,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        accountStatus: true,
      },
    });

    if (!owner) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account was not found.",
        },
        { status: 404 }
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

    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        registrationNumber,
      },
      select: {
        id: true,
      },
    });

    if (existingVehicle) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A vehicle with this registration number is already registered.",
        },
        { status: 409 }
      );
    }

    const vehicleId = `ETW-VEH-${randomBytes(5)
      .toString("hex")
      .toUpperCase()}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleId,
        registrationNumber,
        vehicleType,
        make: make || null,
        model: model || null,
        manufacturingYear,
        ownershipType,
        ownerId: owner.id,
        status: "PENDING",
        rcNumber: rcNumber || null,
        rcExpiryDate,
      },
      select: {
        id: true,
        vehicleId: true,
        registrationNumber: true,
        vehicleType: true,
        make: true,
        model: true,
        manufacturingYear: true,
        ownershipType: true,
        status: true,
        rcNumber: true,
        rcExpiryDate: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle registered successfully.",
        data: vehicle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Owner vehicle registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to register vehicle.",
      },
      { status: 500 }
    );
  }
}
