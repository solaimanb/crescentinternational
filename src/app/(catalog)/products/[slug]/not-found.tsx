import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Product not found</h1>
      <p className="mt-3 text-slate-600">This product is no longer in the catalogue.</p>
      <Link href="/all-products" className="mt-6 inline-block text-sm font-semibold text-cyan-700">
        Browse all products
      </Link>
    </div>
  );
}
