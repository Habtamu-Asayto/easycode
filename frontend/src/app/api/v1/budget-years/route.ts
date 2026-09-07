import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/budget-years — List (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/budget-years", req);
}

/** POST /api/v1/budget-years — Create */
export async function POST(req: NextRequest) {
  return proxyToBackend("/budget-years", req);
}
