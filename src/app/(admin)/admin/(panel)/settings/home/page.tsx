import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHomeContent } from "@/lib/content/site";
import { SettingsForm } from "../_components/settings-form";

export default async function HomeSettingsPage() {
  const data = await getHomeContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Home</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm id="home" data={data ?? {}} />
      </CardContent>
    </Card>
  );
}
