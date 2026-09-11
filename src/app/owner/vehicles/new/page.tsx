"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewVehiclePage() {
  const router = useRouter();

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [manufacturingYear, setManufacturingYear] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [rcNumber, setRcNumber] = useState("");
  const [rcExpiryDate, setRcExpiryDate] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/owner/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNumber,
          vehicleType,
          make,
          model,
          manufacturingYear,
          ownershipType,
          rcNumber,
          rcExpiryDate,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? "Unable to register vehicle.");
        return;
      }

      router.push("/owner/vehicles");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              EXPRESS TRANSPORT WAY
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Register Vehicle
            </h1>

            <p className="mt-2 text-slate-400">
              Add a vehicle to your ETW owner account.
            </p>
          </div>

          <Link
            href="/owner/vehicles"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-900"
          >
            Back to Vehicles
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

          <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-4">
            <p className="text-sm font-medium text-amber-300">
              Vehicle Verification
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              New vehicles are registered with PENDING status and may require
              ETW verification before becoming active.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">

            <div>
              <h2 className="text-lg font-semibold">
                Vehicle Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the vehicle details exactly as shown on the vehicle
                documents.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <FormField
                label="Registration Number"
                required
              >
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(event) =>
                    setRegistrationNumber(event.target.value.toUpperCase())
                  }
                  placeholder="OD01AB1234"
                  required
                  className={inputClassName}
                />
              </FormField>

              <FormField
                label="Vehicle Type"
                required
              >
                <select
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value)}
                  required
                  className={inputClassName}
                >
                  <option value="">Select vehicle type</option>
                  <option value="TIPPER">Tipper</option>
                  <option value="TRUCK">Truck</option>
                  <option value="TRAILER">Trailer</option>
                  <option value="HYDRA">Hydra</option>
                  <option value="TANKER">Tanker</option>
                  <option value="DUMPER">Dumper</option>
                  <option value="OTHER">Other</option>
                </select>
              </FormField>

              <FormField label="Make">
                <input
                  type="text"
                  value={make}
                  onChange={(event) => setMake(event.target.value)}
                  placeholder="Tata, Ashok Leyland, BharatBenz..."
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Model">
                <input
                  type="text"
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  placeholder="Vehicle model"
                  className={inputClassName}
                />
              </FormField>

              <FormField
                label="Manufacturing Year"
                required
              >
                <input
                  type="number"
                  value={manufacturingYear}
                  onChange={(event) =>
                    setManufacturingYear(event.target.value)
                  }
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="2024"
                  required
                  className={inputClassName}
                />
              </FormField>

              <FormField
                label="Ownership Type"
                required
              >
                <select
                  value={ownershipType}
                  onChange={(event) => setOwnershipType(event.target.value)}
                  required
                  className={inputClassName}
                >
                  <option value="">Select ownership type</option>
                  <option value="OWNED">Owned</option>
                  <option value="FINANCED">Financed</option>
                  <option value="LEASED">Leased</option>
                  <option value="HIRED">Hired</option>
                </select>
              </FormField>

            </div>

            <div className="border-t border-slate-800 pt-7">
              <h2 className="text-lg font-semibold">
                Registration Certificate
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide RC details where available.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <FormField label="RC Number">
                <input
                  type="text"
                  value={rcNumber}
                  onChange={(event) =>
                    setRcNumber(event.target.value.toUpperCase())
                  }
                  placeholder="RC number"
                  className={inputClassName}
                />
              </FormField>

              <FormField label="RC Expiry Date">
                <input
                  type="date"
                  value={rcExpiryDate}
                  onChange={(event) => setRcExpiryDate(event.target.value)}
                  className={inputClassName}
                />
              </FormField>

            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-7 sm:flex-row sm:justify-end">

              <Link
                href="/owner/vehicles"
                className="rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Registering Vehicle..." : "Register Vehicle"}
              </button>

            </div>

          </form>
        </section>
      </div>
    </main>
  );
}

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-500";

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </label>

      {children}
    </div>
  );
}
