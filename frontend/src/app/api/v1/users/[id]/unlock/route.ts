import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/v1/users/:id/unlock */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(`/users/${id}/unlock`, req);
}
