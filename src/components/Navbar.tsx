"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Materials", href: "/materials" },
  { name: "Fleet", href: "/fleet" },
  { name: "Locations", href: "/locations" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center"
        >
          <div>
            <div className="text-lg font-extrabold tracking-wide">
              EXPRESS TRANSPORT WAY
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-emerald-400">
              Mining & Industrial Transportation
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 lg:block"
        >
          Get a Quote
        </Link>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-white/15 px-3 py-2 text-xl lg:hidden"
        >
          {menuOpen ? "X" : "?"}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 bg-slate-950 px-5 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-emerald-400"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-slate-950"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
