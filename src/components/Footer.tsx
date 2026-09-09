import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-wide text-white">
            EXPRESS TRANSPORT WAY
          </h2>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
            Mining & Industrial Transportation
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Reliable transportation solutions for mining, mineral and
            industrial materials across Odisha and beyond.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white">Quick Links</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/about" className="hover:text-emerald-400">
              About
            </Link>
            <Link href="/services" className="hover:text-emerald-400">
              Services
            </Link>
            <Link href="/fleet" className="hover:text-emerald-400">
              Fleet
            </Link>
            <Link href="/contact" className="hover:text-emerald-400">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Business Access</h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Authorized ETW personnel can access the internal administration
            system.
          </p>

          <Link
            href="/admin/login"
            className="mt-5 inline-flex rounded-lg border border-emerald-500/40 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950"
          >
            Administration
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Express Transport Way. All rights
        reserved.
      </div>
    </footer>
  );
}