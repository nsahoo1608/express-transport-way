import Link from "next/link";

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Operations & Coverage
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            Transportation Operations Across Odisha
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Express Transport Way supports transportation requirements for
            mining, industrial, construction and bulk materials across
            multiple locations in Odisha and beyond.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-xl font-semibold">Mining Locations</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Transport support for material movement connected with mining
              and mineral-related operations.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-xl font-semibold">Industrial Locations</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Reliable movement of industrial and bulk materials between
              operational sites, facilities and designated destinations.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-xl font-semibold">Project Routes</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Route planning based on material type, origin, destination,
              vehicle requirement and project conditions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8 sm:p-10">
            <h2 className="text-2xl font-bold">
              Need transportation for a specific route?
            </h2>

            <p className="mt-3 max-w-2xl text-slate-300">
              Share your pickup location, destination, material and
              transportation requirement with our team.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Request a Transport Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
