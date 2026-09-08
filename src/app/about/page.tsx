import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="font-semibold uppercase tracking-[0.25em] text-orange-400">
            About Express Transport Way
          </p>

          <h1 className="mt-5 max-w-5xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Reliable transportation for
            <span className="block text-orange-400">
              mining, minerals & industry.
            </span>
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
              Who We Are
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              A transportation partner built on dependable operations.
            </h2>

            <div className="mt-8 space-y-5 text-lg leading-8 text-slate-400">
              <p>
                Express Transport Way was established in 2024 as a partnership
                firm to serve transportation requirements associated with
                mining, mineral and industrial operations.
              </p>

              <p>
                We understand that material movement is an important part of
                every industrial operation. Our focus is therefore on proper
                coordination, dependable vehicle deployment and responsible
                transportation support.
              </p>

              <p>
                We aim to build long-term relationships with businesses by
                providing professional transportation services suited to their
                operational requirements.
              </p>

              <p>
                Our operating focus is across Odisha, with a vision to develop
                a wider and dependable transportation network as the business
                grows.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Company Profile
            </p>

            <div className="mt-8 space-y-7">
              <div className="border-b border-white/10 pb-6">
                <p className="text-sm text-slate-500">Company Name</p>
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

              <div className="border-b border-white/10 pb-6">
                <p className="text-sm text-slate-500">Core Business</p>
                <p className="mt-1 text-xl font-bold">
                  Mining & Mineral Transportation
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Service Focus</p>
                <p className="mt-1 text-xl font-bold">
                  Industrial Material Transportation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.2em] text-orange-400">
              Our Approach
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Simple principles. Professional execution.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="mb-6 h-1 w-12 bg-orange-500" />
              <h3 className="text-2xl font-black">Reliability</h3>
              <p className="mt-4 leading-8 text-slate-400">
                We focus on dependable transportation coordination and
                consistent operational support.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="mb-6 h-1 w-12 bg-orange-500" />
              <h3 className="text-2xl font-black">Coordination</h3>
              <p className="mt-4 leading-8 text-slate-400">
                Clear communication and proper coordination help keep material
                movement organized and efficient.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="mb-6 h-1 w-12 bg-orange-500" />
              <h3 className="text-2xl font-black">Responsibility</h3>
              <p className="mt-4 leading-8 text-slate-400">
                We approach every transportation requirement with professional
                responsibility and attention to operational needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="mb-6 h-1 w-12 bg-orange-500" />
            <h2 className="text-3xl font-black">Our Mission</h2>
            <p className="mt-5 leading-8 text-slate-400">
              To provide dependable transportation support that helps mining,
              mineral and industrial businesses move materials efficiently,
              responsibly and with professional coordination.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="mb-6 h-1 w-12 bg-orange-500" />
            <h2 className="text-3xl font-black">Our Vision</h2>
            <p className="mt-5 leading-8 text-slate-400">
              To develop Express Transport Way into a trusted transportation
              partner for mining, infrastructure and industrial operations
              across Odisha and, in the future, beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 text-center lg:px-8">
        <h2 className="text-3xl font-black sm:text-4xl">
          Let&apos;s move your operations forward.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Explore our transportation services and discover how Express
          Transport Way can support your material movement requirements.
        </p>

        <Link
          href="/services"
          className="mt-8 inline-block rounded-lg bg-orange-500 px-7 py-4 font-bold transition hover:bg-orange-400"
        >
          Explore Our Services
        </Link>
      </section>
    </main>
  );
}
