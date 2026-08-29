import { redirect } from "next/navigation";
import type { Route } from "next";

export default function CategoriesSettingsRedirect() {
  redirect("/admin/categories" as Route);
}
