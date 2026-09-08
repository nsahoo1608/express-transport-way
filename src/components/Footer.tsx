import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 font-black text-slate-950">
              ET
            </div>

            <div>
              <div className="text-sm font-extrabold tracking-widest text-white">
                EXPRESS
              </div>
              <div className="text-xs font-semibold tracking-[0.2em] text-orange-400">
                TRANSPORT WAY
              </div>
            </div>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-400">
            Reliable transportation solutions for mining, mineral and
            industrial material movement across Odisha.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <Link href="/" className="hover:text-orange-400">Home</Link>
            <Link href="/about" className="hover:text-orange-400">About Us</Link>
            <Link href="/services" className="hover:text-orange-400">Services</Link>
            <Link href="/contact" className="hover:text-orange-400">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
            Our Focus
          </h3>

          <div className="space-y-3 text-sm text-slate-400">
            <p>Mining Material Transportation</p>
            <p>Heavy & Bulk Material Movement</p>
            <p>Industrial Transportation</p>
            <p>Odisha-Wide Operations</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Express Transport Way. All rights reserved.
      </div>
    </footer>
  );
}
