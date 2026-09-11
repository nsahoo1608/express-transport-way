import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth/guard";

export default async function OwnerVehiclesPage() {
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

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ownerId: owner.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      vehicleId: true,
      registrationNumber: true,
      vehicleType: true,
      make: true,
      model: true,
      manufacturingYear: true,
      ownershipType: true,
      status: true,
      rcNumber: true,
      rcExpiryDate: true,
      createdAt: true,
    },
  });

  const value = (v: string | null) => v?.trim() || "Not provided";

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "Not provided";
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = months[date.getUTCMonth()];
    const year = String(date.getUTCFullYear());

    return `${day} ${month} ${year}`;
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
              My Vehicles
            </h1>

            <p className="mt-2 text-slate-400">
              Vehicles registered under your ETW owner account
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/owner/vehicles/new"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Register Vehicle
            </Link>

            <Link
              href="/owner"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
            >
              Back to Portal
            </Link>
          </div>
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

        {vehicles.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Vehicles Registered
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              No vehicle has been registered under your owner account yet.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {vehicles.map((vehicle) => (
              <section
                key={vehicle.vehicleId}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Registration Number
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {vehicle.registrationNumber}
                    </h2>
                  </div>

                  <span className="rounded-full border border-emerald-900 bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
                    {vehicle.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <VehicleField
                    label="Vehicle ID"
                    value={vehicle.vehicleId}
                  />

                  <VehicleField
                    label="Vehicle Type"
                    value={vehicle.vehicleType}
                  />

                  <VehicleField
                    label="Make"
                    value={value(vehicle.make)}
                  />

                  <VehicleField
                    label="Model"
                    value={value(vehicle.model)}
                  />

                  <VehicleField
                    label="Manufacturing Year"
                    value={
                      vehicle.manufacturingYear
                        ? String(vehicle.manufacturingYear)
                        : "Not provided"
                    }
                  />

                  <VehicleField
                    label="Ownership Type"
                    value={vehicle.ownershipType}
                  />

                  <VehicleField
                    label="RC Number"
                    value={value(vehicle.rcNumber)}
                  />

                  <VehicleField
                    label="RC Expiry"
                    value={formatDate(vehicle.rcExpiryDate)}
                  />

                </div>
              </section>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

function VehicleField({
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

