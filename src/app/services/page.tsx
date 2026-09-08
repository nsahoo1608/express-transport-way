import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Mining Material Transportation",
    description:
      "Transportation support for the movement of mining, mineral and related materials between operational locations.",
  },
  {
    number: "02",
    title: "Heavy & Bulk Material",
    description:
      "Solutions for heavy-load and bulk transportation requirements where dependable vehicle coordination is essential.",
  },
  {
    number: "03",
    title: "Industrial Transportation",
    description:
      "Transportation support for industrial projects, facilities and material movement requirements.",
  },
  {
    number: "04",
    title: "Site-to-Site Movement",
    description:
      "Coordinated movement of materials between mines, project sites, stockyards and other operational destinations.",
  },
  {
    number: "05",
    title: "Transport Coordination",
    description:
      "Operational coordination focused on vehicle availability, movement planning and communication.",
  },
  {
    number: "06",
    title: "Odisha Operations",
    description:
      "Transportation services designed around the requirements of mining and industrial locations across Odisha.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="font-semibold uppercase tracking-[0.25em] text-orange-400">
            Our Services
          </p>

          <h1 className="mt-5 max-w-5xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Transportation solutions
            <span className="block text-orange-400">for demanding operations.</span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            Express Transport Way provides transportation support for mining,
            mineral, heavy and industrial material movement across multiple
            operational locations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.number}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-black tracking-[0.2em] text-orange-400">
                  {service.number}
                </span>

                <span className="text-2xl text-slate-600 transition group-hover:text-orange-400">
                  →
                </span>
              </div>

              <div className="mt-10 h-1 w-12 bg-orange-500 transition-all group-hover:w-20" />

              <h2 className="mt-6 text-2xl font-black">
                {service.title}
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-semibold uppercase tracking-[0.2em] text-orange-400">
                Why Choose Us
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Built for reliability on the road.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                "Operational coordination",
                "Mining-focused transportation",
                "Heavy & bulk movement",
                "Timely communication",
              ].map((item) => (
                <div
                  key={item}
                  className="border-l-2 border-orange-500 bg-white/[0.03] p-5"
                >
                  <p className="font-semibold text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-orange-500">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
                Have a transportation requirement?
              </h2>

              <p className="mt-3 text-orange-950">
                Let&apos;s discuss your material movement and operational needs.
              </p>
            </div>

            <Link
              href="/about"
              className="rounded-lg bg-slate-950 px-7 py-4 text-center font-bold text-white transition hover:bg-slate-800"
            >
              About Our Company
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
