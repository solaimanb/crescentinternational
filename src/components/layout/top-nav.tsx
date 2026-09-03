"use client";

import Link from "next/link";
import type { Route } from "next";
import type { CategorySettings } from "@/lib/catalog/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const navItemClassName = cn(
  navigationMenuTriggerStyle(),
  "text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-popup-open:bg-white/10 data-popup-open:hover:bg-white/15 data-open:bg-white/10 data-open:hover:bg-white/15 data-open:focus:bg-white/15",
);

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
    <header className="sticky top-0 z-50 border-b border-black bg-black text-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 md:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          {brandName}
        </Link>

        <NavigationMenu align="end" className="max-w-full">
          <NavigationMenuList className="flex-wrap justify-end">
            {pageLinks.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink render={<Link href={item.href} />} className={navItemClassName}>
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            {categories.length > 0 ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger className={navItemClassName}>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[min(100vw-2rem,32rem)] gap-1 p-1 sm:grid-cols-2">
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
      </div>
    </header>
  );
}
