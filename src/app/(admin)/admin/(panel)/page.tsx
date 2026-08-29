import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllProducts } from "@/lib/catalog/products";
import { getAllCategories } from "@/lib/catalog/categories";

export default async function AdminOverviewPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>{categories.length} catalogues</CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href={"/admin/categories" as Route} />}>
              Open categories
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>{products.length} in the catalogue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href={"/admin/products" as Route} />}>
              Open products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
