import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFooterContent } from "@/lib/content/site";
import { SettingsForm } from "../_components/settings-form";

export default async function FooterSettingsPage() {
  const data = await getFooterContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm id="footer" data={data ?? {}} />
      </CardContent>
    </Card>
  );
}
