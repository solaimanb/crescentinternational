import Link from "next/link";
import type { Route } from "next";
import { Layers, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOverviewMatrix } from "@/lib/admin/overview-matrix";

export default async function AdminOverviewPage() {
  const matrix = await getOverviewMatrix();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Catalogue size and what each category shows on the homepage.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex size-8 items-center justify-center rounded-xs bg-muted">
              <Layers className="size-4" />
            </div>
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl tabular-nums tracking-tight">{matrix.totals.categories}</CardTitle>
            <CardAction>
              <Button nativeButton={false} size="sm" variant="outline" render={<Link href={"/admin/categories" as Route} />}>
                View
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex size-8 items-center justify-center rounded-xs bg-muted">
              <Package className="size-4" />
            </div>
            <CardDescription>Products</CardDescription>
            <CardTitle className="text-3xl tabular-nums tracking-tight">{matrix.totals.products}</CardTitle>
            <CardAction>
              <Button nativeButton={false} size="sm" variant="outline" render={<Link href={"/admin/products" as Route} />}>
                View
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>By category</CardTitle>
          <CardDescription>
            {matrix.totals.productsWithImages} of {matrix.totals.products} products have images
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {matrix.categories.length === 0 ? (
            <Empty className="py-10">
              <EmptyHeader>
                <EmptyTitle>No categories</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <Button nativeButton={false} render={<Link href={"/admin/categories/new" as Route} />}>
                  New category
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Category</TableHead>
                  <TableHead className="px-4 text-right">Products</TableHead>
                  <TableHead className="px-4 text-right">Images</TableHead>
                  <TableHead className="px-4 text-right">Home desktop</TableHead>
                  <TableHead className="px-4 text-right">Home mobile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrix.categories.map((row) => (
                  <TableRow key={row.slug}>
                    <TableCell className="px-4">
                      <Link href={`/admin/categories/${row.slug}` as Route} className="font-medium hover:underline">
                        {row.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{row.slug}</p>
                    </TableCell>
                    <TableCell className="px-4 text-right tabular-nums">{row.products}</TableCell>
                    <TableCell className="px-4 text-right tabular-nums">{row.withImages}</TableCell>
                    <TableCell className="px-4 text-right tabular-nums">{row.homepageDesktopCount}</TableCell>
                    <TableCell className="px-4 text-right tabular-nums">{row.homepageMobileCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="px-4">Total</TableCell>
                  <TableCell className="px-4 text-right tabular-nums">{matrix.totals.products}</TableCell>
                  <TableCell className="px-4 text-right tabular-nums">{matrix.totals.productsWithImages}</TableCell>
                  <TableCell className="px-4" />
                  <TableCell className="px-4" />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
