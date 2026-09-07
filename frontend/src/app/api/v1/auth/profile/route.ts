import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/auth/profile — Get current user profile */
export async function GET(req: NextRequest) {
  return proxyToBackend("/auth/profile", req);
}
