import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/catalog/products";
import { getContactContent, getFooterContent } from "@/lib/content/site";
import ProductContactActions from "@/components/contact/product-contact-actions";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const footer = await getFooterContent();
  const brand = footer?.brandName ?? "";

  if (!product) {
    return {
      title: brand,
      robots: { index: false, follow: false },
    };
  }

  return {
    title: brand ? `${product.name} | ${brand}` : product.name,
    description: product.shortDescription,
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((item) => ({ slug: item.slug }));
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const contactContent = await getContactContent();

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-6">
        <Link href="/" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
          Back to Home
        </Link>
      </div>

      <section className="rounded-xs border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {product.images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.images.map((imageSrc, index) => (
              <div key={`${product.slug}-${imageSrc}-${index}`} className="overflow-hidden rounded-xs">
                <Image
                  suppressHydrationWarning
                  src={imageSrc}
                  alt={`${product.name} ${index + 1}`}
                  width={900}
                  height={900}
                  className="aspect-square w-full rounded-xs bg-slate-100 object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
        <h1 className="mt-5 text-2xl font-bold text-slate-900 md:text-4xl">{product.name}</h1>
        <p className="mt-2 text-base font-semibold text-cyan-700 md:text-lg">{product.priceRange}</p>
        <p className="mt-3 text-sm text-slate-600">{product.shortDescription}</p>
        {product.seoHashtags.length > 0 ? (
          <p className="mt-3 text-xs font-semibold text-cyan-700">
            {product.seoHashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        ) : null}
      </section>

      {contactContent ? (
        <section className="mt-8 rounded-xs border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <ProductContactActions
            contactContent={contactContent}
            productContact={{
              whatsappHref: product.contactWhatsapp,
              phoneValue: product.contactPhone,
              emailValue: product.contactEmail,
            }}
          />
        </section>
      ) : null}

      <section className="mt-8 rounded-xs border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="text-xl font-bold text-slate-900">Description</h3>
        <p className="mt-3 leading-7 text-slate-700">{product.description}</p>
      </section>
    </div>
  );
}
