import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBannerNotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Banner not found</CardTitle>
      </CardHeader>
      <CardContent>
        <Button nativeButton={false} render={<Link href={"/admin/banners" as Route} />}>
          Back to banners
        </Button>
      </CardContent>
    </Card>
  );
}
