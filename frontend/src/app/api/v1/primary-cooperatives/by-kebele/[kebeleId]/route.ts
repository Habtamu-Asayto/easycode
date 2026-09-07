import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ kebeleId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { kebeleId } = await params;
  return proxyToBackend(`/primary-cooperatives/by-kebele/${kebeleId}`, req);
}
