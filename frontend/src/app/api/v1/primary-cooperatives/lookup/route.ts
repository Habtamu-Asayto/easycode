import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/primary-cooperatives/lookup */
export async function GET(req: NextRequest) {
  return proxyToBackend("/primary-cooperatives/lookup", req);
}
