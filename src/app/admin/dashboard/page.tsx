import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
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

  const [
    employees,
    activeEmployees,
    documents,
    submittedDocuments,
    underReviewDocuments,
    verifiedDocuments,
    insurance,
    activeInsurance,
    quotes,
    newQuotes,
    applications,
    receivedApplications,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({
      where: { employmentStatus: "ACTIVE" },
    }),
    prisma.employeeDocument.count(),
    prisma.employeeDocument.count({
      where: { verificationStatus: "SUBMITTED" },
    }),
    prisma.employeeDocument.count({
      where: { verificationStatus: "UNDER_REVIEW" },
    }),
    prisma.employeeDocument.count({
      where: { verificationStatus: "VERIFIED" },
    }),
    prisma.employeeInsurance.count(),
    prisma.employeeInsurance.count({
      where: { status: "ACTIVE" },
    }),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({
      where: { status: "NEW" },
    }),
    prisma.jobApplication.count(),
    prisma.jobApplication.count({
      where: { status: "RECEIVED" },
    }),
  ]);

  const cards = [
    {
      title: "Employees",
      value: employees,
      detail: `${activeEmployees} active`,
      href: "/admin/employees",
    },
    {
      title: "Documents",
      value: documents,
      detail: `${submittedDocuments} submitted`,
      href: "/admin/documents",
    },
    {
      title: "Under Review",
      value: underReviewDocuments,
      detail: "documents awaiting review",
      href: "/admin/documents",
    },
    {
      title: "Verified Documents",
      value: verifiedDocuments,
      detail: "verified records",
      href: "/admin/documents",
    },
    {
      title: "Insurance",
      value: insurance,
      detail: `${activeInsurance} active policies`,
      href: "/admin/insurance",
    },
    {
      title: "Quote Requests",
      value: quotes,
      detail: `${newQuotes} new`,
      href: "/admin/quotes",
    },
    {
      title: "Career Applications",
      value: applications,
      detail: `${receivedApplications} received`,
      href: "/admin/career",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Express Transport Way
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Administration Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Secure operational overview for ETW administration.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Signed in as {admin.email}
          </p>
        </div>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500/50 hover:bg-slate-900/80"
            >
              <p className="text-sm font-medium text-slate-400">
                {card.title}
              </p>

              <p className="mt-3 text-4xl font-bold text-white">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {card.detail}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Administration Modules
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/employees"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm font-semibold hover:border-emerald-500/50"
            >
              Employee Management
            </Link>

            <Link
              href="/admin/documents"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm font-semibold hover:border-emerald-500/50"
            >
              Employee Documents
            </Link>

            <Link
              href="/admin/insurance"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm font-semibold hover:border-emerald-500/50"
            >
              Employee Insurance
            </Link>

            <Link
              href="/admin/quotes"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm font-semibold hover:border-emerald-500/50"
            >
              Quote Management
            </Link>

            <Link
              href="/admin/salary"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm font-semibold hover:border-emerald-500/50"
            >
              Salary Management
            </Link>

            <Link
              href="/admin/career"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm font-semibold hover:border-emerald-500/50"
            >
              Career & Promotion
            </Link>
          </div>
        </section>

        <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
          Administrative information is restricted to authorized ETW
          personnel. Employee documents, salary records and other
          confidential information must not be shared publicly.
        </div>
      </div>
    </main>
  );
}