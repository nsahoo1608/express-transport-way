import { NextRequest, NextResponse } from "next/server";
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
export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ employeeId: string }>;
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
    const { employeeId } = await context.params;
    const body = await request.json();

    const existingEmployee = await prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found.",
        },
        { status: 404 }
      );
    }

    const requiredFields = [
      "fullName",
      "phone",
      "designation",
      "joiningDate",
    ];

    for (const field of requiredFields) {
      if (
        typeof body?.[field] !== "string" ||
        !body[field].trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required.`,
          },
          { status: 400 }
        );
      }
    }

    const joiningDate = new Date(body.joiningDate);

    if (Number.isNaN(joiningDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid joining date.",
        },
        { status: 400 }
      );
    }

    let dateOfBirth: Date | null = null;

    if (
      typeof body.dateOfBirth === "string" &&
      body.dateOfBirth.trim()
    ) {
      dateOfBirth = new Date(body.dateOfBirth);

      if (Number.isNaN(dateOfBirth.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid date of birth.",
          },
          { status: 400 }
        );
      }
    }

    const updateData = {
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email:
        typeof body.email === "string" && body.email.trim()
          ? body.email.trim()
          : null,
      dateOfBirth,
      gender:
        typeof body.gender === "string" && body.gender.trim()
          ? body.gender.trim()
          : null,
      address:
        typeof body.address === "string" && body.address.trim()
          ? body.address.trim()
          : null,
      designation: body.designation.trim(),
      department:
        typeof body.department === "string" && body.department.trim()
          ? body.department.trim()
          : null,
      joiningDate,
      employmentType:
        typeof body.employmentType === "string" &&
        body.employmentType.trim()
          ? body.employmentType.trim()
          : null,
      employmentStatus:
        typeof body.employmentStatus === "string" &&
        body.employmentStatus.trim()
          ? body.employmentStatus.trim()
          : "ACTIVE",
      bloodGroup:
        typeof body.bloodGroup === "string" &&
        body.bloodGroup.trim()
          ? body.bloodGroup.trim()
          : null,
      maritalStatus:
        typeof body.maritalStatus === "string" &&
        body.maritalStatus.trim()
          ? body.maritalStatus.trim()
          : null,
      spouseName:
        typeof body.spouseName === "string" &&
        body.spouseName.trim()
          ? body.spouseName.trim()
          : null,
      emergencyContactName:
        typeof body.emergencyContactName === "string" &&
        body.emergencyContactName.trim()
          ? body.emergencyContactName.trim()
          : null,
      emergencyContactRelationship:
        typeof body.emergencyContactRelationship === "string" &&
        body.emergencyContactRelationship.trim()
          ? body.emergencyContactRelationship.trim()
          : null,
      emergencyContactPhone:
        typeof body.emergencyContactPhone === "string" &&
        body.emergencyContactPhone.trim()
          ? body.emergencyContactPhone.trim()
          : null,
      emergencyContactAltPhone:
        typeof body.emergencyContactAltPhone === "string" &&
        body.emergencyContactAltPhone.trim()
          ? body.emergencyContactAltPhone.trim()
          : null,
      emergencyContactAddress:
        typeof body.emergencyContactAddress === "string" &&
        body.emergencyContactAddress.trim()
          ? body.emergencyContactAddress.trim()
          : null,
    };

    const fieldsToAudit = [
      "fullName",
      "phone",
      "email",
      "dateOfBirth",
      "gender",
      "address",
      "designation",
      "department",
      "joiningDate",
      "employmentType",
      "employmentStatus",
      "bloodGroup",
      "maritalStatus",
      "spouseName",
      "emergencyContactName",
      "emergencyContactRelationship",
      "emergencyContactPhone",
      "emergencyContactAltPhone",
      "emergencyContactAddress",
    ] as const;

    const auditEntries = fieldsToAudit
      .filter((field) => {
        const previous = existingEmployee[field];
        const next = updateData[field];

        if (previous instanceof Date && next instanceof Date) {
          return previous.getTime() !== next.getTime();
        }

        return String(previous ?? "") !== String(next ?? "");
      })
      .map((field) => {
        const previous = existingEmployee[field];
        const next = updateData[field];

        return {
          employeeId: existingEmployee.id,
          adminEmail: admin.email,
          action: "UPDATE",
          fieldName: field,
          previousValue:
            previous instanceof Date
              ? previous.toISOString()
              : previous == null
                ? null
                : String(previous),
          newValue:
            next instanceof Date
              ? next.toISOString()
              : next == null
                ? null
                : String(next),
        };
      });

    const result = await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.update({
        where: {
          employeeId,
        },
        data: updateData,
      });

      if (auditEntries.length > 0) {
        await tx.employeeAuditLog.createMany({
          data: auditEntries,
        });
      }

      return employee;
    });

    return NextResponse.json({
      success: true,
      message:
        auditEntries.length > 0
          ? `Employee updated successfully. ${auditEntries.length} change(s) recorded in the audit log.`
          : "Employee update submitted with no field changes.",
      data: result,
      auditCount: auditEntries.length,
    });
  } catch (error) {
    console.error("Employee update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update employee.",
      },
      { status: 500 }
    );
  }
}