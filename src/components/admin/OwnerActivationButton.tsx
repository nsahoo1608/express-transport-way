"use client";

import { useState } from "react";

export default function OwnerActivationButton({
  ownerId,
  ownerName,
}: {
  ownerId: string;
  ownerName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  async function generate() {
    setLoading(true);
    setMessage("");
    setUrl("");

    try {
      const response = await fetch(
        `/api/admin/owners/${ownerId}/activation`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to generate activation link."
        );
      }

      setUrl(result.data.activationUrl);
      setMessage(
        `Activation link generated for ${ownerName}. It expires in 24 hours.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to generate activation link."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl() {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setMessage("Activation link copied.");
    } catch {
      setMessage("Unable to copy automatically. Select the link and copy it.");
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="rounded-md border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Activation Link"}
      </button>

      {url && (
        <div className="max-w-[520px] rounded-lg border border-slate-700 bg-slate-950 p-3">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-slate-500">
            One-time activation link
          </p>

          <input
            readOnly
            value={url}
            onFocus={(event) => event.currentTarget.select()}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 outline-none"
          />

          <button
            type="button"
            onClick={copyUrl}
            className="mt-2 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
          >
            Copy Link
          </button>
        </div>
      )}

      {message && (
        <p className="max-w-[520px] text-xs text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}