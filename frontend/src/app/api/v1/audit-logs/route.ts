import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/audit-logs — List audit logs (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/audit-logs", req);
}
