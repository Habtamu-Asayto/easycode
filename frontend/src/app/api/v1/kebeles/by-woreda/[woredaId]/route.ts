import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ woredaId: string }> };

/** GET /api/v1/kebeles/by-woreda/:woredaId */
export async function GET(req: NextRequest, { params }: Params) {
  const { woredaId } = await params;
  return proxyToBackend(`/kebeles/by-woreda/${woredaId}`, req);
}
