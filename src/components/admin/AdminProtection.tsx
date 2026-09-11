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

    const preventPrint = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "p"
      ) {
        event.preventDefault();
      }
    };

    const handleVisibility = () => {
      setHidden(document.visibilityState !== "visible");
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventPrint);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventPrint);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      className={hidden ? "relative blur-xl" : "relative"}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden select-none opacity-[0.04]">
        <div className="flex h-full w-full flex-col justify-around gap-20 py-20">
          {Array.from({ length: 6 }).map((_, row) => (
            <div
              key={row}
              className="flex w-full justify-around whitespace-nowrap"
            >
              {Array.from({ length: 2 }).map((_, column) => (
                <span
                  key={column}
                  className="rotate-[-18deg] text-[24px] font-black uppercase tracking-[0.35em] text-white"
                >
                  ETW CONFIDENTIAL
                </span>
              ))}
            </div>
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