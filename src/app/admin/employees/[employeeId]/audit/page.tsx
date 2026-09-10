import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";

type EmployeeAuditPageProps = {
  params: Promise<{ employeeId: string }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(value);
}

function display(value: string | null | undefined) {
  return value?.trim() || "—";
}

export default async function EmployeeAuditPage({
  params,
}: EmployeeAuditPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const { employeeId } = await params;

  const employee = await prisma.employee.findUnique({
    where: {
      employeeId,
    },
    select: {
      employeeId: true,
      fullName: true,
      designation: true,
      department: true,
      auditLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Employee Audit History
            </h1>

            <p className="mt-2 text-slate-400">
              Administrative history of changes made to this employee
              record.
            </p>
          </div>

          <Link
            href={`/admin/employees/${employee.employeeId}`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Back to Employee
          </Link>
        </div>

        <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Employee
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {employee.fullName}
              </h2>

              <p className="mt-1 text-slate-400">
                {employee.employeeId} • {employee.designation}
                {employee.department
                  ? ` • ${employee.department}`
                  : ""}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Audit Entries
              </p>

              <p className="mt-2 text-2xl font-bold">
                {employee.auditLogs.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Change History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Each employee-field change records the administrator,
              previous value, new value, and timestamp.
            </p>
          </div>

          {employee.auditLogs.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-10 text-center text-sm text-slate-500">
              No employee changes have been recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Administrator</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Field</th>
                    <th className="px-4 py-3">Previous Value</th>
                    <th className="px-4 py-3">New Value</th>
                  </tr>
                </thead>

                <tbody>
                  {employee.auditLogs.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-slate-900 align-top"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-slate-400">
                        {formatDate(entry.createdAt)}
                      </td>

                      <td className="px-4 py-4 text-slate-300">
                        {entry.adminEmail}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                          {entry.action}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold text-white">
                        {entry.fieldName}
                      </td>

                      <td className="max-w-[280px] break-words px-4 py-4 text-slate-400">
                        {display(entry.previousValue)}
                      </td>

                      <td className="max-w-[280px] break-words px-4 py-4 text-emerald-300">
                        {display(entry.newValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-200">
          Employee audit history contains confidential administrative
          information and is restricted to authorized ETW administrators.
        </div>
      </div>
    </main>
  );
}