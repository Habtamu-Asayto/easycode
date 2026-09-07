import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/crop-categories/lookup */
export async function GET(req: NextRequest) {
  return proxyToBackend("/crop-categories/lookup", req);
}
