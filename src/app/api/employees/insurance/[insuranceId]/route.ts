import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

const allowedStatuses = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
] as const;

type VerificationStatus = (typeof allowedStatuses)[number];

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ insuranceId: string }>;
  }
) {
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

  try {
    const { insuranceId } = await context.params;
    const body = await request.json();

    const verificationStatus = body?.verificationStatus as
      | VerificationStatus
      | undefined;

    const verificationRemarks =
      typeof body?.verificationRemarks === "string"
        ? body.verificationRemarks.trim()
        : "";

    if (
      !verificationStatus ||
      !allowedStatuses.includes(verificationStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid verification status. Allowed values are SUBMITTED, UNDER_REVIEW, VERIFIED, or REJECTED.",
        },
        { status: 400 }
      );
    }

    if (verificationStatus === "REJECTED" && !verificationRemarks) {
      return NextResponse.json(
        {
          success: false,
          message: "Rejection remarks are required.",
        },
        { status: 400 }
      );
    }

    const existingInsurance = await prisma.employeeInsurance.findUnique({
      where: {
        id: insuranceId,
      },
      include: {
        employee: {
          select: {
            employeeId: true,
            fullName: true,
          },
        },
      },
    });

    if (!existingInsurance) {
      return NextResponse.json(
        {
          success: false,
          message: "Insurance record not found.",
        },
        { status: 404 }
      );
    }

    const isVerified = verificationStatus === "VERIFIED";

    const insurance = await prisma.employeeInsurance.update({
      where: {
        id: insuranceId,
      },
      data: {
        verificationStatus,
        verifiedAt: isVerified ? new Date() : null,
        verifiedBy: isVerified ? admin.email : null,
        verificationRemarks: verificationRemarks || null,
        notes:
          verificationRemarks ||
          existingInsurance.notes ||
          undefined,
      },
      include: {
        employee: {
          select: {
            employeeId: true,
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Employee insurance status updated to ${verificationStatus}.`,
      data: {
        id: insurance.id,
        employeeId: insurance.employee.employeeId,
        employeeName: insurance.employee.fullName,
        insuranceType: insurance.insuranceType,
        provider: insurance.provider,
        policyNumber: insurance.policyNumber,
        verificationStatus: insurance.verificationStatus,
        verificationRemarks: insurance.verificationRemarks,
        verifiedBy: insurance.verifiedBy,
        verifiedAt: insurance.verifiedAt,
      },
    });
  } catch (error) {
    console.error("Insurance verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update insurance verification status.",
      },
      { status: 500 }
    );
  }
}