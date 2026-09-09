import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function AdminEmployeesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const employees = await prisma.employee.findMany({
    orderBy: {
      employeeId: "asc",
    },
    select: {
      employeeId: true,
      fullName: true,
      phone: true,
      email: true,
      designation: true,
      department: true,
      joiningDate: true,
      employmentType: true,
      employmentStatus: true,
      bloodGroup: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Employee Management
            </h1>

            <p className="mt-2 text-slate-400">
              Internal employee records and workforce information
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Dashboard
          </a>
        </div>

        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Employee Records</h2>
              <p className="mt-1 text-sm text-slate-400">
                {employees.length} employee
                {employees.length === 1 ? "" : "s"} in the system
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Employee ID
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Employee
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Designation
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Department
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Joining Date
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Blood Group
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {employees.map((employee) => (
                  <tr
                    key={employee.employeeId}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-emerald-400">
                      {employee.employeeId}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-white">
                        {employee.fullName}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {employee.phone}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {employee.designation}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                      {employee.department || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                      {new Date(employee.joiningDate).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {employee.bloodGroup || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
                        {employee.employmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No employee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-900/50 bg-amber-950/20 p-5">
          <h2 className="font-semibold text-amber-300">
            Confidential Employee Data
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            This information is restricted to authorized ETW
            administrators and must not be exposed through public
            pages or public APIs.
          </p>
        </div>
      </div>
    </main>
  );
}