import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin",
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full">{children}</div>;
}
