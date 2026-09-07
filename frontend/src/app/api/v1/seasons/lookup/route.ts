import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/seasons/lookup */
export async function GET(req: NextRequest) {
  return proxyToBackend("/seasons/lookup", req);
}
