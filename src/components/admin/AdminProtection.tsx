"use client";

import { useEffect, useState } from "react";

export default function AdminProtection({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const preventCopy = (event: ClipboardEvent) => {
      event.preventDefault();
    };

    const preventPrint = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
        event.preventDefault();
      }
    };

    const handleVisibility = () => {
      setHidden(document.visibilityState !== "visible");
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("keydown", preventPrint);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("keydown", preventPrint);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      className={hidden ? "relative blur-xl" : "relative"}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden opacity-[0.055]">
        <div className="grid h-full w-full rotate-[-18deg] grid-cols-3 gap-24 text-[28px] font-black uppercase tracking-[0.35em] text-white">
          {Array.from({ length: 30 }).map((_, index) => (
            <span key={index} className="flex items-center justify-center">
              ETW CONFIDENTIAL
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-3 left-3 z-[9999] rounded-md border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
        Authorized ETW Admin
      </div>

      {children}
    </div>
  );
}