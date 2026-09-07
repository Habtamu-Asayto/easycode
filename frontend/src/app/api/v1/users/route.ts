import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/users — List users (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/users", req);
}

/** POST /api/v1/users — Create a user */
export async function POST(req: NextRequest) {
  return proxyToBackend("/users", req);
}
