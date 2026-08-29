import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BannerForm } from "../_components/banner-form";

export default function NewBannerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New banner</CardTitle>
      </CardHeader>
      <CardContent>
        <BannerForm />
      </CardContent>
    </Card>
  );
}
