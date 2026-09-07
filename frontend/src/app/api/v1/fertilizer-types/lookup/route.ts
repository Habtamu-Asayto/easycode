import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/fertilizer-types/lookup */
export async function GET(req: NextRequest) {
  return proxyToBackend("/fertilizer-types/lookup", req);
}
