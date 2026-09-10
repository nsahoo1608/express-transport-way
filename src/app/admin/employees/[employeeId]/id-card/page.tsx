import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";

type EmployeeIdCardPageProps = {
  params: Promise<{ employeeId: string }>;
};

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function EmployeeIdCardPage({
  params,
}: EmployeeIdCardPageProps) {
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
      joiningDate: true,
      bloodGroup: true,
      employmentStatus: true,
    },
  });

  if (!employee) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Employee ID Card
            </h1>

            <p className="mt-2 text-slate-400">
              Official employee identification preview generated from
              the ETW personnel database.
            </p>
          </div>

          <Link
            href={`/admin/employees/${employee.employeeId}`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Back to Employee
          </Link>
        </div>

        <section className="flex justify-center">
          <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-700 bg-white text-slate-950 shadow-2xl">
            <div className="bg-slate-950 px-6 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Express Transport Way
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Mining & Industrial Transportation
              </h2>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-20 items-center justify-center rounded-xl border-2 border-slate-300 bg-slate-100 text-center text-xs font-semibold text-slate-500">
                  PHOTO
                  <br />
                  PLACEHOLDER
                </div>

                <div className="min-w-0">
                  <p className="text-xl font-extrabold uppercase">
                    {employee.fullName}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    {employee.designation}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {employee.department || "—"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">
                <div className="flex justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Employee ID
                  </span>

                  <span className="text-right text-sm font-bold">
                    {employee.employeeId}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joining Date
                  </span>

                  <span className="text-right text-sm font-semibold">
                    {formatDate(employee.joiningDate)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Blood Group
                  </span>

                  <span className="text-right text-sm font-bold text-red-700">
                    {employee.bloodGroup || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </span>

                  <span className="text-right text-sm font-bold">
                    {employee.employmentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Authorized Personnel Identification
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
          This is an internal employee identification record.
          Final ID-card printing, employee photograph, signatures,
          and physical security features should be added before
          issuing an official card.
        </div>
      </div>
    </main>
  );
}