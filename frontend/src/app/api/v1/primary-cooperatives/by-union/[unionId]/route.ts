import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ unionId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { unionId } = await params;
  return proxyToBackend(`/primary-cooperatives/by-union/${unionId}`, req);
}
