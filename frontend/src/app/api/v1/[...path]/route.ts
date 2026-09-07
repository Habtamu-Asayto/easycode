import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/infrastructure/rbac/auth/auth.config";

/**
 * BFF (Backend For Frontend) Proxy
 *
 * All frontend API calls are routed through these Next.js API routes.
 * The browser never communicates directly with the NestJS backend.
 *
 * Flow: Browser → /api/v1/* → Next.js Route Handler → NestJS Backend
 */
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

/**
 * Normalize paginated responses from backend format to frontend format.
 *
 * Backend returns:  { success, data: { items: T[], meta }, message, timestamp }
 * Frontend expects: { success, data: T[], meta, message, timestamp }
 */
function normalizeResponse(
  body: Record<string, unknown>,
): Record<string, unknown> {
  if (
    body?.success &&
    body?.data &&
    typeof body.data === "object" &&
    !Array.isArray(body.data)
  ) {
    const data = body.data as Record<string, unknown>;
    if (Array.isArray(data.items) && data.meta) {
      const meta = data.meta as Record<string, unknown>;
      return {
        success: body.success,
        message: body.message,
        data: data.items,
        meta: {
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages: meta.totalPages,
          hasNextPage: meta.hasNext ?? false,
          hasPrevPage: meta.hasPrevious ?? false,
        },
        timestamp: body.timestamp,
      };
    }
  }
  return body;
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const session = await auth();
  const pathStr = path.join("/");
  const url = new URL(req.url);
  const targetUrl = `${BACKEND_URL}/${pathStr}${url.search}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (session?.user?.accessToken) {
    headers["Authorization"] = `Bearer ${session.user.accessToken}`;
  }

  try {
    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body || undefined,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    const normalized = normalizeResponse(data);

    return NextResponse.json(normalized, { status: response.status });
  } catch (error) {
    console.error("[BFF] Proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Backend service unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
