"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InsuranceVerificationActionsProps = {
  insuranceId: string;
  currentStatus: string;
};

const statuses = [
  {
    value: "UNDER_REVIEW",
    label: "Move to Under Review",
    className:
      "border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20",
  },
  {
    value: "VERIFIED",
    label: "Verify Insurance",
    className:
      "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
  },
  {
    value: "REJECTED",
    label: "Reject Insurance",
    className:
      "border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20",
  },
];

export default function InsuranceVerificationActions({
  insuranceId,
  currentStatus,
}: InsuranceVerificationActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remarks, setRemarks] = useState("");

  async function updateStatus(status: string) {
    setError("");
    setSuccess("");

    if (status === "REJECTED" && !remarks.trim()) {
      setError("Rejection remarks are required.");
      return;
    }

    setLoading(status);

    try {
      const response = await fetch(
        `/api/employees/insurance/${insuranceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationStatus: status,
            verificationRemarks: remarks.trim() || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to update insurance verification status."
        );
      }

      setSuccess(
        result?.message ||
          "Insurance verification status updated successfully."
      );

      setRemarks("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update insurance verification status."
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-6">
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
        <label
          htmlFor="insuranceVerificationRemarks"
          className="text-sm font-medium text-slate-300"
        >
          Verification Remarks
        </label>

        <textarea
          id="insuranceVerificationRemarks"
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder="Enter verification remarks. Remarks are required when rejecting an insurance record."
          rows={4}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
        />

        <p className="mt-2 text-xs text-slate-500">
          Rejection requires remarks. Verification remarks are optional.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {statuses.map((item) => {
          const isCurrent = currentStatus === item.value;
          const isLoading = loading === item.value;

          return (
            <button
              key={item.value}
              type="button"
              disabled={loading !== null || isCurrent}
              onClick={() => updateStatus(item.value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${item.className}`}
            >
              {isLoading
                ? "Processing..."
                : isCurrent
                  ? `${item.label} (Current)`
                  : item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Current status:{" "}
        <span className="font-semibold text-slate-300">
          {(currentStatus || "SUBMITTED").replaceAll("_", " ")}
        </span>
      </div>
    </div>
  );
}