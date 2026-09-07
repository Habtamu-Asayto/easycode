import { NextRequest } from "next/server";
import { proxyToBackend } from "../../_lib/bff";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(`/fertilizer-types/${id}`, req);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(`/fertilizer-types/${id}`, req);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(`/fertilizer-types/${id}`, req);
}
