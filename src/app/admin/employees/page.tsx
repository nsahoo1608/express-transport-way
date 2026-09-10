import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type AdminEmployeesPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminEmployeesPage({
  searchParams,
}: AdminEmployeesPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const query = params.q?.trim() || "";
  const status = params.status?.trim() || "";

  const employees = await prisma.employee.findMany({
    where: {
      ...(status
        ? {
            employmentStatus: status,
          }
        : {}),
      ...(query
        ? {
            OR: [
              {
                employeeId: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                fullName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: query,
                },
              },
              {
                designation: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                department: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
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

  const totalEmployees = await prisma.employee.count();

  const activeEmployees = await prisma.employee.count({
    where: {
      employmentStatus: "ACTIVE",
    },
  });

  const inactiveEmployees = await prisma.employee.count({
    where: {
      employmentStatus: {
        not: "ACTIVE",
      },
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
              Internal employee records and workforce information.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
            >
              ← Dashboard
            </Link>

            <Link
              href="/admin/employees/new"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              + Add Employee
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Total Employees</p>
            <p className="mt-2 text-3xl font-bold">
              {totalEmployees}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Active Employees</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {activeEmployees}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Non-Active Employees</p>
            <p className="mt-2 text-3xl font-bold">
              {inactiveEmployees}
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Employee Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {employees.length} matching employee record(s).
              </p>
            </div>

            <form
              action="/admin/employees"
              method="get"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                name="q"
                defaultValue={query}
                placeholder="Search employee, ID, phone, role..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500 sm:w-80"
              />

              <select
                name="status"
                defaultValue={status}
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="TERMINATED">Terminated</option>
                <option value="RESIGNED">Resigned</option>
              </select>

              <button
                type="submit"
                className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Search
              </button>

              {(query || status) && (
                <Link
                  href="/admin/employees"
                  className="rounded-lg border border-slate-700 px-5 py-2.5 text-center text-sm font-semibold text-slate-300 transition hover:border-slate-500"
                >
                  Clear
                </Link>
              )}
            </form>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[1250px] w-full text-left text-sm">
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
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Actions
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
                      {formatDate(employee.joiningDate)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {employee.bloodGroup || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
                        {employee.employmentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/employees/${employee.employeeId}`}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                        >
                          View Profile
                        </Link>

                        <Link
                          href={`/admin/employees/${employee.employeeId}/id-card`}
                          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
                        >
                          ID Card
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No employee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-200">
          This information contains confidential employee data and is
          restricted to authorized ETW administrators.
        </div>
      </div>
    </main>
  );
}