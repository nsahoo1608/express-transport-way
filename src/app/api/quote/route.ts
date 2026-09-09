import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      applicantType,
      onBehalfOf,
      material,
      from,
      to,
      requirement,
    } = body;

    if (
      !name ||
      !phone ||
      !applicantType ||
      !onBehalfOf ||
      !material ||
      !from ||
      !to
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields.",
        },
        { status: 400 }
      );
    }

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        applicantType: String(applicantType).trim(),
        onBehalfOf: String(onBehalfOf).trim(),
        material: String(material).trim(),
        from: String(from).trim(),
        to: String(to).trim(),
        requirement: requirement ? String(requirement).trim() : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Quote request received successfully.",
        data: {
          id: quoteRequest.id,
          name: quoteRequest.name,
          phone: quoteRequest.phone,
          applicantType: quoteRequest.applicantType,
          onBehalfOf: quoteRequest.onBehalfOf,
          material: quoteRequest.material,
          from: quoteRequest.from,
          to: quoteRequest.to,
          requirement: quoteRequest.requirement,
          status: quoteRequest.status,
          createdAt: quoteRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote request error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save quote request.",
      },
      { status: 500 }
    );
  }
}
