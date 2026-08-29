import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOverviewMatrix } from "@/lib/admin/overview-matrix";

export default async function AdminOverviewPage() {
  const matrix = await getOverviewMatrix();

  const stats = [
    { label: "Categories", value: matrix.totals.categories, href: "/admin/categories" as Route },
    { label: "Products", value: matrix.totals.products, href: "/admin/products" as Route },
    { label: "Without images", value: matrix.totals.productsWithoutImages, href: "/admin/products" as Route },
    { label: "Banners", value: matrix.totals.banners, href: "/admin/banners" as Route },
    { label: "Settings", value: matrix.totals.settings, href: "/admin/settings" as Route },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button nativeButton={false} variant="link" render={<Link href={stat.href} />}>
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogue matrix</CardTitle>
          <CardDescription>
            {matrix.totals.productsWithImages} of {matrix.totals.products} products have images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">With images</TableHead>
                <TableHead className="text-right">Home desktop</TableHead>
                <TableHead className="text-right">Home mobile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.categories.map((row) => (
                <TableRow key={row.slug}>
                  <TableCell>
                    <Button
                      nativeButton={false}
                      variant="link"
                      render={<Link href={`/admin/categories/${row.slug}` as Route} />}
                    >
                      {row.name}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{row.products}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.withImages}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.homepageDesktopCount}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.homepageMobileCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
