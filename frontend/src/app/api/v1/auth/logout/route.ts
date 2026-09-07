import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** POST /api/v1/auth/logout */
export async function POST(req: NextRequest) {
  return proxyToBackend("/auth/logout", req);
}
