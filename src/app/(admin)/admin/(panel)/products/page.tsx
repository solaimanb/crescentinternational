import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllProducts } from "@/lib/catalog/products";
import { AdminDeleteButton } from "@/app/(admin)/admin/_components/admin-delete-button";
import { deleteProductAction } from "@/app/(admin)/admin/(panel)/actions";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Button nativeButton={false} render={<Link href={"/admin/products/new" as Route} />}>
          New product
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item) => (
                <TableRow key={item.slug}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.priceRange}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        nativeButton={false}
                        size="sm"
                        variant="outline"
                        render={<Link href={`/admin/products/${item.slug}` as Route} />}
                      >
                        Edit
                      </Button>
                      <AdminDeleteButton
                        action={deleteProductAction}
                        fieldName="slug"
                        fieldValue={item.slug}
                        title={`Delete ${item.name}?`}
                        description="This removes the product from the catalogue."
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
