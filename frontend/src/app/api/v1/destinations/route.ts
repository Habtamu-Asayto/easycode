import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/destinations — List (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/destinations", req);
}

/** POST /api/v1/destinations — Create */
export async function POST(req: NextRequest) {
  return proxyToBackend("/destinations", req);
}
