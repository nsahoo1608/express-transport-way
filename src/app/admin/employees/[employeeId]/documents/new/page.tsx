"use client";

import { FormEvent, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500";

const documentTypes = [
  ["EIC", "Employee ID Card"],
  ["DRIVING_LICENSE", "Driving Licence"],
  ["AADHAAR", "Aadhaar"],
  ["PAN", "PAN Card"],
  ["ADDRESS_PROOF", "Address Proof"],
  ["QUALIFICATION", "Qualification Certificate"],
  ["EXPERIENCE", "Experience Certificate"],
  ["OTHER", "Other Document"],
];

export default function NewEmployeeDocumentPage() {
  const router = useRouter();
  const params = useParams<{ employeeId: string }>();

  const employeeId = params.employeeId;

  const [form, setForm] = useState({
    documentType: "",
    documentName: "",
    documentUrl: "",
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
      const response = await fetch("/api/employees/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          documentType: form.documentType,
          documentName: form.documentName,
          documentUrl: form.documentUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to add employee document."
        );
      }

      setSuccess(
        result?.message || "Employee document added successfully."
      );

      setTimeout(() => {
        router.push(`/admin/employees/${employeeId}`);
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add employee document."
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
              Add Employee Document
            </h1>

            <p className="mt-2 text-slate-400">
              Add a document record to the employee&apos;s secure
              personnel file.
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
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Document Type *
              </label>

              <select
                required
                value={form.documentType}
                onChange={(event) =>
                  updateField("documentType", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Select document type</option>

                {documentTypes.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Document Name *
              </label>

              <input
                required
                value={form.documentName}
                onChange={(event) =>
                  updateField("documentName", event.target.value)
                }
                className={inputClass}
                placeholder="e.g. Driving Licence - Front and Back"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Document URL *
              </label>

              <input
                required
                type="url"
                value={form.documentUrl}
                onChange={(event) =>
                  updateField("documentUrl", event.target.value)
                }
                className={inputClass}
                placeholder="https://secure-document-location.example/document.pdf"
              />

              <p className="mt-2 text-xs text-slate-500">
                The current backend stores a secure document URL and
                verification metadata. Actual file upload/storage will
                be connected separately.
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
              New documents enter the verification workflow as
              <strong className="mx-1">SUBMITTED</strong>. An authorized
              administrator can later move the document to UNDER REVIEW,
              VERIFIED, or REJECTED.
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
                {loading ? "Adding Document..." : "Add Document"}
              </button>
            </div>
          </form>
        </section>

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-200">
          Employee documents are confidential personnel records.
          Access is restricted to authorized ETW administrators.
        </div>
      </div>
    </main>
  );
}