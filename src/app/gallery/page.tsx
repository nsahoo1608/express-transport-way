import Link from "next/link";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Company Gallery
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            Our Transportation Operations
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A visual showcase of Express Transport Way&apos;s transportation
            activities, vehicles, material movement and field operations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Mining Material Transport",
              text: "Transportation activities supporting mining and mineral-related material movement.",
            },
            {
              title: "Heavy Transport Operations",
              text: "Vehicle deployment and transportation operations for demanding routes and loads.",
            },
            {
              title: "Industrial Logistics",
              text: "Movement of industrial and bulk materials between operational locations.",
            },
            {
              title: "Project Transportation",
              text: "Transportation support planned around project-specific requirements.",
            },
            {
              title: "Route Operations",
              text: "Organized movement between pickup points, operational sites and destinations.",
            },
            {
              title: "Field Operations",
              text: "On-ground transportation activities carried out according to customer requirements.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.07]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-400/10 text-2xl text-emerald-400">
                +
              </div>

              <h2 className="text-xl font-semibold">{item.title}</h2>

              <p className="mt-4 leading-7 text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8 sm:p-10">
            <h2 className="text-2xl font-bold">
              Have a transportation requirement?
            </h2>

            <p className="mt-3 max-w-2xl text-slate-300">
              Contact Express Transport Way with your material, route and
              vehicle requirement.
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
