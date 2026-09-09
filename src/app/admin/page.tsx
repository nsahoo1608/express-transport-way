import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Express Transport Way
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold">
                Administration Dashboard
              </h1>

              <p className="mt-2 text-slate-400">
                Secure internal management system
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Signed in as{" "}
              <span className="font-medium text-white">
                {admin.email}
              </span>
            </div>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Employees"
            description="Employee profiles, joining details and status."
            href="/admin/employees"
          />

          <DashboardCard
            title="Documents"
            description="Review and verify employee documents."
            href="/admin/documents"
          />

          <DashboardCard
            title="Insurance"
            description="Employee insurance and policy records."
            href="/admin/insurance"
          />

          <DashboardCard
            title="Quote Requests"
            description="Manage incoming transportation enquiries."
            href="/admin/quotes"
          />
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <DashboardCard
            title="Salary Management"
            description="Employee salary history and effective dates."
            href="/admin/salary"
          />

          <DashboardCard
            title="Career & Promotion"
            description="Designation and career history."
            href="/admin/career"
          />
        </section>

        <div className="mt-10 rounded-xl border border-amber-900/50 bg-amber-950/20 p-5">
          <h2 className="font-semibold text-amber-300">
            Internal System
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Employee personal information, documents, salary,
            insurance and other internal records are restricted
            to authorized ETW administrators.
          </p>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-0.5 hover:border-emerald-700 hover:bg-slate-900/80"
    >
      <h2 className="text-lg font-semibold text-white group-hover:text-emerald-400">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <span className="mt-5 inline-block text-sm font-medium text-emerald-500">
        Open →
      </span>
    </a>
  );
}