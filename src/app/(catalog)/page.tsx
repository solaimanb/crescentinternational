import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import ProductCard from "@/components/catalog/product-card";
import ProductWheel from "@/components/catalog/product-wheel";
import CmsLink from "@/components/layout/cms-link";
import { getAllProducts } from "@/lib/catalog/products";
import { getCategoryGroups, getWheelProducts } from "@/lib/catalog/groups";
import { getCategoryContent, getHomeContent } from "@/lib/content/site";

export default async function HomePage() {
  const products = await getAllProducts();
  const homeContent = await getHomeContent();
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
      {homeContent ? (
        <section className="relative isolate overflow-hidden rounded-xs border border-slate-200 bg-slate-900 shadow-xl">
          {homeContent.bannerImage ? (
            <Image
              suppressHydrationWarning
              src={homeContent.bannerImage}
              alt={homeContent.bannerImageAlt}
              width={1600}
              height={700}
              priority
              className="h-[300px] w-full object-cover md:h-[420px]"
            />
          ) : (
            <div className="h-[300px] w-full bg-slate-800 md:h-[420px]" />
          )}
          <div className="absolute inset-0 bg-slate-950/45" />
          <div className="absolute inset-0 flex flex-col justify-center gap-4 p-6 text-white md:p-12">
            {homeContent.logoImage ? (
              <Image
                suppressHydrationWarning
                src={homeContent.logoImage}
                alt={homeContent.logoImageAlt}
                width={320}
                height={120}
                className="h-auto w-48 md:w-72"
              />
            ) : null}
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">{homeContent.bannerTitle}</h1>
            <p className="max-w-xl text-sm text-slate-100 md:text-base">{homeContent.bannerSubtitle}</p>
          </div>
        </section>
      ) : null}

      {homeContent ? (
        <section className="mt-10 rounded-xs border border-slate-200 bg-white p-4 shadow-lg md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{homeContent.wheelTitle}</h2>
            <CmsLink
              href={homeContent.wheelCtaHref}
              className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-900"
            >
              {homeContent.wheelCtaLabel}
            </CmsLink>
          </div>
          <div className="catalog-marquee">
            <ProductWheel products={wheelProducts} />
          </div>
        </section>
      ) : null}

      <section className="mt-12 space-y-10">
        {categoryGroups.map((group) => {
          const categorySettings = categorySettingsBySlug.get(group.slug);
          if (!categorySettings) {
            return null;
          }

          return (
            <section key={group.slug} id={`category-${group.slug}`} className="scroll-mt-32">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{group.name}</h2>
                <Link
                  href={`/all-products?category=${group.slug}` as Route}
                  className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  See all
                </Link>
              </div>

              {categorySettings.description ? (
                <p className="mb-5 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
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
            </section>
          );
        })}
      </section>
    </div>
  );
}
