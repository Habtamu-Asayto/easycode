import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ zoneId: string }> };

/** GET /api/v1/woredas/by-zone/:zoneId */
export async function GET(req: NextRequest, { params }: Params) {
  const { zoneId } = await params;
  return proxyToBackend(`/woredas/by-zone/${zoneId}`, req);
}
