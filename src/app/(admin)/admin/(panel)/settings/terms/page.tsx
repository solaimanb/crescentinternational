import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTermsContent } from "@/lib/content/site";
import { SettingsForm } from "../_components/settings-form";

export default async function TermsSettingsPage() {
  const terms = await getTermsContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm id="terms" data={{ title: terms?.title ?? "" }} body={terms?.body ?? ""} showBody />
      </CardContent>
    </Card>
  );
}
