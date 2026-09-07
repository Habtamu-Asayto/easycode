import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

/** GET /api/v1/budget-years/lookup */
export async function GET(req: NextRequest) {
  return proxyToBackend("/budget-years/lookup", req);
}
