import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/woredas — List woredas (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/woredas", req);
}

/** POST /api/v1/woredas — Create a woreda */
export async function POST(req: NextRequest) {
  return proxyToBackend("/woredas", req);
}
