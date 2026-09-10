import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminSalaryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) redirect("/admin/login");

  const salaryRecords = await prisma.employeeSalary.findMany({
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
    orderBy: { effectiveFrom: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>
            <h1 className="mt-3 text-3xl font-bold">
              Salary Management
            </h1>
            <p className="mt-2 text-slate-400">
              Confidential employee salary records.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Dashboard
          </Link>
        </div>

        {salaryRecords.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">
              No salary records found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              No employee salary records are currently available.
            </p>
          </section>
        ) : (
          <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Basic</th>
                  <th className="px-4 py-3">Allowances</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Effective From</th>
                  <th className="px-4 py-3">Effective To</th>
                </tr>
              </thead>
              <tbody>
                {salaryRecords.map((salary) => (
                  <tr key={salary.id} className="border-b border-slate-900">
                    <td className="px-4 py-4">
                      <div className="font-semibold">
                        {salary.employee.fullName}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {salary.employee.employeeId}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {salary.basicSalary.toString()}
                    </td>
                    <td className="px-4 py-4">
                      {salary.allowances.toString()}
                    </td>
                    <td className="px-4 py-4">
                      {salary.deductions.toString()}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {formatDate(salary.effectiveFrom)}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {salary.effectiveTo
                        ? formatDate(salary.effectiveTo)
                        : "Open"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-200">
          Salary information is confidential personnel data and is
          restricted to authorized ETW administrators.
        </div>
      </div>
    </main>
  );
}