import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminInsurancePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const insuranceRecords = await prisma.employeeInsurance.findMany({
    include: {
      employee: {
        select: {
          employeeId: true,
          fullName: true,
          designation: true,
          department: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = insuranceRecords.length;
  const submitted = insuranceRecords.filter(
    (item) => item.verificationStatus === "SUBMITTED"
  ).length;
  const underReview = insuranceRecords.filter(
    (item) => item.verificationStatus === "UNDER_REVIEW"
  ).length;
  const verified = insuranceRecords.filter(
    (item) => item.verificationStatus === "VERIFIED"
  ).length;
  const rejected = insuranceRecords.filter(
    (item) => item.verificationStatus === "REJECTED"
  ).length;
  const active = insuranceRecords.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Insurance Management
            </h1>

            <p className="mt-2 text-slate-400">
              Internal employee insurance and policy administration.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Total Insurance</p>
            <p className="mt-2 text-3xl font-bold">{total}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Active Policies</p>
            <p className="mt-2 text-3xl font-bold">{active}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Submitted</p>
            <p className="mt-2 text-3xl font-bold">{submitted}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Under Review</p>
            <p className="mt-2 text-3xl font-bold">{underReview}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Verified</p>
            <p className="mt-2 text-3xl font-bold">{verified}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Rejected</p>
            <p className="mt-2 text-3xl font-bold">{rejected}</p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Insurance Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage employee policy records.
            </p>
          </div>

          {insuranceRecords.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-8 text-center text-sm text-slate-500">
              No insurance records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Employee</th>
                    <th className="px-3 py-3">Insurance</th>
                    <th className="px-3 py-3">Provider</th>
                    <th className="px-3 py-3">Policy Number</th>
                    <th className="px-3 py-3">Validity</th>
                    <th className="px-3 py-3">Policy Status</th>
                    <th className="px-3 py-3">Verification</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {insuranceRecords.map((insurance) => (
                    <tr
                      key={insurance.id}
                      className="border-b border-slate-900 align-top"
                    >
                      <td className="px-3 py-4">
                        <p className="font-semibold">
                          {insurance.employee.fullName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {insurance.employee.employeeId}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {insurance.employee.designation}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        {insurance.insuranceType}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {insurance.provider}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {insurance.policyNumber}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        <div>
                          <p>
                            Start: {formatDate(insurance.startDate)}
                          </p>
                          <p className="mt-1">
                            Expiry: {formatDate(insurance.expiryDate)}
                          </p>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        {insurance.status}
                      </td>

                      <td className="px-3 py-4">
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold">
                          {insurance.verificationStatus.replaceAll(
                            "_",
                            " "
                          )}
                        </span>

                        {insurance.verifiedBy && (
                          <p className="mt-2 text-xs text-slate-500">
                            By: {insurance.verifiedBy}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-4">
                        <Link
                          href={`/admin/insurance/${insurance.id}`}
                          className="font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-200">
          Employee insurance information is confidential personnel
          data and is restricted to authorized ETW administrators.
        </div>
      </div>
    </main>
  );
}