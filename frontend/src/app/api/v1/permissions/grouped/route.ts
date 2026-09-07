import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/permissions/grouped — Get permissions grouped by module */
export async function GET(req: NextRequest) {
  return proxyToBackend("/permissions/grouped", req);
}
