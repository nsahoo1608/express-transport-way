import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";
import OwnerActivationButton from "@/components/admin/OwnerActivationButton";

export default async function AdminOwnersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) redirect("/admin/login");

  const admin = await verifyAdminSession(token);
  if (!admin) redirect("/admin/login");

  const owners = await prisma.vehicleOwner.findMany({
    include: {
      account: {
        select: {
          isActive: true,
          mustSetPassword: true,
          lastLoginAt: true,
        },
      },
      _count: {
        select: {
          vehicles: true,
          agreements: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Vehicle Owner Management
            </h1>

            <p className="mt-2 text-slate-400">
              Manage ETW vehicle owners and fleet partners.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-emerald-600 hover:text-emerald-400"
            >
              ← Dashboard
            </Link>

            <Link
              href="/admin/owners/new"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
            >
              + Register Owner
            </Link>
          </div>
        </div>

        {owners.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">
              No vehicle owners found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No owner accounts have been registered yet.
            </p>

            <Link
              href="/admin/owners/new"
              className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500"
            >
              Register First Owner
            </Link>
          </section>
        ) : (
          <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <table className="min-w-[1050px] w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Owner ID</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Vehicles</th>
                  <th className="px-4 py-3">Agreements</th>
                  <th className="px-4 py-3">KYC</th>
                  <th className="px-4 py-3">Account</th>
                </tr>
              </thead>

              <tbody>
                {owners.map((owner) => (
                  <tr key={owner.id} className="border-b border-slate-900">
                    <td className="px-4 py-4 font-semibold text-emerald-400">
                      {owner.ownerId}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold">{owner.name}</div>
                      {owner.companyName && (
                        <div className="mt-1 text-xs text-slate-500">
                          {owner.companyName}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      {owner.phone}
                    </td>

                    <td className="px-4 py-4">
                      {owner._count.vehicles}
                    </td>

                    <td className="px-4 py-4">
                      {owner._count.agreements}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {owner.kycStatus}
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        {owner.account?.isActive
                          ? owner.account.mustSetPassword
                            ? "ACTIVATION PENDING"
                            : "ACTIVE"
                          : "INACTIVE"}
                      </div>

                      {owner.account?.isActive &&
                        owner.account.mustSetPassword && (
                          <OwnerActivationButton
                            ownerId={owner.id}
                            ownerName={owner.name}
                          />
                        )}
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