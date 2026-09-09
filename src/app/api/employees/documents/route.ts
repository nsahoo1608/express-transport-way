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
      documentType,
      documentName,
      documentUrl,
    } = body;

    if (
      !employeeId ||
      !documentType ||
      !documentName ||
      !documentUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee ID, document type, document name and document URL are required.",
        },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { employeeId: String(employeeId).trim() },
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

    const document = await prisma.employeeDocument.create({
      data: {
        employeeId: employee.id,
        documentType: String(documentType).trim(),
        documentName: String(documentName).trim(),
        documentUrl: String(documentUrl).trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Employee document added successfully.",
        data: {
          id: document.id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          documentType: document.documentType,
          documentName: document.documentName,
          documentUrl: document.documentUrl,
          uploadedAt: document.uploadedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employee document error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add employee document.",
      },
      { status: 500 }
    );
  }
}
