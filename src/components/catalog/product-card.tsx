import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/catalog/types";

function splitProductName(name: string) {
  const match = name.match(/^(CI-[A-Z0-9-]+)\s+(.+)$/i);
  if (!match) {
    return { model: null, title: name };
  }
  return { model: match[1].toUpperCase(), title: match[2] };
}

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const { model, title } = splitProductName(product.name);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block h-full rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="h-full gap-0 py-0 shadow-none ring-foreground/8 transition-[box-shadow] group-hover:shadow-md group-hover:ring-foreground/15">
        <AspectRatio ratio={1} className="overflow-hidden bg-muted">
          {image ? (
            <Image
              suppressHydrationWarning
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-8 opacity-40" aria-hidden />
            </div>
          )}
        </AspectRatio>
        <CardContent className="flex flex-1 flex-col gap-1.5 py-3.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{product.category}</p>
          {model ? (
            <p className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground">{model}</p>
          ) : null}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight md:text-[15px]">{title}</h3>
          <p className="mt-auto pt-1 text-sm font-semibold tabular-nums tracking-tight">{product.priceRange}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
