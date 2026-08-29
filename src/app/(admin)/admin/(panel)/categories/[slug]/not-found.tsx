import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCategoryNotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category not found</CardTitle>
      </CardHeader>
      <CardContent>
        <Button nativeButton={false} render={<Link href={"/admin/categories" as Route} />}>
          Back to categories
        </Button>
      </CardContent>
    </Card>
  );
}
