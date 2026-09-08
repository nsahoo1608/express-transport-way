import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="font-semibold uppercase tracking-[0.25em] text-orange-400">
            About Us
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Moving industry forward,
            <span className="block text-orange-400">one load at a time.</span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            Express Transport Way is a transportation partnership firm
            established in 2024, focused on dependable movement of mining,
            mineral and industrial materials across Odisha.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-semibold uppercase tracking-[0.2em] text-orange-400">
              Our Company
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Built around reliability, coordination and service.
            </h2>

            <div className="mt-8 space-y-5 text-lg leading-8 text-slate-400">
              <p>
                Express Transport Way was established in 2024 as a partnership
                firm with a focus on transportation requirements connected with
                mining and industrial operations.
              </p>

              <p>
                Our approach is simple: understand the movement requirement,
                coordinate the transportation operation and work toward safe
                and timely delivery.
              </p>

              <p>
                As our operations grow, our objective is to build a dependable
                transportation network serving multiple industrial and mining
                locations across Odisha.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Company Snapshot
            </p>

            <div className="mt-8 space-y-7">
              <div className="border-b border-white/10 pb-6">
                <p className="text-sm text-slate-500">Company</p>
                <p className="mt-1 text-xl font-bold">
                  Express Transport Way
                </p>
              </div>

              <div className="border-b border-white/10 pb-6">
                <p className="text-sm text-slate-500">Established</p>
                <p className="mt-1 text-xl font-bold">2024</p>
              </div>

              <div className="border-b border-white/10 pb-6">
                <p className="text-sm text-slate-500">Business Structure</p>
                <p className="mt-1 text-xl font-bold">Partnership Firm</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Primary Focus</p>
                <p className="mt-1 text-xl font-bold">
                  Mining & Industrial Transportation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="mb-6 h-1 w-12 bg-orange-500" />
              <h2 className="text-3xl font-black">Our Mission</h2>
              <p className="mt-5 leading-8 text-slate-400">
                To provide dependable transportation support that helps
                businesses move materials efficiently, responsibly and with
                professional coordination.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="mb-6 h-1 w-12 bg-orange-500" />
              <h2 className="text-3xl font-black">Our Vision</h2>
              <p className="mt-5 leading-8 text-slate-400">
                To develop Express Transport Way into a trusted transportation
                partner for mining, infrastructure and industrial operations
                across Odisha and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
        <h2 className="text-3xl font-black sm:text-4xl">
          Looking for a transportation partner?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Explore our transportation services and see how Express Transport
          Way can support your operational requirements.
        </p>

        <Link
          href="/services"
          className="mt-8 inline-block rounded-lg bg-orange-500 px-7 py-4 font-bold transition hover:bg-orange-400"
        >
          Explore Services
        </Link>
      </section>
    </main>
  );
}
