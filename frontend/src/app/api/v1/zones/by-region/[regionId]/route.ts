import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ regionId: string }> };

/** GET /api/v1/zones/by-region/:regionId */
export async function GET(req: NextRequest, { params }: Params) {
  const { regionId } = await params;
  return proxyToBackend(`/zones/by-region/${regionId}`, req);
}
