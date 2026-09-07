import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/crop-types/lookup */
export async function GET(req: NextRequest) {
  return proxyToBackend("/crop-types/lookup", req);
}
