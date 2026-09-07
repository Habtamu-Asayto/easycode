import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/crop-categories — List (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/crop-categories", req);
}

/** POST /api/v1/crop-categories — Create */
export async function POST(req: NextRequest) {
  return proxyToBackend("/crop-categories", req);
}
