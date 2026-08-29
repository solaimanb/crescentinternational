"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Factory,
  FileText,
  Home,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Package,
  PanelBottom,
  ScrollText,
} from "lucide-react";
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

const catalogue = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/products", label: "Products", icon: Package },
] as const;

const site = [
  { href: "/admin/settings/home", label: "Home", icon: Home },
  { href: "/admin/settings/about", label: "About", icon: FileText },
  { href: "/admin/settings/contact", label: "Contact", icon: Mail },
  { href: "/admin/settings/footer", label: "Footer", icon: PanelBottom },
  { href: "/admin/settings/terms", label: "Terms", icon: ScrollText },
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
  items: typeof catalogue | typeof site;
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
        <NavGroup label="Catalogue" items={catalogue} pathname={pathname} />
        <NavGroup label="Site" items={site} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOutAction}>
              <SidebarMenuButton type="submit" tooltip="Sign out">
                <LogOut />
                <span className="truncate">{email}</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
