import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* EXISTING HERO - PRESERVED */}
      <section className="relative w-full overflow-hidden">
        <Image
          src="/image/3899ac92-c882-4d71-a07b-3aff4f303fea.png"
          alt="Express Transport Way"
          width={1536}
          height={1024}
          priority
          quality={100}
          sizes="100vw"
          className="block w-full h-auto"
        />

        <div
          aria-label="Contact phone number"
          className="phone-blink"
          style={{
            position: "absolute",
            left: "33%",
            top: "0.4%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            pointerEvents: "none",
            fontSize: "clamp(10px, 1vw, 16px)",
            fontWeight: 700,
            whiteSpace: "nowrap",
            color: "#ffffff",
            textShadow:
              "0 0 4px rgba(255, 20, 147, 0.9), 0 0 8px rgba(255, 20, 147, 0.6)",
          }}
        >
          <span style={{ color: "#ffffff" }}>+91- </span>
          <span
            className="phone-blink"
            style={{
              color: "#00FF00",
              textShadow:
                "0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 18px #00FF00",
            }}
          >
            9124543915
          </span>
        </div>

        <nav
          aria-label="Main navigation"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Link href="/" aria-label="Home" style={{ position: "absolute", left: "33%", top: "6.5%", width: "3.8%", height: "2.5%", pointerEvents: "auto" }} />
          <Link href="/about" aria-label="About Us" style={{ position: "absolute", left: "39%", top: "6.5%", width: "5%", height: "2.5%", pointerEvents: "auto" }} />
          <Link href="/services" aria-label="Services" style={{ position: "absolute", left: "46%", top: "6.5%", width: "4%", height: "2.5%", pointerEvents: "auto" }} />
          <Link href="/materials" aria-label="Materials" style={{ position: "absolute", left: "51%", top: "6.5%", width: "5%", height: "2.5%", pointerEvents: "auto" }} />
          <Link href="/fleet" aria-label="Our Fleet" style={{ position: "absolute", left: "57%", top: "6.5%", width: "5%", height: "2.5%", pointerEvents: "auto" }} />
          <Link href="/locations" aria-label="Locations" style={{ position: "absolute", left: "63%", top: "6.5%", width: "4.5%", height: "2.5%", pointerEvents: "auto" }} />
          <Link href="/gallery" aria-label="Gallery" style={{ position: "absolute", left: "68%", top: "6.5%", width: "5%", height: "2.5%", pointerEvents: "auto" }} />
          <Link href="/contact" aria-label="Contact" style={{ position: "absolute", left: "73.5%", top: "6.5%", width: "4.5%", height: "2.5%", display: "block", backgroundColor: "transparent", border: "none", pointerEvents: "auto", zIndex: 10000 }} />
          <Link href="/contact" aria-label="Get a Quote" style={{ position: "absolute", left: "84%", top: "6.3%", width: "8%", height: "3%", display: "block", backgroundColor: "transparent", border: "none", pointerEvents: "auto", zIndex: 10000 }} />
        </nav>
      </section>

      {/* TRANSPORTATION HERO */}
      <section className="relative isolate min-h-[620px] overflow-hidden">
        <Image
          src="/image/etw-hero-transport.jpg"
          alt="Heavy transport vehicle on an industrial road"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-slate-950/20" />

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="max-w-4xl">

            <p className="etw-brand-pulse mb-4 text-sm font-extrabold uppercase tracking-[0.32em] text-white">
              EXPRESS TRANSPORT WAY
            </p>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Mining & Industrial Transportation
            </h1>

            <p className="mt-5 text-xl font-semibold text-emerald-400 sm:text-2xl">
              A Reliable Transportation Partner for Your Industry
            </p>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
              Professional transportation solutions for mining, infrastructure,
              industrial and bulk material movement across Odisha.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="etw-quote-button rounded-lg px-7 py-3.5 text-sm font-extrabold text-white shadow-2xl"
              >
                GET A QUOTE
              </Link>

              <Link
                href="/services"
                className="rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                EXPLORE OUR SERVICES
              </Link>
            </div>

            <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/15 bg-black/35 p-5 backdrop-blur-sm">
                <p className="text-sm font-bold text-emerald-400">MINING</p>
                <p className="mt-1 text-sm text-slate-200">
                  Material transportation
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-black/35 p-5 backdrop-blur-sm">
                <p className="text-sm font-bold text-emerald-400">INDUSTRIAL</p>
                <p className="mt-1 text-sm text-slate-200">
                  Bulk material movement
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-black/35 p-5 backdrop-blur-sm">
                <p className="text-sm font-bold text-emerald-400">ODISHA</p>
                <p className="mt-1 text-sm text-slate-200">
                  Regional operations
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
