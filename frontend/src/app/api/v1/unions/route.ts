import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/unions — List (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/unions", req);
}

/** POST /api/v1/unions — Create */
export async function POST(req: NextRequest) {
  return proxyToBackend("/unions", req);
}
