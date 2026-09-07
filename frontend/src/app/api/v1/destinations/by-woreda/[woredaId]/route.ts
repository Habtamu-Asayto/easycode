import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ woredaId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { woredaId } = await params;
  return proxyToBackend(`/destinations/by-woreda/${woredaId}`, req);
}
