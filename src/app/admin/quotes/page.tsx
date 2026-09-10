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

export default async function AdminQuotesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) redirect("/admin/login");

  const admin = await verifyAdminSession(token);
  if (!admin) redirect("/admin/login");

  const quotes = await prisma.quoteRequest.findMany({
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
            <h1 className="mt-3 text-3xl font-bold">Quote Management</h1>
            <p className="mt-2 text-slate-400">
              Customer transport quote requests.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Dashboard
          </Link>
        </div>

        {quotes.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">No quote requests found</h2>
            <p className="mt-2 text-sm text-slate-500">
              No customer quote requests are currently available.
            </p>
          </section>
        ) : (
          <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Requirement</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-slate-900">
                    <td className="px-4 py-4 text-slate-400">
                      {formatDate(quote.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">{quote.name}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {quote.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4">{quote.material}</td>
                    <td className="px-4 py-4 text-slate-400">
                      {quote.from} → {quote.to}
                    </td>
                    <td className="max-w-[300px] px-4 py-4 text-slate-400">
                      {quote.requirement || "—"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-emerald-400">
                      {quote.status}
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