import type { Metadata } from "next";
import AdminProtection from "@/components/admin/AdminProtection";

export const metadata: Metadata = {
  title: "ETW Administration",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminProtection>{children}</AdminProtection>;
}