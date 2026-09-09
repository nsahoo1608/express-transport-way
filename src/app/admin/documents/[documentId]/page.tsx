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

  const document = await prisma.employeeDocument.findUnique({
    where: {
      id: documentId,
    },
    include: {
      employee: {
        select: {
          employeeId: true,
          fullName: true,
          phone: true,
          email: true,
          designation: true,
          department: true,
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
            ← Back to Documents
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Document Review
          </h1>

          <p className="mt-2 text-slate-400">
            Review and verify employee documentation
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Employee
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {document.employee.fullName}
              </h2>

              <p className="mt-1 text-emerald-400">
                {document.employee.employeeId}
              </p>
            </div>

            <StatusBadge status={document.verificationStatus} />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Info label="Document Type" value={document.documentType} />
            <Info label="Document Name" value={document.documentName} />
            <Info label="Employee Phone" value={document.employee.phone} />
            <Info
              label="Employee Email"
              value={document.employee.email ?? "Not provided"}
            />
            <Info
              label="Designation"
              value={document.employee.designation}
            />
            <Info
              label="Department"
              value={document.employee.department ?? "Not specified"}
            />
            <Info
              label="Submitted"
              value={formatDate(document.uploadedAt)}
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
              href={document.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Open Document
            </a>
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
            Verified date and administrator identity are recorded
            automatically.
          </p>

          <VerificationActions
            documentId={document.id}
            currentStatus={document.verificationStatus ?? "SUBMITTED"}
          />
        </section>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/10 p-5">
          <p className="text-sm font-semibold text-red-300">
            Confidential Employee Information
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Employee documents and personal information are restricted
            to authorized Express Transport Way administrators.
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