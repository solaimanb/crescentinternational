import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCategories } from "@/lib/catalog/categories";
import { ProductForm } from "../_components/product-form";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <Card>
      <CardHeader>
        <CardTitle>New product</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm categories={categories} />
      </CardContent>
    </Card>
  );
}
