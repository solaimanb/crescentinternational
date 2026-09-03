import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Product not found",
  robots: { index: false, follow: false },
};

export default function ProductNotFound() {
  return (
    <Empty className="mx-auto min-h-[40vh] w-full max-w-3xl px-4 py-16">
      <EmptyHeader>
        <EmptyTitle className="text-3xl">
          <h1>Product not found</h1>
        </EmptyTitle>
        <EmptyDescription>This product is no longer in the catalogue.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link href="/all-products" />}>
          Browse all products
        </Button>
      </EmptyContent>
    </Empty>
  );
}
