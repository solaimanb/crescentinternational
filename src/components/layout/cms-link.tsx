import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

type CmsLinkProps = {
  href: string;
  className?: string;
  children?: ReactNode;
};

export default function CmsLink({ href, className, children }: CmsLinkProps) {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href as Route} className={className}>
      {children}
    </Link>
  );
}
