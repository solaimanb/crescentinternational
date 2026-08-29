import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Button nativeButton={false} variant="link" render={<Link href="/" />}>
          Back to Home
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {product.images.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.images.map((imageSrc, index) => (
                <AspectRatio key={`${product.slug}-${imageSrc}-${index}`} ratio={1} className="overflow-hidden rounded-lg bg-muted">
                  <Image
                    suppressHydrationWarning
                    src={imageSrc}
                    alt={`${product.name} ${index + 1}`}
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
