import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Express Transport Way | Mining & Industrial Transportation",
  description:
    "Express Transport Way provides reliable mining, mineral and industrial material transportation services across Odisha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
