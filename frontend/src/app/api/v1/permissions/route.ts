import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/permissions — List permissions (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/permissions", req);
}

/** POST /api/v1/permissions — Create a permission */
export async function POST(req: NextRequest) {
  return proxyToBackend("/permissions", req);
}
