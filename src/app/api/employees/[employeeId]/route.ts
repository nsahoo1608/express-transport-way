import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

type RouteContext = {
  params: Promise<{
    employeeId: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
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

    const { employeeId } = await context.params;

    if (!employeeId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required.",
        },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: {
        employeeId: employeeId.trim(),
      },
      include: {
        careerHistory: {
          orderBy: {
            effectiveDate: "desc",
          },
        },
        documents: {
          orderBy: {
            uploadedAt: "desc",
          },
        },
        salaryHistory: {
          orderBy: {
            effectiveFrom: "desc",
          },
        },
        advanceHistory: {
          orderBy: {
            advanceDate: "desc",
          },
        },
        insuranceHistory: {
          orderBy: {
            startDate: "desc",
          },
        },
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

    return NextResponse.json({
      success: true,
      message: "Employee details retrieved successfully.",
      data: employee,
    });
  } catch (error) {
    console.error("Employee detail API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve employee details.",
      },
      { status: 500 }
    );
  }
}