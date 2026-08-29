export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full">{children}</div>;
}
