"use client";

import Image from "next/image";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
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
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }));

  if (banners.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{ loop: banners.length > 1 }}
      plugins={banners.length > 1 ? [autoplay.current] : undefined}
      className="w-full overflow-hidden rounded-xs"
    >
      <CarouselContent className="-ml-0">
        {banners.map((banner, slide) => (
          <CarouselItem key={banner.id} className="pl-0">
            <AspectRatio ratio={BANNER_RATIO} className="overflow-hidden rounded-xs bg-muted">
              {banner.image ? (
                <Image
                  suppressHydrationWarning
                  src={banner.image}
                  alt={banner.imageAlt || banner.title}
                  fill
                  priority={slide === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 z-10 flex flex-col justify-center gap-4 p-6 text-primary-foreground md:p-12">
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
                <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">{banner.title}</h1>
                {banner.subtitle ? <p className="max-w-xl text-sm md:text-base">{banner.subtitle}</p> : null}
              </div>
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
