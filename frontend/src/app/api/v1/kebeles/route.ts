import { NextRequest } from "next/server";
import { proxyToBackend } from "../_lib/bff";

/** GET /api/v1/kebeles — List kebeles (paginated) */
export async function GET(req: NextRequest) {
  return proxyToBackend("/kebeles", req);
}

/** POST /api/v1/kebeles — Create a kebele */
export async function POST(req: NextRequest) {
  return proxyToBackend("/kebeles", req);
}
