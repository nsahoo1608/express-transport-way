"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Vehicle = {
  vehicleId: string;
  registrationNumber: string;
  vehicleType: string;
  make: string | null;
  model: string | null;
};

export default function NewAgreementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    vehicleId: "",
    agreementType: "",
    startDate: "",
    expiryDate: "",
    rateType: "",
    rate: "",
    paymentTerms: "",
    fuelResponsibility: "",
    driverResponsibility: "",
    maintenanceResponsibility: "",
  });

  useEffect(() => {
    async function loadVehicles() {
      try {
        const response = await fetch("/api/owner/vehicles");
        const result = await response.json();

        if (!response.ok || !result.success) {
          setError(result.message || "Unable to load vehicles.");
          return;
        }

        setVehicles(result.data || []);
      } catch {
        setError("Unable to load vehicles.");
      } finally {
        setLoadingVehicles(false);
      }
    }

    loadVehicles();
  }, []);

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/owner/agreements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to submit agreement.");
        return;
      }

      setMessage(
        `Agreement ${result.data.agreementId} submitted successfully.`
      );

      setForm({
        vehicleId: "",
        agreementType: "",
        startDate: "",
        expiryDate: "",
        rateType: "",
        rate: "",
        paymentTerms: "",
        fuelResponsibility: "",
        driverResponsibility: "",
        maintenanceResponsibility: "",
      });
    } catch {
      setError("Unable to submit agreement.");
    } finally {
      setSubmitting(false);
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
              New Agreement
            </h1>

            <p className="mt-2 text-slate-400">
              Submit a vehicle agreement for admin verification
            </p>
          </div>

          <Link
            href="/owner/agreements"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
          >
            Back to Agreements
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">
              Vehicle & Agreement
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <FieldLabel label="Vehicle">
                <select
                  required
                  value={form.vehicleId}
                  onChange={(event) =>
                    updateField("vehicleId", event.target.value)
                  }
                  disabled={loadingVehicles}
                  className="input"
                >
                  <option value="">
                    {loadingVehicles
                      ? "Loading vehicles..."
                      : "Select vehicle"}
                  </option>

                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.vehicleId}
                      value={vehicle.vehicleId}
                    >
                      {vehicle.registrationNumber} — {vehicle.vehicleType}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Agreement Type">
                <select
                  required
                  value={form.agreementType}
                  onChange={(event) =>
                    updateField("agreementType", event.target.value)
                  }
                  className="input"
                >
                  <option value="">Select type</option>
                  <option value="VEHICLE_HIRE">Vehicle Hire</option>
                  <option value="TRANSPORT_CONTRACT">
                    Transport Contract
                  </option>
                  <option value="ATTACHMENT">Vehicle Attachment</option>
                  <option value="OTHER">Other</option>
                </select>
              </FieldLabel>

            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">
              Agreement Period
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <FieldLabel label="Start Date">
                <input
                  required
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    updateField("startDate", event.target.value)
                  }
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="Expiry Date">
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(event) =>
                    updateField("expiryDate", event.target.value)
                  }
                  className="input"
                />
              </FieldLabel>

            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">
              Rate & Payment
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <FieldLabel label="Rate Type">
                <select
                  required
                  value={form.rateType}
                  onChange={(event) =>
                    updateField("rateType", event.target.value)
                  }
                  className="input"
                >
                  <option value="">Select rate type</option>
                  <option value="PER_TRIP">Per Trip</option>
                  <option value="PER_TON">Per Ton</option>
                  <option value="PER_KM">Per KM</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </FieldLabel>

              <FieldLabel label="Rate">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rate}
                  onChange={(event) =>
                    updateField("rate", event.target.value)
                  }
                  placeholder="Enter rate"
                  className="input"
                />
              </FieldLabel>

              <div className="md:col-span-2">
                <FieldLabel label="Payment Terms">
                  <textarea
                    required
                    value={form.paymentTerms}
                    onChange={(event) =>
                      updateField("paymentTerms", event.target.value)
                    }
                    placeholder="Example: Payment within 15 days of invoice submission"
                    rows={3}
                    className="input"
                  />
                </FieldLabel>
              </div>

            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">
              Responsibilities
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              <FieldLabel label="Fuel">
                <select
                  required
                  value={form.fuelResponsibility}
                  onChange={(event) =>
                    updateField(
                      "fuelResponsibility",
                      event.target.value
                    )
                  }
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="OWNER">Owner</option>
                  <option value="ETW">ETW</option>
                  <option value="SHARED">Shared</option>
                </select>
              </FieldLabel>

              <FieldLabel label="Driver">
                <select
                  required
                  value={form.driverResponsibility}
                  onChange={(event) =>
                    updateField(
                      "driverResponsibility",
                      event.target.value
                    )
                  }
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="OWNER">Owner</option>
                  <option value="ETW">ETW</option>
                  <option value="SHARED">Shared</option>
                </select>
              </FieldLabel>

              <FieldLabel label="Maintenance">
                <select
                  required
                  value={form.maintenanceResponsibility}
                  onChange={(event) =>
                    updateField(
                      "maintenanceResponsibility",
                      event.target.value
                    )
                  }
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="OWNER">Owner</option>
                  <option value="ETW">ETW</option>
                  <option value="SHARED">Shared</option>
                </select>
              </FieldLabel>

            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/owner/agreements"
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || loadingVehicles || vehicles.length === 0}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Agreement"}
            </button>
          </div>

        </form>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(51 65 85);
          background: rgb(2 6 23);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: rgb(16 185 129);
          box-shadow: 0 0 0 1px rgb(16 185 129);
        }

        .input::placeholder {
          color: rgb(100 116 139);
        }
      `}</style>
    </main>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

