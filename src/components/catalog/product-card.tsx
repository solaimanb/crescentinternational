import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/catalog/types";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
        <AspectRatio ratio={1} className="bg-muted">
          {image ? (
            <Image
              suppressHydrationWarning
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : null}
        </AspectRatio>
        <CardContent className="py-3">
          <CardTitle className="text-sm">{product.name}</CardTitle>
          <p className="mt-1 text-sm text-primary">{product.priceRange}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
