import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProductNotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product not found</CardTitle>
      </CardHeader>
      <CardContent>
        <Button nativeButton={false} render={<Link href={"/admin/products" as Route} />}>
          Back to products
        </Button>
      </CardContent>
    </Card>
  );
}
