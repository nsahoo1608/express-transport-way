import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";
import VerificationActions from "./VerificationActions";

type InsuranceReviewPageProps = {
  params: Promise<{ insuranceId: string }>;
};

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function display(value: string | null | undefined) {
  return value?.trim() || "—";
}

export default async function InsuranceReviewPage({
  params,
}: InsuranceReviewPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const { insuranceId } = await params;

  const insurance = await prisma.employeeInsurance.findUnique({
    where: {
      id: insuranceId,
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

  if (!insurance) {
    notFound();
  }

  const status = insurance.verificationStatus ?? "SUBMITTED";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Insurance Review
            </h1>

            <p className="mt-2 text-slate-400">
              Review employee insurance and verification records.
            </p>
          </div>

          <Link
            href="/admin/insurance"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Back to Insurance
          </Link>
        </div>

        <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Employee
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {insurance.employee.fullName}
              </h2>

              <p className="mt-1 text-slate-400">
                {insurance.employee.employeeId}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Verification Status
              </p>

              <p className="mt-2 text-lg font-bold text-emerald-400">
                {status.replaceAll("_", " ")}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Employee Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Employee ID
              </p>
              <p className="mt-1 font-semibold">
                {insurance.employee.employeeId}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Full Name
              </p>
              <p className="mt-1">{insurance.employee.fullName}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Phone
              </p>
              <p className="mt-1">{insurance.employee.phone}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Email
              </p>
              <p className="mt-1">{display(insurance.employee.email)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Designation
              </p>
              <p className="mt-1">{insurance.employee.designation}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Department
              </p>
              <p className="mt-1">
                {display(insurance.employee.department)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Insurance Policy
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Insurance Type
              </p>
              <p className="mt-1 font-semibold">
                {insurance.insuranceType}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Provider
              </p>
              <p className="mt-1">{insurance.provider}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Policy Number
              </p>
              <p className="mt-1">{insurance.policyNumber}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Coverage Amount
              </p>
              <p className="mt-1">
                {insurance.coverageAmount
                  ? insurance.coverageAmount.toString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Start Date
              </p>
              <p className="mt-1">
                {formatDate(insurance.startDate)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Expiry Date
              </p>
              <p className="mt-1">
                {formatDate(insurance.expiryDate)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Policy Status
              </p>
              <p className="mt-1">{insurance.status}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Submitted
              </p>
              <p className="mt-1">
                {formatDate(insurance.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Last Updated
              </p>
              <p className="mt-1">
                {formatDate(insurance.updatedAt)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Policy Document
          </h2>

          {insurance.policyDocumentUrl ? (
            <a
              href={insurance.policyDocumentUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Open Policy Document
            </a>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No policy document URL has been recorded.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Verification Audit
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Status
              </p>
              <p className="mt-1 font-semibold">
                {status.replaceAll("_", " ")}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Verified By
              </p>
              <p className="mt-1">
                {display(insurance.verifiedBy)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Verified At
              </p>
              <p className="mt-1">
                {formatDate(insurance.verifiedAt)}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Verification Remarks
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {display(insurance.verificationRemarks)}
            </p>
          </div>
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
            insuranceId={insurance.id}
            currentStatus={insurance.verificationStatus ?? "SUBMITTED"}
          />
        </section>

        <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
          Insurance information is confidential employee data.
          Verification actions are restricted to authorized ETW
          administrators.
        </div>
      </div>
    </main>
  );
}