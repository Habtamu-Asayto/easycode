import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/roles — List roles (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/roles", req);
}

/** POST /api/v1/roles — Create a role */
export async function POST(req: NextRequest) {
  return proxyToBackend("/roles", req);
}
