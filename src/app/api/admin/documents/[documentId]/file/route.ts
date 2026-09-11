import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guard";

type RouteContext = {
  params: Promise<{
    documentId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { documentId } = await params;

  const document = await prisma.ownerDocument.findUnique({
    where: {
      id: documentId,
    },
    select: {
      blobPath: true,
      documentName: true,
      fileMimeType: true,
    },
  });

  if (!document || !document.blobPath) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 },
    );
  }

  const result = await get(document.blobPath, {
    access: "private",
  });

  if (!result || result.statusCode !== 200) {
    return NextResponse.json(
      { error: "Document file not found" },
      { status: 404 },
    );
  }

  return new Response(result.stream, {
    status: 200,
    headers: {
      "Content-Type":
        result.blob.contentType ??
        document.fileMimeType ??
        "application/octet-stream",
      "Content-Disposition": `inline; filename="${encodeURIComponent(document.documentName)}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
