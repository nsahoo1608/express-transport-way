"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const accessOptions = [
  {
    title: "General Visitor",
    description: "Explore the public Express Transport Way website.",
    href: "/about",
    label: "Enter Website",
  },
  {
    title: "Corporate / Business",
    description:
      "Business enquiries, transport requirements and client access.",
    href: "/contact",
    label: "Business Access",
  },
  {
    title: "Vehicle Owner / Fleet Partner",
    description:
      "Vehicles, trips, bills, advances, payments and owner records.",
    href: "/owner/login",
    label: "Owner Login",
  },
  {
    title: "ETW Staff / Employee",
    description:
      "Employee services and internal workforce access.",
    href: "/employee/login",
    label: "Employee Login",
  },
  {
    title: "ETW Administration",
    description:
      "Authorized management access to the ETW administration system.",
    href: "/admin/login",
    label: "Admin Login",
  },
];

const videos = [
  "/video/Create_a_cinematic_websit.mp4",
  "/video/need_vedio_with_mt_parameter.mp4",
];

export default function PortalEntry() {
  const [scene, setScene] = useState<"video1" | "video2" | "access">(
    "video1"
  );
  const [videoIndex, setVideoIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scene === "access") return;

    const timer = window.setTimeout(() => {
      if (videoIndex === 0) {
        setFade(true);

        window.setTimeout(() => {
          setVideoIndex(1);
          setScene("video2");

          window.setTimeout(() => {
            setFade(false);
          }, 150);
        }, 700);
      } else {
        setFade(true);

        window.setTimeout(() => {
          setScene("access");
        }, 700);
      }
    }, 9300);

    return () => window.clearTimeout(timer);
  }, [scene, videoIndex]);

  useEffect(() => {
    if (!videoRef.current || scene === "access") return;

    videoRef.current.currentTime = 0;

    const playPromise = videoRef.current.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser autoplay restrictions are handled by muted playback.
      });
    }
  }, [videoIndex, scene]);

  const enterAccess = () => {
    setFade(true);

    window.setTimeout(() => {
      setScene("access");
    }, 500);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* CINEMATIC VIDEO SCENE */}
      {scene !== "access" && (
        <section
          className={`absolute inset-0 z-30 min-h-screen transition-opacity duration-700 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <video
            ref={videoRef}
            key={videos[videoIndex]}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/image/etw-portal-hyva-entry.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={videos[videoIndex]} type="video/mp4" />
          </video>

          {/* Cinematic darkening */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Bottom cinematic gradient */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* ETW Branding */}
          <div className="relative z-10 flex min-h-screen items-end px-6 pb-14 sm:px-10 lg:px-16 lg:pb-20">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.38em] text-emerald-400 sm:text-sm">
                EXPRESS TRANSPORT WAY
              </p>

              <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Mining &amp;
                <br />
                Industrial Transportation
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                Moving mineral and industrial materials with strength,
                reliability and professional transport solutions.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={enterAccess}
                  className="rounded-full border border-white/30 bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 shadow-xl transition hover:scale-105 hover:bg-emerald-400"
                >
                  Enter ETW
                </button>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                  {videoIndex === 0
                    ? "Cinematic Transport Experience"
                    : "Express Transport Way"}
                </span>
              </div>
            </div>
          </div>

          {/* Scene indicator */}
          <div className="absolute right-6 top-6 z-20 flex items-center gap-2 sm:right-10 sm:top-10">
            <span
              className={`h-1.5 w-8 rounded-full transition-all ${
                videoIndex === 0 ? "bg-white" : "bg-white/30"
              }`}
            />
            <span
              className={`h-1.5 w-8 rounded-full transition-all ${
                videoIndex === 1 ? "bg-white" : "bg-white/30"
              }`}
            />
          </div>
        </section>
      )}

      {/* ACCESS SCENE */}
      <section
        className={`relative min-h-screen transition-opacity duration-1000 ${
          scene === "access"
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <Image
          src="/image/etw-portal-hyva-entry.jpg"
          alt="Express Transport Way mining transport"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-slate-950/65" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/25" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-8">
          <div className="w-full max-w-4xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.34em] text-emerald-400">
              EXPRESS TRANSPORT WAY
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to ETW
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Select the access area that matches your role.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {accessOptions.map((option) => (
                <Link
                  key={option.title}
                  href={option.href}
                  className="group rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-black/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold">
                        {option.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {option.description}
                      </p>
                    </div>

                    <span className="text-xl text-emerald-400 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <div className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/55">
                    {option.label}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              <span>Secure Access</span>
              <span>•</span>
              <span>Authorized Portals</span>
              <span>•</span>
              <span>Express Transport Way</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
