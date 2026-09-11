"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function NewOwnerDocumentPage() {
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setError("");
    setMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      if (!documentType) {
        setError("Please select a document type.");
        return;
      }

      if (!file) {
        setError("Please select a document file.");
        return;
      }

      const formData = new FormData();

      formData.append("documentType", documentType);
      formData.append("file", file);

      const response = await fetch("/api/owner/documents", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message || "Unable to upload document."
        );
        return;
      }

      setMessage(
        `Document ${result.data.documentName} uploaded successfully.`
      );

      setDocumentType("");
      setFile(null);

      const fileInput = document.getElementById(
        "document-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch {
      setError("Unable to upload document.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              EXPRESS TRANSPORT WAY
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Add Document
            </h1>

            <p className="mt-2 text-slate-400">
              Upload a document for ETW verification
            </p>
          </div>

          <Link
            href="/owner/documents"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
          >
            Back to Documents
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
              Document Information
            </h2>

            <div className="mt-5 space-y-5">

              <FieldLabel label="Document Type">
                <select
                  required
                  value={documentType}
                  onChange={(event) =>
                    setDocumentType(event.target.value)
                  }
                  className="input"
                >
                  <option value="">
                    Select document type
                  </option>

                  <option value="PAN">
                    PAN
                  </option>

                  <option value="AADHAAR">
                    Aadhaar
                  </option>

                  <option value="GSTIN">
                    GST Registration
                  </option>

                  <option value="RC">
                    Vehicle RC
                  </option>

                  <option value="INSURANCE">
                    Vehicle Insurance
                  </option>

                  <option value="PERMIT">
                    Permit
                  </option>

                  <option value="FITNESS">
                    Fitness Certificate
                  </option>

                  <option value="AGREEMENT">
                    Agreement
                  </option>

                  <option value="BANK">
                    Bank Document
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </FieldLabel>

              <FieldLabel label="Document File">
                <input
                  id="document-file"
                  required
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="input file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-emerald-500"
                />
              </FieldLabel>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-medium text-slate-300">
                  Upload requirements
                </p>

                <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-500">
                  <li>• PDF, JPG or PNG only</li>
                  <li>• Maximum file size: 4 MB</li>
                  <li>• Upload a clear and readable document</li>
                  <li>• The document will be stored securely</li>
                </ul>
              </div>

              {file && (
                <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-4">
                  <p className="text-sm text-slate-400">
                    Selected file
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-emerald-300">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <p className="text-sm leading-6 text-slate-500">
                Your document will be submitted to ETW for verification.
                Verification may include document checks and, where
                officially supported, verification against government
                or authorized records.
              </p>

            </div>
          </section>

          <div className="flex items-center justify-end gap-3">

            <Link
              href="/owner/documents"
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Uploading..."
                : "Upload Document"}
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
