import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      phone,
      email,
      position,
      experience,
      qualification,
      address,
      resumeUrl,
      coverLetter,
    } = body;

    if (!fullName || !phone || !position) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, phone number and position are required.",
        },
        { status: 400 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        position: String(position).trim(),
        experience: experience ? String(experience).trim() : null,
        qualification: qualification
          ? String(qualification).trim()
          : null,
        address: address ? String(address).trim() : null,
        resumeUrl: resumeUrl ? String(resumeUrl).trim() : null,
        coverLetter: coverLetter ? String(coverLetter).trim() : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Job application received successfully.",
        data: {
          id: application.id,
          fullName: application.fullName,
          phone: application.phone,
          email: application.email,
          position: application.position,
          status: application.status,
          createdAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Job application error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit job application.",
      },
      { status: 500 }
    );
  }
}
