import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ id: string }> };

/** POST /api/v1/users/:id/reset-password */
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(`/users/${id}/reset-password`, req);
}
