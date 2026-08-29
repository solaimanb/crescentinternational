import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog/types";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xs border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {image ? (
        <Image
          suppressHydrationWarning
          src={image}
          alt={product.name}
          width={520}
          height={520}
          className="aspect-square w-full rounded-xs bg-slate-100 object-cover"
        />
      ) : (
        <div className="aspect-square w-full rounded-xs bg-slate-100" />
      )}
      <div className="pt-3">
        <h3 className="text-sm font-semibold text-slate-900 md:text-base">{product.name}</h3>
        <p className="mt-1 text-sm font-medium text-cyan-700">{product.priceRange}</p>
      </div>
    </Link>
  );
}
