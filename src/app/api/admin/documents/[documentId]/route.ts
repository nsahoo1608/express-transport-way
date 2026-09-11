import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

type RouteContext = {
  params: Promise<{
    documentId: string;
  }>;
};

const allowedStatuses = [
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
] as const;

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator authentication is required.",
        },
        { status: 401 }
      );
    }

    const { documentId } = await context.params;

    const body = await request.json();

    const verificationStatus = String(
      body.verificationStatus ?? ""
    ).trim();

    const verificationRemarks = String(
      body.verificationRemarks ?? ""
    ).trim();

    if (
      !allowedStatuses.includes(
        verificationStatus as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid document verification status.",
        },
        { status: 400 }
      );
    }

    if (
      verificationStatus === "REJECTED" &&
      !verificationRemarks
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Rejection remarks are required.",
        },
        { status: 400 }
      );
    }

    const document = await prisma.ownerDocument.findUnique({
      where: {
        id: documentId,
      },
      select: {
        id: true,
        documentName: true,
        verificationStatus: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner document was not found.",
        },
        { status: 404 }
      );
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const updateData: {
        verificationStatus: string;
        verificationRemarks: string | null;
        verifiedBy?: string | null;
        verifiedAt?: Date | null;
      } = {
        verificationStatus,
        verificationRemarks: verificationRemarks || null,
      };

      if (
        verificationStatus === "VERIFIED" ||
        verificationStatus === "REJECTED"
      ) {
        updateData.verifiedBy = admin.email;
        updateData.verifiedAt = now;
      } else {
        updateData.verifiedBy = null;
        updateData.verifiedAt = null;
      }

      const updatedDocument = await tx.ownerDocument.update({
        where: {
          id: documentId,
        },
        data: updateData,
        select: {
          id: true,
          documentName: true,
          verificationStatus: true,
          verificationRemarks: true,
          verifiedBy: true,
          verifiedAt: true,
          updatedAt: true,
        },
      });

      const verification = await tx.ownerDocumentVerification.create({
        data: {
          documentId: document.id,
          overallStatus: verificationStatus,
          verificationSource: "MANUAL_ADMIN",
          sourceReference: `ADMIN:${admin.email}`,
          checkedBy: admin.email,
          checkedAt: now,
          finalRemarks: verificationRemarks || null,
          checks: {
            create: {
              checkType: "MANUAL_REVIEW",
              status:
                verificationStatus === "VERIFIED"
                  ? "PASSED"
                  : verificationStatus === "REJECTED"
                    ? "FAILED"
                    : "IN_REVIEW",
              source: "ADMIN",
              reference: admin.email,
              result: `Document manually reviewed and marked ${verificationStatus}.`,
              remarks: verificationRemarks || null,
              checkedAt: now,
            },
          },
        },
        select: {
          id: true,
          overallStatus: true,
        },
      });

      await tx.ownerDocumentVerificationAudit.create({
        data: {
          documentId: document.id,
          verificationId: verification.id,
          adminEmail: admin.email,
          action: "MANUAL_STATUS_UPDATE",
          previousStatus: document.verificationStatus,
          newStatus: verificationStatus,
          remarks: verificationRemarks || null,
          createdAt: now,
        },
      });

      return {
        updatedDocument,
        verification,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Document status changed to ${verificationStatus}.`,
      data: {
        ...result.updatedDocument,
        verification: result.verification,
      },
    });
  } catch (error) {
    console.error(
      "Admin owner document verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update document verification status.",
      },
      { status: 500 }
    );
  }
}
