import Image from "next/image";
import Link from "next/link";

const accessOptions = [
  {
    title: "General Visitor",
    description: "Explore the public Express Transport Way website.",
    href: "/about",
    label: "Enter Website",
  },
  {
    title: "Corporate / Business",
    description: "Business enquiries, transport requirements and client access.",
    href: "/contact",
    label: "Business Access",
  },
  {
    title: "Vehicle Owner / Fleet Partner",
    description: "Vehicles, trips, bills, advances, payments and owner records.",
    href: "/owner/login",
    label: "Owner Login",
  },
  {
    title: "ETW Employee",
    description: "Employee services and internal workforce access.",
    href: "/employee/login",
    label: "Employee Login",
  },
  {
    title: "ETW Administration",
    description: "Authorized management access to the ETW administration system.",
    href: "/admin/login",
    label: "Admin Login",
  },
];

export default function PortalEntry() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <Image
        src="/image/etw-portal-hyva-entry.jpg"
        alt="Heavy-duty HYVA mining transport vehicle for Express Transport Way"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-slate-950/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-8">
        <div className="w-full max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.34em] text-emerald-400">
            EXPRESS TRANSPORT WAY
          </p>

          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
            Mining & Industrial Transportation
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Reliable transportation solutions for mining, mineral and
            industrial material movement across Odisha and beyond.
          </p>

          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
              Select Your Access
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {accessOptions.map((option) => (
                <Link
                  key={option.title}
                  href={option.href}
                  className="group rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-black/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-extrabold text-white sm:text-lg">
                        {option.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {option.description}
                      </p>
                    </div>

                    <span className="mt-1 shrink-0 text-emerald-400 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                    {option.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/50">
            <span>Secure Access</span>
            <span>•</span>
            <span>Authorized Portals</span>
            <span>•</span>
            <span>Express Transport Way</span>
          </div>
        </div>
      </div>
    </section>
  );
}