import Link from "next/link";
import type { Metadata } from "next";
import type { Route } from "next";
import HomeBanners from "@/components/catalog/home-banners";
import ProductCard from "@/components/catalog/product-card";
import ProductWheel from "@/components/catalog/product-wheel";
import CmsLink from "@/components/layout/cms-link";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/catalog/products";
import { getCategoryGroups, getWheelProducts } from "@/lib/catalog/groups";
import { getCategoryContent, getHomeBanners, getHomeContent } from "@/lib/content/site";
import { brandMetadata, openGraphImage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ description }, banners] = await Promise.all([brandMetadata(), getHomeBanners()]);
  const banner = banners[0];

  return {
    title: banner?.title || undefined,
    description: banner?.subtitle || description,
    alternates: { canonical: "/" },
    openGraph: banner?.image ? { images: openGraphImage(banner.image, banner.imageAlt) } : undefined,
  };
}

export default async function HomePage() {
  const products = await getAllProducts();
  const homeContent = await getHomeContent();
  const banners = await getHomeBanners();
  const { brand } = await brandMetadata();
  const categoryContent = await getCategoryContent();
  const categoryDefinitions = categoryContent.map((category) => ({
    slug: category.slug,
    name: category.name,
  }));
  const categoryGroups = getCategoryGroups(products, categoryDefinitions);
  const categorySettingsBySlug = new Map(categoryContent.map((category) => [category.slug, category]));
  const wheelProducts = homeContent
    ? getWheelProducts(products, homeContent.wheelProductsPerCategory, categoryDefinitions)
    : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
      {banners.length === 0 && brand ? <h1 className="sr-only">{brand}</h1> : null}
      {banners.length > 0 ? (
        <HomeBanners
          banners={banners}
          logoImage={homeContent?.logoImage ?? ""}
          logoImageAlt={homeContent?.logoImageAlt ?? ""}
        />
      ) : null}

      {homeContent ? (
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{homeContent.wheelTitle}</h2>
            <Button nativeButton={false} variant="link" render={<CmsLink href={homeContent.wheelCtaHref} />}>
              {homeContent.wheelCtaLabel}
            </Button>
          </div>
          <ProductWheel products={wheelProducts} />
        </section>
      ) : null}

      <div className="mt-12 space-y-12">
        {categoryGroups.map((group) => {
          const categorySettings = categorySettingsBySlug.get(group.slug);
          if (!categorySettings) {
            return null;
          }

          return (
            <section key={group.slug} id={`category-${group.slug}`} className="scroll-mt-32">
              <div className="mb-5 flex items-end justify-between gap-3">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{group.name}</h2>
                <Button
                  nativeButton={false}
                  variant="link"
                  render={<Link href={`/all-products?category=${group.slug}` as Route} />}
                >
                  See all
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {group.products.slice(0, categorySettings.homepageDesktopCount).map((product, index) => (
                  <div
                    key={product.slug}
                    className={index >= categorySettings.homepageMobileCount ? "hidden md:block" : "block"}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
