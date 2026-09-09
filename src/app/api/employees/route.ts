import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

async function generateEmployeeId() {
  const count = await prisma.employee.count();
  let number = count + 1;

  while (true) {
    const employeeId = `ETW-EMP-${String(number).padStart(4, "0")}`;

    const existing = await prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!existing) {
      return employeeId;
    }

    number++;
  }
}

export async function GET() {
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

    const employees = await prisma.employee.findMany({
      orderBy: {
        employeeId: "asc",
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

    return NextResponse.json({
      success: true,
      message: "Employees retrieved successfully.",
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error("Employee list API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve employees.",
      },
      { status: 500 }
    );
  }
}

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
      fullName,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      designation,
      department,
      joiningDate,
      employmentType,
      employmentStatus,
      bloodGroup,
      maritalStatus,
      spouseName,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      emergencyContactAltPhone,
      emergencyContactAddress,
    } = body;

    if (!fullName || !phone || !designation || !joiningDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Full name, phone number, designation and joining date are required.",
        },
        { status: 400 }
      );
    }

    const employeeId = await generateEmployeeId();

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender ? String(gender).trim() : null,
        address: address ? String(address).trim() : null,
        designation: String(designation).trim(),
        department: department ? String(department).trim() : null,
        joiningDate: new Date(joiningDate),
        employmentType: employmentType
          ? String(employmentType).trim()
          : null,
        employmentStatus: employmentStatus
          ? String(employmentStatus).trim()
          : "ACTIVE",
        bloodGroup: bloodGroup ? String(bloodGroup).trim() : null,
        maritalStatus: maritalStatus ? String(maritalStatus).trim() : null,
        spouseName: spouseName ? String(spouseName).trim() : null,
        emergencyContactName: emergencyContactName
          ? String(emergencyContactName).trim()
          : null,
        emergencyContactRelationship:
          emergencyContactRelationship
            ? String(emergencyContactRelationship).trim()
            : null,
        emergencyContactPhone: emergencyContactPhone
          ? String(emergencyContactPhone).trim()
          : null,
        emergencyContactAltPhone: emergencyContactAltPhone
          ? String(emergencyContactAltPhone).trim()
          : null,
        emergencyContactAddress: emergencyContactAddress
          ? String(emergencyContactAddress).trim()
          : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully.",
        data: {
          id: employee.id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          phone: employee.phone,
          designation: employee.designation,
          department: employee.department,
          joiningDate: employee.joiningDate,
          employmentStatus: employee.employmentStatus,
          createdAt: employee.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employee creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create employee.",
      },
      { status: 500 }
    );
  }
}
