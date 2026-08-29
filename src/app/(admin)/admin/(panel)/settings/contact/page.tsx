import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContactContent } from "@/lib/content/site";
import { SettingsForm } from "../_components/settings-form";

export default async function ContactSettingsPage() {
  const data = await getContactContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm id="contact" data={data ?? {}} />
      </CardContent>
    </Card>
  );
}
