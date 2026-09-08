import { NextResponse } from "next/server";

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

    return NextResponse.json(
      {
        success: true,
        message: "Quote request received successfully.",
        data: {
          name,
          phone,
          applicantType,
          onBehalfOf,
          material,
          from,
          to,
          requirement: requirement || "",
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request.",
      },
      { status: 400 }
    );
  }
}
