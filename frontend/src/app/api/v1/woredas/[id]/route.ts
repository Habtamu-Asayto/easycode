import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

type Params = { params: Promise<{ id: string }> };

/** GET /api/v1/woredas/:id */
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(`/woredas/${id}`, req);
}

/** PUT /api/v1/woredas/:id */
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(`/woredas/${id}`, req);
}

/** DELETE /api/v1/woredas/:id */
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(`/woredas/${id}`, req);
}
