import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";

export default async function AdminDocumentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const documents = await prisma.ownerDocument.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: {
        select: {
          ownerId: true,
          name: true,
          companyName: true,
        },
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
              Owner Documents
            </h1>

            <p className="mt-2 text-slate-400">
              Review and verify documents submitted by vehicle owners
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Dashboard
          </a>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            label="Total"
            value={documents.length}
          />

          <StatusCard
            label="Submitted"
            value={
              documents.filter(
                (document) =>
                  document.verificationStatus === "SUBMITTED"
              ).length
            }
          />

          <StatusCard
            label="Under Review"
            value={
              documents.filter(
                (document) =>
                  document.verificationStatus === "UNDER_REVIEW"
              ).length
            }
          />

          <StatusCard
            label="Verified"
            value={
              documents.filter(
                (document) =>
                  document.verificationStatus === "VERIFIED"
              ).length
            }
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Owner
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Document
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Type
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Submitted
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-300">
                    Verification
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {documents.map((document) => (
                  <tr
                    key={document.id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">
                        {document.owner.name}
                      </div>

                      {document.owner.companyName && (
                        <div className="mt-1 text-xs text-slate-400">
                          {document.owner.companyName}
                        </div>
                      )}

                      <div className="mt-1 font-mono text-xs text-emerald-400">
                        {document.owner.ownerId}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-200">
                        {document.documentName}
                      </div>

                      <a
                        href={document.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs text-emerald-400 hover:underline"
                      >
                        Open document →
                      </a>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                      {document.documentType}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                      {new Date(
                        document.createdAt
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <StatusBadge
                        status={document.verificationStatus}
                      />
                    </td>

                    <td className="px-5 py-4">
                      {document.verificationStatus === "VERIFIED" ? (
                        <div className="text-xs text-slate-400">
                          <div>
                            By:{" "}
                            <span className="text-slate-200">
                              {document.verifiedBy || "—"}
                            </span>
                          </div>

                          <div className="mt-1">
                            At:{" "}
                            {document.verifiedAt
                              ? new Date(
                                  document.verifiedAt
                                ).toLocaleString("en-IN")
                              : "—"}
                          </div>
                        </div>
                      ) : (
                        <a
                          href={`/admin/documents/${document.id}`}
                          className="inline-block rounded-lg border border-emerald-800 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-950/40"
                        >
                          Review
                        </a>
                      )}
                    </td>
                  </tr>
                ))}

                {documents.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No owner documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-900/50 bg-amber-950/20 p-5">
          <h2 className="font-semibold text-amber-300">
            Document Verification Policy
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Documents submitted by vehicle owners remain unverified until
            an authorized ETW administrator reviews them. Verification
            status changes are recorded by the server.
          </p>
        </div>
      </div>
    </main>
  );
}

function StatusCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusClasses: Record<string, string> = {
    SUBMITTED:
      "border-blue-800 bg-blue-950/40 text-blue-400",
    UNDER_REVIEW:
      "border-amber-800 bg-amber-950/40 text-amber-400",
    VERIFIED:
      "border-emerald-800 bg-emerald-950/40 text-emerald-400",
    REJECTED:
      "border-red-800 bg-red-950/40 text-red-400",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        statusClasses[status] ||
        "border-slate-700 bg-slate-900 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}
