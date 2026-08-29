import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/catalog/products";
import { getAllCategories } from "@/lib/catalog/categories";
import { ProductForm } from "../_components/product-form";

export default async function EditProductPage({ params }: PageProps<"/admin/products/[slug]">) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([getProductBySlug(slug), getAllCategories()]);

  if (!product) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm product={product} categories={categories} />
      </CardContent>
    </Card>
  );
}
