"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500";

export default function NewEmployeeInsurancePage() {
  const router = useRouter();
  const params = useParams<{ employeeId: string }>();

  const employeeId = params.employeeId;

  const [form, setForm] = useState({
    insuranceType: "",
    provider: "",
    policyNumber: "",
    coverageAmount: "",
    startDate: "",
    expiryDate: "",
    status: "ACTIVE",
    policyDocumentUrl: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/employees/insurance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          insuranceType: form.insuranceType,
          provider: form.provider,
          policyNumber: form.policyNumber,
          coverageAmount: form.coverageAmount || undefined,
          startDate: form.startDate,
          expiryDate: form.expiryDate || undefined,
          status: form.status,
          policyDocumentUrl: form.policyDocumentUrl || undefined,
          notes: form.notes || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to add employee insurance."
        );
      }

      setSuccess(
        result?.message || "Employee insurance added successfully."
      );

      setTimeout(() => {
        router.push(`/admin/employees/${employeeId}`);
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add employee insurance."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Add Employee Insurance
            </h1>

            <p className="mt-2 text-slate-400">
              Record insurance policy information in the employee&apos;s
              secure personnel file.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(`/admin/employees/${employeeId}`)
            }
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            Back to Employee
          </button>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              Employee
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              {employeeId}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Insurance Type *
                </label>

                <select
                  required
                  value={form.insuranceType}
                  onChange={(event) =>
                    updateField("insuranceType", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select insurance type</option>
                  <option value="GROUP_MEDICAL">
                    Group Medical
                  </option>
                  <option value="PERSONAL_ACCIDENT">
                    Personal Accident
                  </option>
                  <option value="EMPLOYEE_LIFE">
                    Employee Life
                  </option>
                  <option value="WORKMEN_COVER">
                    Workmen Cover
                  </option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Provider *
                </label>

                <input
                  required
                  value={form.provider}
                  onChange={(event) =>
                    updateField("provider", event.target.value)
                  }
                  className={inputClass}
                  placeholder="Insurance provider"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Policy Number *
                </label>

                <input
                  required
                  value={form.policyNumber}
                  onChange={(event) =>
                    updateField("policyNumber", event.target.value)
                  }
                  className={inputClass}
                  placeholder="Policy number"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Coverage Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.coverageAmount}
                  onChange={(event) =>
                    updateField("coverageAmount", event.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g. 500000"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Start Date *
                </label>

                <input
                  required
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    updateField("startDate", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Expiry Date
                </label>

                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(event) =>
                    updateField("expiryDate", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Policy Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Policy Document URL
                </label>

                <input
                  type="url"
                  value={form.policyDocumentUrl}
                  onChange={(event) =>
                    updateField(
                      "policyDocumentUrl",
                      event.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="https://secure-document-location.example/policy.pdf"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Notes
              </label>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField("notes", event.target.value)
                }
                rows={4}
                className={inputClass}
                placeholder="Additional policy or administrative notes."
              />
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
              New insurance records enter the verification workflow
              as <strong className="mx-1">SUBMITTED</strong>. Actual
              policy verification and file storage will be handled by
              authorized ETW administrators.
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
                {success}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  router.push(`/admin/employees/${employeeId}`)
                }
                className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Adding Insurance..." : "Add Insurance"}
              </button>
            </div>
          </form>
        </section>

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-200">
          Employee insurance information is confidential personnel
          data and is restricted to authorized ETW administrators.
        </div>
      </div>
    </main>
  );
}