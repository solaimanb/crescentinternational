import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteSetting } from "@/lib/catalog-schema";
import { db } from "@/lib/db";
import { SettingsForm } from "./_components/settings-form";

const sections = [
  { id: "home", title: "Home", showBody: false },
  { id: "about", title: "About", showBody: true },
  { id: "contact", title: "Contact", showBody: false },
  { id: "footer", title: "Footer", showBody: false },
  { id: "terms", title: "Terms", showBody: true },
] as const;

export default async function SettingsPage() {
  const rows = await db.select().from(siteSetting);
  const byId = new Map(rows.map((row) => [row.id, row]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      {sections.map((section) => {
        const row = byId.get(section.id);
        return (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsForm
                id={section.id}
                data={row?.data ?? {}}
                body={row?.body ?? ""}
                showBody={section.showBody}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
