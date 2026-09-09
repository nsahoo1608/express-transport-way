import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      employeeId,
      insuranceType,
      provider,
      policyNumber,
      coverageAmount,
      startDate,
      expiryDate,
      status,
      verificationStatus,
      policyDocumentUrl,
      notes,
    } = body;

    if (
      !employeeId ||
      !insuranceType ||
      !provider ||
      !policyNumber ||
      !startDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee ID, insurance type, provider, policy number and start date are required.",
        },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: {
        employeeId: String(employeeId).trim(),
      },
      select: {
        id: true,
        employeeId: true,
        fullName: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found.",
        },
        { status: 404 }
      );
    }

    const insurance = await prisma.employeeInsurance.create({
      data: {
        employeeId: employee.id,
        insuranceType: String(insuranceType).trim(),
        provider: String(provider).trim(),
        policyNumber: String(policyNumber).trim(),
        coverageAmount:
          coverageAmount !== undefined && coverageAmount !== null
            ? String(coverageAmount)
            : null,
        startDate: new Date(startDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: status ? String(status).trim() : "ACTIVE",
        verificationStatus: verificationStatus
          ? String(verificationStatus).trim()
          : "SUBMITTED",
        policyDocumentUrl: policyDocumentUrl
          ? String(policyDocumentUrl).trim()
          : null,
        notes: notes ? String(notes).trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Employee insurance added successfully.",
      data: {
        id: insurance.id,
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        insuranceType: insurance.insuranceType,
        provider: insurance.provider,
        policyNumber: insurance.policyNumber,
        coverageAmount: insurance.coverageAmount,
        startDate: insurance.startDate,
        expiryDate: insurance.expiryDate,
        status: insurance.status,
        verificationStatus: insurance.verificationStatus,
        policyDocumentUrl: insurance.policyDocumentUrl,
        notes: insurance.notes,
        createdAt: insurance.createdAt,
      },
    });
  } catch (error) {
    console.error("Employee insurance API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add employee insurance.",
      },
      { status: 500 }
    );
  }
}
