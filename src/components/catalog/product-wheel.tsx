"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/lib/catalog/types";

export default function ProductWheel({ products = [] }: { products?: Product[] }) {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }));

  if (products.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{ align: "start", loop: products.length > 1 }}
      plugins={products.length > 1 ? [autoplay.current] : undefined}
      className="w-full px-12"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.slug} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
            <Link href={`/products/${product.slug}`} className="block">
              <Card className="gap-0 overflow-hidden rounded-xs py-0">
                <AspectRatio ratio={1} className="bg-muted">
                  {product.images[0] ? (
                    <Image
                      suppressHydrationWarning
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : null}
                </AspectRatio>
                <CardContent className="py-3">
                  <CardTitle className="text-sm">{product.name}</CardTitle>
                  <p className="mt-1 text-xs text-primary">{product.priceRange}</p>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
