"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import ProductCard from "@/components/catalog/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { productGridItemVariants } from "@/lib/motion";
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
            <motion.div
              variants={productGridItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
