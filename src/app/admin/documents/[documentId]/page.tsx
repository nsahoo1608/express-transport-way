import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";
import VerificationActions from "./VerificationActions";

type PageProps = {
  params: Promise<{
    documentId: string;
  }>;
};

export default async function DocumentReviewPage({
  params,
}: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const { documentId } = await params;

  const document = await prisma.ownerDocument.findUnique({
    where: {
      id: documentId,
    },
    include: {
      owner: {
        select: {
          ownerId: true,
          name: true,
          companyName: true,
          phone: true,
          email: true,
          address: true,
          pan: true,
          gstin: true,
          kycStatus: true,
          accountStatus: true,
        },
      },
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/admin/documents"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            â† Back to Documents
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Owner Document Review
          </h1>

          <p className="mt-2 text-slate-400">
            Review and verify documentation submitted by a vehicle owner
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Owner
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {document.owner.name}
              </h2>

              {document.owner.companyName && (
                <p className="mt-1 text-slate-400">
                  {document.owner.companyName}
                </p>
              )}

              <p className="mt-1 font-mono text-emerald-400">
                {document.owner.ownerId}
              </p>
            </div>

            <StatusBadge status={document.verificationStatus} />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Info
              label="Document Type"
              value={document.documentType}
            />

            <Info
              label="Document Name"
              value={document.documentName}
            />

            <Info
              label="Owner Phone"
              value={document.owner.phone}
            />

            <Info
              label="Owner Email"
              value={document.owner.email ?? "Not provided"}
            />

            <Info
              label="Owner KYC Status"
              value={document.owner.kycStatus}
            />

            <Info
              label="Account Status"
              value={document.owner.accountStatus}
            />

            <Info
              label="Submitted"
              value={formatDate(document.createdAt)}
            />

            <Info
              label="Verified By"
              value={document.verifiedBy ?? "Not verified"}
            />

            <Info
              label="Verified At"
              value={
                document.verifiedAt
                  ? formatDate(document.verifiedAt)
                  : "Not verified"
              }
            />
          </div>

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm font-medium text-slate-300">
              Document
            </p>

            <p className="mt-2 break-all text-sm text-slate-400">
              {document.documentUrl}
            </p>

            <a
          href={`/api/admin/documents/${document.id}/file`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Open Document
            </a>
          </div>

          <div className="mt-6 rounded-xl border border-blue-900/50 bg-blue-950/10 p-5">
            <p className="text-sm font-semibold text-blue-300">
              Evidence & Upload Details
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Info
                label="Document Reference"
                value={document.documentReference ?? "Not recorded"}
              />

              <Info
                label="Upload Time"
                value={formatDate(document.createdAt)}
              />

              <Info
                label="File Size"
                value={
                  document.fileSize
                    ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB`
                    : "Not recorded"
                }
              />

              <Info
                label="MIME Type"
                value={document.fileMimeType ?? "Not recorded"}
              />

              <Info
                label="Upload IP"
                value={document.uploadedIp ?? "Not recorded"}
              />

              <Info
                label="Blob Path"
                value={document.blobPath ?? "Not recorded"}
              />
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                SHA-256 File Hash
              </p>

              <p className="mt-2 break-all font-mono text-xs text-slate-300">
                {document.fileHash ?? "Not recorded"}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Upload User-Agent / Device
              </p>

              <p className="mt-2 break-all text-xs text-slate-400">
                {document.uploadedUserAgent ?? "Not recorded"}
              </p>
            </div>
          </div>
          {document.verificationRemarks && (
            <div className="mt-6 rounded-xl border border-amber-900/60 bg-amber-950/20 p-5">
              <p className="text-sm font-semibold text-amber-300">
                Verification Remarks
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">
                {document.verificationRemarks}
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Verification Actions
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Verification changes are processed securely by the server.
            Administrator identity, verification time and remarks are
            recorded with the document.
          </p>

          <VerificationActions
            documentId={document.id}
            currentStatus={document.verificationStatus ?? "SUBMITTED"}
          />
        </section>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/10 p-5">
          <p className="text-sm font-semibold text-red-300">
            Confidential Owner Information
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Owner documents and personal information are restricted to
            authorized Express Transport Way administrators.
          </p>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-200">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    SUBMITTED:
      "border-amber-500/40 bg-amber-500/10 text-amber-300",
    UNDER_REVIEW:
      "border-blue-500/40 bg-blue-500/10 text-blue-300",
    VERIFIED:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    REJECTED:
      "border-red-500/40 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${
        styles[status] ??
        "border-slate-700 bg-slate-800 text-slate-300"
      }`}
    >
      {(status ?? "SUBMITTED").replaceAll("_", " ")}
    </span>
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}
