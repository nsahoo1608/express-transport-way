import Link from "next/link";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth/guard";
import OwnerLogoutButton from "@/components/OwnerLogoutButton";

export default async function OwnerPortalPage() {
  const owner = await requireOwner();

  if (!owner) {
    redirect("/owner/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              EXPRESS TRANSPORT WAY
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Owner Portal
            </h1>

            <p className="mt-2 text-slate-400">
              Welcome back, {owner.name}
            </p>
          </div>

          <OwnerLogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Owner ID
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {owner.ownerId}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Account Status
            </p>

            <p className="mt-2 text-xl font-semibold text-emerald-400">
              ACTIVE
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Portal Access
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              Authorized
            </p>
          </section>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/owner/profile"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500 hover:bg-slate-800"
          >
            <h2 className="font-semibold">My Profile</h2>

            <p className="mt-2 text-sm text-slate-400">
              Owner information and KYC details
            </p>

            <p className="mt-4 text-sm font-medium text-emerald-400">
              View Profile ?
            </p>
          </Link>

          <Link
            href="/owner/vehicles"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500 hover:bg-slate-800"
          >
            <h2 className="font-semibold">My Vehicles</h2>

            <p className="mt-2 text-sm text-slate-400">
              View registered vehicles
            </p>

            <p className="mt-4 text-sm font-medium text-emerald-400">
              View Vehicles ?
            </p>
          </Link>

          <Link
            href="/owner/agreements"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500 hover:bg-slate-800"
          >
            <h2 className="font-semibold">Agreements</h2>

            <p className="mt-2 text-sm text-slate-400">
              Vehicle agreements and documents
            </p>

            <p className="mt-4 text-sm font-medium text-emerald-400">
              View Agreements ?
            </p>
          </Link>

          <Link
            href="/owner/documents"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500 hover:bg-slate-800"
          >
            <h2 className="font-semibold">Documents</h2>

            <p className="mt-2 text-sm text-slate-400">
              KYC and uploaded documents
            </p>

            <p className="mt-4 text-sm font-medium text-emerald-400">
              View Documents ?
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
