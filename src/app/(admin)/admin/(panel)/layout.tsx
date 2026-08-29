import { Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/require-admin";
import { AdminSidebar } from "./_components/admin-sidebar";

export default function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading admin…</div>}>
      <AdminPanelShell>{children}</AdminPanelShell>
    </Suspense>
  );
}

async function AdminPanelShell({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  return (
    <SidebarProvider>
      <AdminSidebar email={session.user.email} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
