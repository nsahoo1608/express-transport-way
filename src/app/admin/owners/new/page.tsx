"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500";

export default function NewOwnerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    ownerType: "INDIVIDUAL",
    companyName: "",
    phone: "",
    email: "",
    address: "",
    pan: "",
    gstin: "",
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

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to register vehicle owner."
        );
      }

      setSuccess(
        `Owner registered successfully. Registration No: ${result.data.ownerId}`
      );

      setTimeout(() => {
        router.push("/admin/owners");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to register vehicle owner."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Register Vehicle Owner
            </h1>

            <p className="mt-2 text-slate-400">
              Create an owner account for the ETW Vehicle Partner portal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/owners")}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            Back to Owners
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Owner Information</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Owner Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  className={inputClass}
                  placeholder="Full owner name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Owner Type *
                </label>
                <select
                  value={form.ownerType}
                  onChange={(event) =>
                    updateField("ownerType", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="PROPRIETORSHIP">Proprietorship</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="COMPANY">Company</option>
                  <option value="FLEET_OPERATOR">Fleet Operator</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Company / Firm Name
                </label>
                <input
                  value={form.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                  className={inputClass}
                  placeholder="Company or firm name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  className={inputClass}
                  placeholder="Primary mobile number"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  className={inputClass}
                  placeholder="owner@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  PAN
                </label>
                <input
                  value={form.pan}
                  onChange={(event) =>
                    updateField("pan", event.target.value)
                  }
                  className={inputClass}
                  placeholder="PAN"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  GSTIN
                </label>
                <input
                  value={form.gstin}
                  onChange={(event) =>
                    updateField("gstin", event.target.value)
                  }
                  className={inputClass}
                  placeholder="GSTIN"
                  maxLength={15}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Address
                </label>
                <textarea
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  rows={4}
                  className={inputClass}
                  placeholder="Owner / company address"
                />
              </div>
            </div>
          </section>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4 text-sm text-blue-200">
            The owner will receive an ETW registration number. The owner
            password is not created by ETW administration; it will be set by
            the owner during account activation.
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

          <div className="flex justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() => router.push("/admin/owners")}
              className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Registering Owner..." : "Register Owner"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}