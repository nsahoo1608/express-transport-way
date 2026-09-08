import Link from "next/link";

const materials = [
  {
    title: "Mineral Materials",
    description:
      "Transportation support for mineral and mining-related materials according to project requirements.",
  },
  {
    title: "Construction Materials",
    description:
      "Reliable movement of construction materials between loading, project and delivery locations.",
  },
  {
    title: "Industrial Materials",
    description:
      "Transportation solutions for industrial material movement and scheduled logistics requirements.",
  },
  {
    title: "Bulk Materials",
    description:
      "Vehicle-based transportation support for bulk material movement across designated routes.",
  },
];

export default function MaterialsPage() {
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
                Materials We Transport
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
              Cargo &amp; Material Transportation
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Transportation support for mining, construction and industrial
              materials.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Express Transport Way provides transportation services based on
              material type, route, vehicle requirement and delivery schedule.
              Contact us to discuss your specific cargo movement requirement.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((material) => (
              <article
                key={material.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:-translate-y-1 hover:border-red-700"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-700 text-lg font-black">
                  ETW
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {material.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {material.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-red-900/50 bg-red-950/30 p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Have a specific material requirement?
                </h2>

                <p className="mt-2 max-w-2xl text-slate-300">
                  Share the material, quantity, loading point and destination
                  with our team so we can understand your transportation
                  requirement.
                </p>
              </div>

              <Link
                href="/contact"
                className="shrink-0 rounded-md bg-red-700 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-red-800"
              >
                Get a Transport Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
