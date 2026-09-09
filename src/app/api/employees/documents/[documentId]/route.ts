import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

const ALLOWED_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
] as const;

type VerificationStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ documentId: string }> }
) {
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

    const { documentId } = await context.params;

    if (!documentId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Document ID is required.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const requestedStatus = String(body.verificationStatus ?? "")
      .trim()
      .toUpperCase();

    const verificationRemarks =
      body.verificationRemarks !== undefined &&
      body.verificationRemarks !== null
        ? String(body.verificationRemarks).trim()
        : null;

    if (
      !ALLOWED_STATUSES.includes(
        requestedStatus as VerificationStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid verification status. Allowed values: SUBMITTED, UNDER_REVIEW, VERIFIED, REJECTED.",
        },
        { status: 400 }
      );
    }

    const verificationStatus =
      requestedStatus as VerificationStatus;

    if (
      verificationStatus === "REJECTED" &&
      !verificationRemarks
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification remarks are required when rejecting a document.",
        },
        { status: 400 }
      );
    }

    const document = await prisma.employeeDocument.findUnique({
      where: {
        id: documentId.trim(),
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

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee document not found.",
        },
        { status: 404 }
      );
    }

    const updatedDocument =
      await prisma.employeeDocument.update({
        where: {
          id: document.id,
        },
        data: {
          verificationStatus,
          verificationRemarks,
          verifiedAt:
            verificationStatus === "VERIFIED"
              ? new Date()
              : null,
          verifiedBy:
            verificationStatus === "VERIFIED"
              ? admin.email
              : null,
        },
      });

    return NextResponse.json({
      success: true,
      message: `Employee document status updated to ${verificationStatus}.`,
      data: {
        id: updatedDocument.id,
        employeeId: document.employee.employeeId,
        fullName: document.employee.fullName,
        documentType: updatedDocument.documentType,
        documentName: updatedDocument.documentName,
        verificationStatus:
          updatedDocument.verificationStatus,
        verifiedAt: updatedDocument.verifiedAt,
        verifiedBy: updatedDocument.verifiedBy,
        verificationRemarks:
          updatedDocument.verificationRemarks,
        uploadedAt: updatedDocument.uploadedAt,
      },
    });
  } catch (error) {
    console.error(
      "Employee document verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update employee document verification status.",
      },
      { status: 500 }
    );
  }
}