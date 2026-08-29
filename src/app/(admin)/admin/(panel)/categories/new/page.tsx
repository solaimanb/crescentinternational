import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "../_components/category-form";

export default function NewCategoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New category</CardTitle>
      </CardHeader>
      <CardContent>
        <CategoryForm />
      </CardContent>
    </Card>
  );
}
