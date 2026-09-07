import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/regions — List regions (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/regions", req);
}

/** POST /api/v1/regions — Create a region */
export async function POST(req: NextRequest) {
  return proxyToBackend("/regions", req);
}
