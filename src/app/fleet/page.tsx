import Link from "next/link";

const fleet = [
  {
    title: "Heavy Transport Vehicles",
    description:
      "Suitable transportation support for heavy and bulk material movement.",
  },
  {
    title: "Tipper & Bulk Carriers",
    description:
      "Vehicle solutions for bulk material transportation where applicable to the route and cargo.",
  },
  {
    title: "Material Transport Vehicles",
    description:
      "Flexible vehicle support for different industrial and construction material requirements.",
  },
  {
    title: "Project-Based Deployment",
    description:
      "Transportation can be planned according to route, material, quantity and operational schedule.",
  },
];

export default function FleetPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
                Express Transport Way
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Our Fleet
              </h1>
            </div>

            <Link
              href="/"
              className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              Fleet &amp; Deployment
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Transportation resources planned around your cargo requirement.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Express Transport Way focuses on dependable vehicle deployment
              for mining, construction and industrial transportation
              requirements. Fleet selection can be planned according to cargo,
              route, loading conditions and delivery schedule.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {fleet.map((vehicle) => (
              <article
                key={vehicle.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-lg transition hover:-translate-y-1 hover:border-red-700"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-700 text-sm font-black">
                    ETW
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      {vehicle.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-400">
                      {vehicle.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Requirement
              </p>
              <p className="mt-2 font-semibold">
                Cargo &amp; quantity based planning
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Route
              </p>
              <p className="mt-2 font-semibold">
                Loading to destination coordination
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Operations
              </p>
              <p className="mt-2 font-semibold">
                Schedule-focused transportation
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-flex rounded-md bg-red-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Discuss Your Vehicle Requirement
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
