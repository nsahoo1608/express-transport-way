import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth/guard";

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

    const vehicleId = String(body.vehicleId ?? "").trim();
    const agreementType = String(body.agreementType ?? "").trim();
    const startDateValue = String(body.startDate ?? "").trim();
    const expiryDateValue = String(body.expiryDate ?? "").trim();
    const rateType = String(body.rateType ?? "").trim();
    const rateValue = String(body.rate ?? "").trim();
    const paymentTerms = String(body.paymentTerms ?? "").trim();
    const fuelResponsibility = String(
      body.fuelResponsibility ?? ""
    ).trim();
    const driverResponsibility = String(
      body.driverResponsibility ?? ""
    ).trim();
    const maintenanceResponsibility = String(
      body.maintenanceResponsibility ?? ""
    ).trim();

    if (
      !vehicleId ||
      !agreementType ||
      !startDateValue ||
      !rateType ||
      !rateValue ||
      !paymentTerms ||
      !fuelResponsibility ||
      !driverResponsibility ||
      !maintenanceResponsibility
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vehicle, agreement type, start date, rate type, rate, payment terms and responsibility details are required.",
        },
        { status: 400 }
      );
    }

    const rate = Number(rateValue);

    if (!Number.isFinite(rate) || rate < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid rate.",
        },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateValue);

    if (Number.isNaN(startDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid start date.",
        },
        { status: 400 }
      );
    }

    let expiryDate: Date | null = null;

    if (expiryDateValue) {
      expiryDate = new Date(expiryDateValue);

      if (Number.isNaN(expiryDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Please provide a valid expiry date.",
          },
          { status: 400 }
        );
      }

      if (expiryDate < startDate) {
        return NextResponse.json(
          {
            success: false,
            message: "Expiry date cannot be earlier than the start date.",
          },
          { status: 400 }
        );
      }
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

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        vehicleId,
        ownerId: owner.id,
      },
      select: {
        id: true,
        vehicleId: true,
        registrationNumber: true,
        status: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle was not found under your owner account.",
        },
        { status: 404 }
      );
    }

    const agreementId = `ETW-AGR-${randomBytes(5)
      .toString("hex")
      .toUpperCase()}`;

    const agreement = await prisma.vehicleAgreement.create({
      data: {
        agreementId,
        ownerId: owner.id,
        vehicleId: vehicle.id,
        agreementType,
        startDate,
        expiryDate,
        rateType,
        rate,
        paymentTerms,
        fuelResponsibility,
        driverResponsibility,
        maintenanceResponsibility,
        status: "SUBMITTED",
      },
      select: {
        agreementId: true,
        vehicleId: true,
        agreementType: true,
        startDate: true,
        expiryDate: true,
        rateType: true,
        rate: true,
        paymentTerms: true,
        fuelResponsibility: true,
        driverResponsibility: true,
        maintenanceResponsibility: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Agreement submitted successfully.",
        data: agreement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Owner agreement creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create agreement.",
      },
      { status: 500 }
    );
  }
}
