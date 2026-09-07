import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/primary-cooperatives — List (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/primary-cooperatives", req);
}

/** POST /api/v1/primary-cooperatives — Create */
export async function POST(req: NextRequest) {
  return proxyToBackend("/primary-cooperatives", req);
}
