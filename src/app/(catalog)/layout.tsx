import TopNav from "@/components/layout/top-nav";
import SiteFooter from "@/components/layout/site-footer";
import { getCategoryContent, getFooterContent } from "@/lib/content/site";

export default async function CatalogLayout({ children }: LayoutProps<"/">) {
  const categoryContent = await getCategoryContent();
  const footerContent = await getFooterContent();

  return (
    <>
      <TopNav brandName={footerContent?.brandName ?? ""} categories={categoryContent} />
      <main className="flex-1">{children}</main>
      {footerContent ? <SiteFooter footerContent={footerContent} /> : null}
    </>
  );
}
