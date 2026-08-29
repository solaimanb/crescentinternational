import {
  getAboutContent,
  getContactContent,
  getFooterContent,
  getHomeContent,
  getTermsContent,
} from "@/lib/content/site";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const [home, contact, footer, about, terms] = await Promise.all([
    getHomeContent(),
    getContactContent(),
    getFooterContent(),
    getAboutContent(),
    getTermsContent(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsForm home={home} contact={contact} footer={footer} about={about} terms={terms} />
    </div>
  );
}
