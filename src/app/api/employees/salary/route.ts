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
      basicSalary,
      allowances,
      deductions,
      effectiveFrom,
      effectiveTo,
    } = body;

    if (!employeeId || basicSalary === undefined || !effectiveFrom) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee ID, basic salary and effective-from date are required.",
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

    const salaryRecord = await prisma.employeeSalary.create({
      data: {
        employeeId: employee.id,
        basicSalary: String(basicSalary),
        allowances:
          allowances !== undefined && allowances !== null
            ? String(allowances)
            : "0",
        deductions:
          deductions !== undefined && deductions !== null
            ? String(deductions)
            : "0",
        effectiveFrom: new Date(effectiveFrom),
        effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Employee salary record added successfully.",
        data: {
          id: salaryRecord.id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          basicSalary: salaryRecord.basicSalary,
          allowances: salaryRecord.allowances,
          deductions: salaryRecord.deductions,
          effectiveFrom: salaryRecord.effectiveFrom,
          effectiveTo: salaryRecord.effectiveTo,
          createdAt: salaryRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employee salary error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add employee salary record.",
      },
      { status: 500 }
    );
  }
}
