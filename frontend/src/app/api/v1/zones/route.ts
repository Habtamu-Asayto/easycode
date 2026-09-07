import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/zones — List zones (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/zones", req);
}

/** POST /api/v1/zones — Create a zone */
export async function POST(req: NextRequest) {
  return proxyToBackend("/zones", req);
}
