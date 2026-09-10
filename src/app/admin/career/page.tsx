import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function AdminCareerPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) redirect("/admin/login");

  const admin = await verifyAdminSession(token);
  if (!admin) redirect("/admin/login");

  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
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
              Career Applications
            </h1>
            <p className="mt-2 text-slate-400">
              Job applications submitted through ETW careers.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Dashboard
          </Link>
        </div>

        {applications.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">
              No career applications found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              No job applications are currently available.
            </p>
          </section>
        ) : (
          <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <table className="min-w-[1150px] w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Qualification</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-slate-900"
                  >
                    <td className="px-4 py-4 text-slate-400">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">
                        {application.fullName}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {application.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {application.position}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {application.experience || "—"}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {application.qualification || "—"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-emerald-400">
                      {application.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </main>
  );
}