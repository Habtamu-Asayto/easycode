import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/unions/lookup */
export async function GET(req: NextRequest) {
  return proxyToBackend("/unions/lookup", req);
}
