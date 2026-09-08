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
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="font-semibold uppercase tracking-[0.25em] text-orange-400">
            Our Services
          </p>

          <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Transportation solutions
            <span className="block text-orange-400">for demanding operations.</span>
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300">
            Express Transport Way provides transportation support for mining,
            mineral, heavy and industrial material movement across multiple
            operational locations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.number}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between">


              </div>



              <h2 className="mt-3 text-lg font-black leading-6">
                {service.title}
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.2em] text-orange-400">
              Operational Strength
            </p>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Built around dependable transport operations.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Our approach is focused on practical coordination, dependable
              vehicle movement and clear communication across every stage of
              transportation.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Vehicle Availability & Coordination",
                description:
                  "Vehicle arrangement and operational coordination based on transportation requirements.",
              },
              {
                title: "Mining & Mineral Movement",
                description:
                  "Focused transportation support for mining, mineral and industrial material movement.",
              },
              {
                title: "Location & Route Coordination",
                description:
                  "Systematic coordination of pickup locations, destinations and movement requirements.",
              },
              {
                title: "Reliable Communication",
                description:
                  "Timely communication between customers, vehicle owners, drivers and the ETW operations team.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                {item.title === "Vehicle Availability & Coordination" && (
                  <div className="mb-4 overflow-hidden rounded-lg border border-orange-400/20 bg-slate-950/80 p-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em]">
                      <span className="text-orange-400">Vehicle Route</span>
                      <span className="flex items-center gap-1.5 text-green-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                        Tracking Ready
                      </span>
                    </div>

                    <div className="relative mt-4 h-10">
                      <div className="absolute left-2 right-2 top-4 h-px bg-slate-700" />
                      <div className="absolute left-[18%] top-[9px] h-3 w-3 rounded-full border-2 border-orange-400 bg-slate-950" />
                      <div className="absolute left-[48%] top-[9px] h-3 w-3 rounded-full border-2 border-slate-400 bg-slate-950" />
                      <div className="absolute right-[16%] top-[9px] h-3 w-3 rounded-full border-2 border-green-400 bg-slate-950" />

                      <div className="absolute left-[18%] top-[12px] h-1 w-8 animate-pulse rounded-full bg-orange-400/70" />

                      <div className="absolute left-[43%] top-0 text-sm animate-pulse">
                        🚛
                      </div>
                    </div>

                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>Pickup</span>
                      <span>Route</span>
                      <span>Destination</span>
                    </div>
                  </div>
                )}

                {item.title === "Mining & Mineral Movement" && (
                  <div className="mb-4 overflow-hidden rounded-lg border border-orange-400/20 bg-slate-950/80">
                    <div className="relative h-40">
                      <img src="/image/imagemining-stock-point.jpg" alt="Mining mineral stock point and loading operation" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.16em]">
                        <span className="text-orange-300">Stock Point</span>
                        <span className="flex items-center gap-1.5 text-green-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />Loading Ready</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 divide-x divide-white/10 border-t border-white/10 bg-slate-950/90 text-center">
                      <div className="px-1 py-2"><div className="text-[8px] uppercase tracking-wider text-slate-500">Stock Point</div><div className="mt-1 text-[9px] font-semibold text-slate-200">Site</div></div>
                      <div className="px-1 py-2"><div className="text-[8px] uppercase tracking-wider text-slate-500">Material</div><div className="mt-1 text-[9px] font-semibold text-slate-200">Mineral</div></div>
                      <div className="px-1 py-2"><div className="text-[8px] uppercase tracking-wider text-slate-500">Loading</div><div className="mt-1 text-[9px] font-semibold text-slate-200">Active</div></div>
                      <div className="px-1 py-2"><div className="text-[8px] uppercase tracking-wider text-slate-500">Dispatch</div><div className="mt-1 text-[9px] font-semibold text-slate-200">Ready</div></div>
                    </div>
                  </div>
                )}

                <h3 className="text-base font-black text-slate-200">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-500">
        <div className="mx-auto max-w-7xl px-6 py-11 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">
                Need Reliable Transportation Support?
              </h2>

              <p className="mt-2 text-sm text-orange-950">
                Tell us your material, location and transportation requirement.
              </p>
            </div>

            <Link
              href="/contact"
              className="rounded-lg bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Request a Transport Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}






