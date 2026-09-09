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
      amount,
      advanceDate,
      reason,
      recoveredAmount,
      status,
      notes,
    } = body;

    if (!employeeId || amount === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID and advance amount are required.",
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

    const advanceRecord = await prisma.employeeAdvance.create({
      data: {
        employeeId: employee.id,
        amount: String(amount),
        advanceDate: advanceDate ? new Date(advanceDate) : new Date(),
        reason: reason ? String(reason).trim() : null,
        recoveredAmount:
          recoveredAmount !== undefined && recoveredAmount !== null
            ? String(recoveredAmount)
            : "0",
        status: status ? String(status).trim().toUpperCase() : "PENDING",
        notes: notes ? String(notes).trim() : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Employee advance record added successfully.",
        data: {
          id: advanceRecord.id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          amount: advanceRecord.amount,
          advanceDate: advanceRecord.advanceDate,
          reason: advanceRecord.reason,
          recoveredAmount: advanceRecord.recoveredAmount,
          status: advanceRecord.status,
          notes: advanceRecord.notes,
          createdAt: advanceRecord.createdAt,
          updatedAt: advanceRecord.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employee advance error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add employee advance record.",
      },
      { status: 500 }
    );
  }
}
