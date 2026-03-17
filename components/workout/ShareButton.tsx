"use client";

import { useState } from "react";
import { toJpeg } from "html-to-image";

function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then((r) => r.blob());
}

export function ShareButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleShare() {
    setBusy(true);
    setError(null);

    try {
      const node = document.getElementById("export-card");
      if (!node) throw new Error("Could not find export area.");

      const dataUrl = await toJpeg(node, {
        quality: 0.95,
        backgroundColor: "#0b1220",
        pixelRatio: Math.min(2, window.devicePixelRatio || 1),
      });

      const blob = await dataUrlToBlob(dataUrl);
      const file = new File([blob], "gravity-daily-stack.jpg", { type: "image/jpeg" });

      const shareText = "Crushed my daily stack on Gravity. 💪";

      const canNativeShare =
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        typeof (navigator as any).share === "function" &&
        (!("canShare" in navigator) || (navigator as any).canShare?.({ files: [file] }));

      if (canNativeShare) {
        await (navigator as any).share({
          files: [file],
          text: shareText,
          title: "Gravity — Daily Stack",
        });
        return;
      }

      // Desktop fallback: download.
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "gravity-daily-stack.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not share. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      <button
        type="button"
        onClick={handleShare}
        disabled={busy}
        className="w-full rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-cyan-400/20 to-cyan-300/10 px-5 py-4 text-base font-semibold text-cyan-200 shadow-[0_0_28px_rgba(6,182,212,0.25)] transition hover:border-cyan-300/60 hover:text-white hover:shadow-[0_0_36px_rgba(6,182,212,0.35)] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Preparing share…" : "Share Today’s Stack"}
      </button>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

