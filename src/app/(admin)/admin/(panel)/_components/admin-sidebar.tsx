"use client";

import Link from "next/link";
import type { Route } from "next";
import { useTransition } from "react";
import { usePathname } from "next/navigation";
import { Factory, Images, LayoutDashboard, Layers, LogOut, Package, Settings } from "lucide-react";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { signOutAction } from "../../login/actions";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/banners", label: "Banners", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: typeof nav;
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                render={<Link href={item.href as Route} />}
                isActive={isActivePath(pathname, item.href)}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [signOutPending, startSignOut] = useTransition();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href={"/admin" as Route} />} tooltip="Crescent">
              <Factory />
              <span className="font-semibold">Crescent</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Catalogue" items={nav} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ConfirmAlertDialog
              trigger={
                <SidebarMenuButton type="button" tooltip="Sign out">
                  <LogOut />
                  <span className="truncate">{email}</span>
                </SidebarMenuButton>
              }
              title="Sign out?"
              description="You will need to sign in again to open the admin panel."
              confirmLabel="Sign out"
              pending={signOutPending}
              onConfirm={() => {
                startSignOut(() => {
                  void signOutAction();
                });
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
