import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth/guard";

export default async function OwnerProfilePage() {
  const sessionOwner = await requireOwner();

  if (!sessionOwner) {
    redirect("/owner/login");
  }

  const owner = await prisma.vehicleOwner.findUnique({
    where: {
      ownerId: sessionOwner.ownerId,
    },
    select: {
      ownerId: true,
      ownerType: true,
      name: true,
      companyName: true,
      phone: true,
      email: true,
      address: true,
      pan: true,
      gstin: true,
      kycStatus: true,
      accountStatus: true,
      createdAt: true,
    },
  });

  if (!owner) {
    redirect("/owner/login");
  }

  const joinedDate = owner.createdAt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const value = (v: string | null) => v?.trim() || "Not provided";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              EXPRESS TRANSPORT WAY
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              My Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Your registered owner information and KYC details
            </p>
          </div>

          <Link
            href="/owner"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
          >
            Back to Portal
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-lg font-semibold">
            Owner Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <ProfileField label="Owner ID" value={owner.ownerId} />
            <ProfileField label="Owner Type" value={owner.ownerType} />
            <ProfileField label="Name" value={owner.name} />
            <ProfileField label="Company Name" value={value(owner.companyName)} />
            <ProfileField label="Phone" value={owner.phone} />
            <ProfileField label="Email" value={value(owner.email)} />
            <ProfileField label="Address" value={value(owner.address)} />
            <ProfileField label="PAN" value={value(owner.pan)} />
            <ProfileField label="GSTIN" value={value(owner.gstin)} />
            <ProfileField label="Account Status" value={owner.accountStatus} />
            <ProfileField label="KYC Status" value={owner.kycStatus} />
            <ProfileField label="Registered On" value={joinedDate} />

          </div>
        </section>

      </div>
    </main>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-slate-100">
        {value}
      </p>

    </div>
  );
}
