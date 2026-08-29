import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHomeBannerById } from "@/lib/content/site";
import { BannerForm } from "../_components/banner-form";

export default async function EditBannerPage({ params }: PageProps<"/admin/banners/[id]">) {
  const { id } = await params;
  const banner = await getHomeBannerById(id);

  if (!banner) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{banner.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BannerForm banner={banner} />
      </CardContent>
    </Card>
  );
}
