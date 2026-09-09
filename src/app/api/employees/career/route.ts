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
      designation,
      department,
      effectiveDate,
      previousDesignation,
      remarks,
    } = body;

    if (!employeeId || !designation || !effectiveDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee ID, designation and effective date are required.",
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

    const careerRecord = await prisma.employeeCareerHistory.create({
      data: {
        employeeId: employee.id,
        designation: String(designation).trim(),
        department: department ? String(department).trim() : null,
        effectiveDate: new Date(effectiveDate),
        previousDesignation: previousDesignation
          ? String(previousDesignation).trim()
          : null,
        remarks: remarks ? String(remarks).trim() : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Employee career history added successfully.",
        data: {
          id: careerRecord.id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          designation: careerRecord.designation,
          department: careerRecord.department,
          effectiveDate: careerRecord.effectiveDate,
          previousDesignation: careerRecord.previousDesignation,
          remarks: careerRecord.remarks,
          createdAt: careerRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employee career history error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add employee career history.",
      },
      { status: 500 }
    );
  }
}
