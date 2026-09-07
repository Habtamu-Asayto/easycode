import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../_lib/bff";

type Params = { params: Promise<{ categoryId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { categoryId } = await params;
  return proxyToBackend(`/crop-types/by-category/${categoryId}`, req);
}
