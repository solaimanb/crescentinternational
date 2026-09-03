import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd } from "@/components/seo-json-ld";
import { getProductBySlug } from "@/lib/catalog/products";
import { getContactContent } from "@/lib/content/site";
import ProductContactActions from "@/components/contact/product-contact-actions";
import { absoluteUrl, brandMetadata, openGraphImage } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const { brand } = await brandMetadata();

  if (!product) {
    return {
      title: brand,
      robots: { index: false, follow: false },
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    keywords: product.seoHashtags,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? openGraphImage(product.images[0], product.name) : undefined,
    },
    twitter: product.images[0]
      ? { card: "summary_large_image", images: [product.images[0]] }
      : undefined,
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const [contactContent, { brand }] = await Promise.all([getContactContent(), brandMetadata()]);

  if (!product) {
    notFound();
  }

  const productUrl = absoluteUrl(`/products/${product.slug}`);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.shortDescription,
          image: product.images,
          sku: product.slug,
          category: product.category,
          brand: { "@type": "Brand", name: brand },
          offers: {
            "@type": "Offer",
            description: product.priceRange,
            url: productUrl,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: brand, item: absoluteUrl("/") },
            {
              "@type": "ListItem",
              position: 2,
              name: product.category,
              item: absoluteUrl(`/all-products?category=${product.categorySlug}`),
            },
            { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
          ],
        }}
      />
      <div className="mb-6">
        <Button nativeButton={false} variant="link" render={<Link href="/" />}>
          Back to Home
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {product.images.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.images.map((imageSrc, index) => (
                <AspectRatio key={`${product.slug}-${imageSrc}-${index}`} ratio={1} className="overflow-hidden rounded-xs bg-muted">
                  <Image
                    suppressHydrationWarning
                    src={imageSrc}
                    alt={index === 0 ? product.name : `${product.name} ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </AspectRatio>
              ))}
            </div>
          ) : null}
          <h1 className="mt-5 text-2xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-base font-semibold text-primary md:text-lg">{product.priceRange}</p>
          <p className="mt-3 text-sm text-muted-foreground">{product.shortDescription}</p>
          {product.seoHashtags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.seoHashtags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {contactContent ? (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <ProductContactActions
              contactContent={contactContent}
              productContact={{
                whatsappHref: product.contactWhatsapp,
                phoneValue: product.contactPhone,
                emailValue: product.contactEmail,
                tempValue: product.contactTemp,
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-7 text-muted-foreground">{product.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
