import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/seasons — List (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/seasons", req);
}

/** POST /api/v1/seasons — Create */
export async function POST(req: NextRequest) {
  return proxyToBackend("/seasons", req);
}
