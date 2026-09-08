import Link from "next/link";

export default function ContactPage() {
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
                Contact &amp; Get a Quote
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
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
                Transport Enquiry
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Let&apos;s discuss your transportation requirement.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Contact Express Transport Way for transportation requirements
                involving mining, mineral, construction and industrial
                materials across Odisha.
              </p>

              <div className="mt-10 space-y-5">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Phone
                  </p>
                  <a
                    href="tel:+919124543915"
                    className="mt-2 block text-xl font-bold text-green-400 hover:text-green-300"
                  >
                    +91-9124543915
                  </a>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Business
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Express Transport Way
                  </p>
                  <p className="mt-1 text-slate-400">
                    Transportation &amp; Logistics Services
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Operating Area
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Odisha, India
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
              <h2 className="text-2xl font-bold">
                Request a Transport Quote
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Share your basic requirement. Our team can review the
                transportation details and contact you.
              </p>

              <form className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="material"
                    className="block text-sm font-semibold"
                  >
                    Material / Cargo
                  </label>
                  <input
                    id="material"
                    name="material"
                    type="text"
                    placeholder="Example: iron ore, stone, construction material"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="from"
                      className="block text-sm font-semibold"
                    >
                      From
                    </label>
                    <input
                      id="from"
                      name="from"
                      type="text"
                      placeholder="Loading location"
                      className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="to"
                      className="block text-sm font-semibold"
                    >
                      To
                    </label>
                    <input
                      id="to"
                      name="to"
                      type="text"
                      placeholder="Delivery location"
                      className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold"
                  >
                    Requirement
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about quantity, vehicle requirement, schedule, etc."
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg bg-red-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-800"
                >
                  Submit Transport Enquiry
                </button>

                <p className="text-center text-xs text-slate-500">
                  Enquiry submission will be connected to the business
                  communication system in the next step.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
