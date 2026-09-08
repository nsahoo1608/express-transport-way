import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
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
          aria-label="Contact phone number" className="phone-blink"
          style={{
            position: "absolute",
            left: "33%",
            top: "0.4%", transform: "translateX(-50%)",
            zIndex: 10000,
            pointerEvents: "none",
            fontSize: "clamp(10px, 1vw, 16px)",
            fontWeight: 700,
            whiteSpace: "nowrap",
            color: "#ffffff",
            textShadow: "0 0 4px rgba(255, 20, 147, 0.9), 0 0 8px rgba(255, 20, 147, 0.6)",
          }}
        >
          <span style={{ color: "#ffffff" }}>+91- </span><span className="phone-blink" style={{ color: "#00FF00", textShadow: "0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 18px #00FF00" }}>9124543915</span>
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
          {/* HOME */}
          <Link
            href="/"
            aria-label="Home"
            style={{
              position: "absolute",
              left: "33%",
              top: "6.5%",
              width: "3.8%",
              height: "2.5%",
              pointerEvents: "auto",
            }}
          />

          {/* ABOUT US */}
          <Link
            href="/about"
            aria-label="About Us"
            style={{
              position: "absolute",
              left: "39%",
              top: "6.5%",
              width: "5%",
              height: "2.5%",
              pointerEvents: "auto",
            }}
          />

          {/* SERVICES */}
          <Link
            href="/services"
            aria-label="Services"
            style={{
              position: "absolute",
              left: "46%",
              top: "6.5%",
              width: "4%",
              height: "2.5%",
              pointerEvents: "auto",
            }}
          />

          {/* MATERIALS */}
          <Link
            href="/materials"
            aria-label="Materials"
            style={{
              position: "absolute",
              left: "51%",
              top: "6.5%",
              width: "5%",
              height: "2.5%",
              pointerEvents: "auto",
            }}
          />

          {/* OUR FLEET */}
          <Link
            href="/fleet"
            aria-label="Our Fleet"
            style={{
              position: "absolute",
              left: "57%",
              top: "6.5%",
              width: "5%",
              height: "2.5%",
              pointerEvents: "auto",
            }}
          />

          {/* LOCATIONS */}
          <Link
            href="/locations"
            aria-label="Locations"
            style={{
              position: "absolute",
              left: "63%",
              top: "6.5%",
              width: "4.5%",
              height: "2.5%",
              pointerEvents: "auto",
            }}
          />

          {/* GALLERY */}
          <Link
            href="/gallery"
            aria-label="Gallery"
            style={{
              position: "absolute",
              left: "68%",
              top: "6.5%",
              width: "5%",
              height: "2.5%",
              pointerEvents: "auto",
            }}
          />          {/* CONTACT - TEST */}
          <Link
            href="/contact"
            aria-label="Contact"
            style={{
              position: "absolute",
              left: "73.5%", top: "6.5%", width: "4.5%",
              height: "2.5%",
              display: "block",
              backgroundColor: "transparent",
              border: "none",
              pointerEvents: "auto",
              zIndex: 10000,
            }}
          />          {/* GET A QUOTE - TEST */}
          <Link
            href="/contact"
            aria-label="Get a Quote"
            style={{
              position: "absolute",
              left: "84%", top: "6.3%", width: "8%",
              height: "3%",
              display: "block",
              backgroundColor: "transparent",
              border: "none",
              pointerEvents: "auto",
              zIndex: 10000,
            }}
          />
        </nav>
      </section>
    </main>
  );
}




































