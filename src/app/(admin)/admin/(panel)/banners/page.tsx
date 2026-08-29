import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getHomeBanners } from "@/lib/content/site";

const BANNER_RATIO = 21 / 8;

export default async function AdminBannersPage() {
  const banners = await getHomeBanners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Banners</h1>
        <Button nativeButton={false} render={<Link href={"/admin/banners/new" as Route} />}>
          New banner
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Homepage banners</CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No banners</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <Button nativeButton={false} render={<Link href={"/admin/banners/new" as Route} />}>
                  New banner
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell className="w-40">
                      <AspectRatio ratio={BANNER_RATIO} className="w-36 overflow-hidden rounded-md bg-muted">
                        {banner.image ? (
                          <Image
                            src={banner.image}
                            alt={banner.imageAlt || banner.title}
                            fill
                            sizes="144px"
                            className="object-cover"
                          />
                        ) : null}
                      </AspectRatio>
                    </TableCell>
                    <TableCell>{banner.title}</TableCell>
                    <TableCell>{banner.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        nativeButton={false}
                        size="sm"
                        variant="outline"
                        render={<Link href={`/admin/banners/${banner.id}` as Route} />}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
