import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllCategories } from "@/lib/catalog/categories";
import { AdminDeleteButton } from "@/app/(admin)/admin/_components/admin-delete-button";
import { deleteCategoryAction } from "@/app/(admin)/admin/(panel)/actions";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <Button nativeButton={false} render={<Link href={"/admin/categories/new" as Route} />}>
          New category
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item) => (
                <TableRow key={item.slug}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell>{item.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        nativeButton={false}
                        size="sm"
                        variant="outline"
                        render={<Link href={`/admin/categories/${item.slug}` as Route} />}
                      >
                        Edit
                      </Button>
                      <AdminDeleteButton
                        action={deleteCategoryAction}
                        fieldName="slug"
                        fieldValue={item.slug}
                        title={`Delete ${item.name}?`}
                        description="This removes the category from the catalogue."
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
