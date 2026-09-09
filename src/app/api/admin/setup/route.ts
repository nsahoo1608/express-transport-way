import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const existingAdmin = await prisma.adminUser.findFirst();

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin setup has already been completed.",
        },
        { status: 409 }
      );
    }

    const body = await request.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(String(password), 12);

    const admin = await prisma.adminUser.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        passwordHash,
        role: "ADMIN",
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully.",
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive,
          createdAt: admin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin setup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create admin account.",
      },
      { status: 500 }
    );
  }
}
