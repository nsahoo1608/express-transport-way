import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth/guard";

export default async function OwnerAgreementsPage() {
  const sessionOwner = await requireOwner();

  if (!sessionOwner) {
    redirect("/owner/login");
  }

  const owner = await prisma.vehicleOwner.findUnique({
    where: {
      ownerId: sessionOwner.ownerId,
    },
    select: {
      id: true,
      ownerId: true,
      name: true,
    },
  });

  if (!owner) {
    redirect("/owner/login");
  }

  const agreements = await prisma.vehicleAgreement.findMany({
    where: {
      ownerId: owner.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      agreementId: true,
      vehicleId: true,
      vehicle: {
        select: {
          vehicleId: true,
          registrationNumber: true,
        },
      },
      agreementType: true,
      startDate: true,
      expiryDate: true,
      rateType: true,
      rate: true,
      paymentTerms: true,
      fuelResponsibility: true,
      driverResponsibility: true,
      maintenanceResponsibility: true,
      status: true,
      documentUrl: true,
      verifiedAt: true,
      verificationRemarks: true,
      createdAt: true,
    },
  });

  const value = (v: string | null) => v?.trim() || "Not provided";

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "Not provided";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatRate = (rate: unknown) => {
    if (rate === null || rate === undefined) {
      return "Not provided";
    }

    return String(rate);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              EXPRESS TRANSPORT WAY
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              My Agreements
            </h1>

            <p className="mt-2 text-slate-400">
              Vehicle agreements registered under your ETW owner account
            </p>
          </div>

          <Link
            href="/owner"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
          >
            Back to Portal
          </Link>
        </div>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Owner
          </p>

          <p className="mt-2 text-lg font-semibold text-white">
            {owner.name}
          </p>

          <p className="mt-1 text-sm text-emerald-400">
            {owner.ownerId}
          </p>
        </section>

        {agreements.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Agreements Registered
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              No vehicle agreement has been registered under your owner account yet.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {agreements.map((agreement) => (
              <section
                key={agreement.agreementId}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Agreement ID
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-white">
                      {agreement.agreementId}
                    </h2>
                  </div>

                  <span className="rounded-full border border-emerald-900 bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
                    {agreement.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <AgreementField
                    label="Vehicle ID"
                    value={agreement.vehicle?.vehicleId ?? agreement.vehicleId}
                  />

                  <AgreementField
                    label="Agreement Type"
                    value={agreement.agreementType}
                  />

                  <AgreementField
                    label="Start Date"
                    value={formatDate(agreement.startDate)}
                  />

                  <AgreementField
                    label="Expiry Date"
                    value={formatDate(agreement.expiryDate)}
                  />

                  <AgreementField
                    label="Rate Type"
                    value={value(agreement.rateType)}
                  />

                  <AgreementField
                    label="Rate"
                    value={formatRate(agreement.rate)}
                  />

                  <AgreementField
                    label="Payment Terms"
                    value={value(agreement.paymentTerms)}
                  />

                  <AgreementField
                    label="Fuel Responsibility"
                    value={value(agreement.fuelResponsibility)}
                  />

                  <AgreementField
                    label="Driver Responsibility"
                    value={value(agreement.driverResponsibility)}
                  />

                  <AgreementField
                    label="Maintenance Responsibility"
                    value={value(agreement.maintenanceResponsibility)}
                  />

                  <AgreementField
                    label="Verified On"
                    value={formatDate(agreement.verifiedAt)}
                  />

                  <AgreementField
                    label="Document"
                    value={agreement.documentUrl ? "Available" : "Not uploaded"}
                  />

                </div>

                {agreement.verificationRemarks && (
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Verification Remarks
                    </p>

                    <p className="mt-2 break-words text-sm text-slate-100">
                      {agreement.verificationRemarks}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

function AgreementField({
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

