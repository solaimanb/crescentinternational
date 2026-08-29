import { getOverviewMatrix } from "@/lib/admin/overview-matrix";
import { getAdminSession } from "@/lib/require-admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(await getOverviewMatrix());
}
