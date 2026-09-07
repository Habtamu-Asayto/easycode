import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/fertilizer-types — List (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/fertilizer-types", req);
}

/** POST /api/v1/fertilizer-types — Create */
export async function POST(req: NextRequest) {
  return proxyToBackend("/fertilizer-types", req);
}
