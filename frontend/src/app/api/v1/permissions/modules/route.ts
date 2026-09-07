import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/permissions/modules — Get distinct modules */
export async function GET(req: NextRequest) {
  return proxyToBackend("/permissions/modules", req);
}
