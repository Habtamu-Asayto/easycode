import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/permissions/active — Get all active permissions */
export async function GET(req: NextRequest) {
  return proxyToBackend("/permissions/active", req);
}
