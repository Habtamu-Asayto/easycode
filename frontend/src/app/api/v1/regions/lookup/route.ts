import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/regions/lookup — Active regions for dropdowns */
export async function GET(req: NextRequest) {
  return proxyToBackend("/regions/lookup", req);
}
