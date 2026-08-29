import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAboutContent } from "@/lib/content/site";
import { SettingsForm } from "../_components/settings-form";

export default async function AboutSettingsPage() {
  const about = await getAboutContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm id="about" data={{ title: about?.title ?? "" }} body={about?.body ?? ""} showBody />
      </CardContent>
    </Card>
  );
}
