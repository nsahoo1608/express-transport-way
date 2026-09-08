"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 font-black text-slate-950">
            ET
          </div>

          <div>
            <div className="text-sm font-extrabold tracking-widest text-white">
              EXPRESS
            </div>
            <div className="text-xs font-semibold tracking-[0.25em] text-orange-400">
              TRANSPORT WAY
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-300 transition hover:text-orange-400"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-orange-400"
          >
            Get in Touch
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-white/10 px-3 py-2 text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-semibold text-slate-200"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-orange-500 px-5 py-3 text-center font-bold text-slate-950"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
