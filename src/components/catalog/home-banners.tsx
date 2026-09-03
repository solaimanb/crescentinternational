"use client";

import Image from "next/image";
import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { HomeBanner } from "@/lib/content/types";

const BANNER_RATIO = 21 / 8;

export default function HomeBanners({
  banners,
  logoImage,
  logoImageAlt,
}: {
  banners: HomeBanner[];
  logoImage: string;
  logoImageAlt: string;
}) {
  const autoplay = useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }), []);

  if (banners.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{ loop: banners.length > 1 }}
      plugins={banners.length > 1 ? [autoplay] : undefined}
      className="w-full overflow-hidden rounded-lg"
    >
      <CarouselContent className="-ml-0">
        {banners.map((banner, slide) => (
          <CarouselItem key={banner.id} className="pl-0">
            <AspectRatio ratio={BANNER_RATIO} className="overflow-hidden rounded-lg bg-muted">
              {banner.image ? (
                <Image
                  suppressHydrationWarning
                  src={banner.image}
                  alt={banner.imageAlt || banner.title}
                  fill
                  preload={slide === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-black/45" />
              <motion.div
                className="absolute inset-0 z-10 flex flex-col justify-center gap-4 p-6 text-primary-foreground md:p-12"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {logoImage ? (
                  <Image
                    suppressHydrationWarning
                    src={logoImage}
                    alt={logoImageAlt}
                    width={320}
                    height={120}
                    className="h-auto w-48 md:w-72"
                  />
                ) : null}
                {slide === 0 ? (
                  <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">{banner.title}</h1>
                ) : (
                  <p className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">{banner.title}</p>
                )}
                {banner.subtitle ? <p className="max-w-xl text-sm md:text-base">{banner.subtitle}</p> : null}
              </motion.div>
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      {banners.length > 1 ? (
        <>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </>
      ) : null}
    </Carousel>
  );
}
