import type { Metadata } from "next";
import TopNav from "@/components/layout/top-nav";
import SiteFooter from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo-json-ld";
import { getCategoryContent, getFooterContent, getHomeContent } from "@/lib/content/site";
import { absoluteUrl, brandMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { brand, description } = await brandMetadata();

  return {
    title: {
      default: brand,
      template: brand ? `%s | ${brand}` : "%s",
    },
    description,
    openGraph: {
      siteName: brand,
      description,
    },
  };
}

export default async function CatalogLayout({ children }: LayoutProps<"/">) {
  const [categoryContent, footerContent, homeContent] = await Promise.all([
    getCategoryContent(),
    getFooterContent(),
    getHomeContent(),
  ]);

  const organization =
    footerContent ?
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: footerContent.brandName,
        description: footerContent.description,
        url: absoluteUrl("/"),
        ...(homeContent?.logoImage ? { logo: homeContent.logoImage } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: footerContent.addressValue,
        },
        telephone: footerContent.phones[0],
        email: footerContent.emails[0],
      }
    : null;

  return (
    <>
      {organization ? <JsonLd data={organization} /> : null}
      <TopNav brandName={footerContent?.brandName ?? ""} categories={categoryContent} />
      <main className="flex-1">{children}</main>
      {footerContent ? <SiteFooter footerContent={footerContent} /> : null}
    </>
  );
}
