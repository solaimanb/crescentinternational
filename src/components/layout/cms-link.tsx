import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { isSafeCmsHref, isSafeHttpUrl } from "@/lib/content-safety";

type CmsLinkProps = {
  href: string;
  className?: string;
  children?: ReactNode;
};

export default function CmsLink({ href, className, children }: CmsLinkProps) {
  if (!isSafeCmsHref(href)) {
    return <span className={className}>{children}</span>;
  }

  if (isSafeHttpUrl(href)) {
    return (
      <a href={href} className={className} rel="noopener noreferrer">
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
