import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth/guard";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

function safeFileName(name: string) {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
}

export async function GET() {
  try {
    const ownerSession = await requireOwner();

    if (!ownerSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner authentication is required.",
        },
        { status: 401 }
      );
    }

    const owner = await prisma.vehicleOwner.findUnique({
      where: {
        ownerId: ownerSession.ownerId,
      },
      select: {
        id: true,
        accountStatus: true,
      },
    });

    if (!owner) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account was not found.",
        },
        { status: 404 }
      );
    }

    if (owner.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account is not active.",
        },
        { status: 403 }
      );
    }

    const documents = await prisma.ownerDocument.findMany({
      where: {
        ownerId: owner.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        documentType: true,
        documentName: true,
        documentUrl: true,
        verificationStatus: true,
        verificationRemarks: true,
        verifiedBy: true,
        verifiedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Owner document listing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load documents.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let uploadedBlobUrl: string | null = null;

  try {
    const ownerSession = await requireOwner();

    if (!ownerSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner authentication is required.",
        },
        { status: 401 }
      );
    }

    const owner = await prisma.vehicleOwner.findUnique({
      where: {
        ownerId: ownerSession.ownerId,
      },
      select: {
        id: true,
        ownerId: true,
        accountStatus: true,
      },
    });

    if (!owner) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account was not found.",
        },
        { status: 404 }
      );
    }

    if (owner.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Owner account is not active.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const documentType = String(
      formData.get("documentType") ?? ""
    ).trim();

    const fileEntry = formData.get("file");

    if (!documentType) {
      return NextResponse.json(
        {
          success: false,
          message: "Document type is required.",
        },
        { status: 400 }
      );
    }

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a document file.",
        },
        { status: 400 }
      );
    }

    if (fileEntry.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected file is empty.",
        },
        { status: 400 }
      );
    }

    if (fileEntry.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File size must not exceed 4 MB.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(fileEntry.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF, JPG and PNG documents are allowed.",
        },
        { status: 400 }
      );
    }

    const originalName = fileEntry.name || "document";
    const cleanedName = safeFileName(originalName);

    // Capture the actual uploaded file bytes for SHA-256 evidence.
    const fileBuffer = await fileEntry.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);

    const fileHash = Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    const blobPath =
      `owner-documents/${owner.ownerId}/` +
      `${crypto.randomUUID()}-${cleanedName}`;

    // Capture request/network evidence.
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    const uploadedIp =
      forwardedFor?.split(",")[0]?.trim() ||
      realIp?.trim() ||
      null;

    const uploadedUserAgent =
      request.headers.get("user-agent") || null;

    const documentReference =
      `ETW-DOC-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;

    const blob = await put(blobPath, fileEntry, {
      access: "private",
      addRandomSuffix: false,
    });

    uploadedBlobUrl = blob.url;

    const document = await prisma.ownerDocument.create({
      data: {
        documentType,
        documentName: originalName,
        documentUrl: blob.url,
        documentReference,
        fileHash,
        fileSize: fileEntry.size,
        fileMimeType: fileEntry.type,
        blobPath,
        uploadedIp,
        uploadedUserAgent,
        ownerId: owner.id,
        verificationStatus: "SUBMITTED",
      },
      select: {
        id: true,
        documentType: true,
        documentName: true,
        documentReference: true,
        fileHash: true,
        fileSize: true,
        fileMimeType: true,
        blobPath: true,
        verificationStatus: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully.",
        data: document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Owner document upload error:", error);

    if (uploadedBlobUrl) {
      try {
        await del(uploadedBlobUrl);
      } catch (deleteError) {
        console.error(
          "Unable to remove orphaned uploaded document:",
          deleteError
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to upload document.",
      },
      { status: 500 }
    );
  }
}
