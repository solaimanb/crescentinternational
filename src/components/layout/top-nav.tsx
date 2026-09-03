"use client";

import Link from "next/link";
import type { Route } from "next";
import { Menu } from "lucide-react";
import type { CategorySettings } from "@/lib/catalog/types";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const pageLinks: Array<{ label: string; href: Route }> = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/all-products" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "About Us", href: "/about-us" },
  { label: "Terms and Conditions", href: "/terms-and-conditions" },
];

export default function TopNav({
  brandName,
  categories = [],
}: {
  brandName: string;
  categories?: CategorySettings[];
}) {
  return (
    <header className="dark sticky top-0 z-50 border-b bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 md:px-8">
        <Link href="/" className="truncate font-semibold tracking-tight">
          {brandName}
        </Link>

        <NavigationMenu align="end" className="hidden md:flex">
          <NavigationMenuList>
            {pageLinks.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink render={<Link href={item.href} />} className={navigationMenuTriggerStyle()}>
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            {categories.length > 0 ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-80 gap-1 p-1 sm:w-96 sm:grid-cols-2">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <NavigationMenuLink
                          render={<Link href={`/all-products?category=${category.slug}` as Route} />}
                        >
                          <span className="flex flex-col gap-1">
                            <span className="font-medium">{category.name}</span>
                            {category.description ? (
                              <span className="line-clamp-2 text-xs text-muted-foreground">
                                {category.description}
                              </span>
                            ) : null}
                          </span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : null}
          </NavigationMenuList>
        </NavigationMenu>

        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="dark bg-background text-foreground">
            <SheetHeader>
              <SheetTitle>{brandName}</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-1 px-4 pb-6">
              {pageLinks.map((item) => (
                <SheetClose
                  key={item.href}
                  render={<Link href={item.href} />}
                  className={navigationMenuTriggerStyle()}
                >
                  {item.label}
                </SheetClose>
              ))}
              {categories.length > 0 ? (
                <div className="mt-4 grid gap-1">
                  <p className="px-2.5 text-xs font-medium text-muted-foreground">Categories</p>
                  {categories.map((category) => (
                    <SheetClose
                      key={category.slug}
                      render={<Link href={`/all-products?category=${category.slug}` as Route} />}
                      className={navigationMenuTriggerStyle()}
                    >
                      {category.name}
                    </SheetClose>
                  ))}
                </div>
              ) : null}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
