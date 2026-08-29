import Link from "next/link";
import type { Metadata } from "next";
import type { Route } from "next";
import HomeBanners from "@/components/catalog/home-banners";
import ProductCard from "@/components/catalog/product-card";
import ProductWheel from "@/components/catalog/product-wheel";
import CmsLink from "@/components/layout/cms-link";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card className="mt-10">
          <CardHeader className="border-b">
            <CardTitle>
              <h2 className="font-heading text-base font-medium leading-snug">{homeContent.wheelTitle}</h2>
            </CardTitle>
            <CardAction>
              <Button nativeButton={false} variant="link" render={<CmsLink href={homeContent.wheelCtaHref} />}>
                {homeContent.wheelCtaLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-4">
            <ProductWheel products={wheelProducts} />
          </CardContent>
        </Card>
      ) : null}

      <section className="mt-12 space-y-10">
        {categoryGroups.map((group) => {
          const categorySettings = categorySettingsBySlug.get(group.slug);
          if (!categorySettings) {
            return null;
          }

          return (
            <section key={group.slug} id={`category-${group.slug}`} className="scroll-mt-32">
              <Card className="rounded-xs">
                <CardHeader className="border-b">
                  <CardTitle>
                    <h2 className="font-heading text-base font-medium leading-snug">{group.name}</h2>
                  </CardTitle>
                  <CardAction>
                    <Button
                      nativeButton={false}
                      variant="link"
                      render={<Link href={`/all-products?category=${group.slug}` as Route} />}
                    >
                      See all
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="pt-4">
                  {categorySettings.description ? (
                    <p className="mb-5 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                      {categorySettings.description}
                    </p>
                  ) : null}

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
                </CardContent>
              </Card>
            </section>
          );
        })}
      </section>
    </div>
  );
}
