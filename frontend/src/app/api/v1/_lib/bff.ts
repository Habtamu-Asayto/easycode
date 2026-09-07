import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/infrastructure/rbac/auth/auth.config";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

/**
 * Normalize paginated responses from backend format to frontend format.
 *
 * Backend returns:  { success, data: { items: T[], meta }, message, timestamp }
 * Frontend expects: { success, data: T[], meta, message, timestamp }
 */
export function normalizeResponse(
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

/**
 * Build authorization headers from the current NextAuth session.
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await auth();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (session?.user?.accessToken) {
    headers["Authorization"] = `Bearer ${session.user.accessToken}`;
  }
  return headers;
}

/**
 * Proxy a request to the NestJS backend.
 *
 * @param backendPath  – e.g. "/users" or "/roles/abc-123"
 * @param req          – the incoming Next.js request
 * @param options      – optional overrides
 */
export async function proxyToBackend(
  backendPath: string,
  req: NextRequest,
  options?: {
    /** Override the HTTP method */
    method?: string;
    /** Override the request body */
    body?: string | null;
    /** Whether to skip response normalization (default: false) */
    raw?: boolean;
  },
): Promise<NextResponse> {
  const url = new URL(req.url);
  const targetUrl = `${BACKEND_URL}${backendPath}${url.search}`;
  const method = options?.method ?? req.method;

  const headers = await getAuthHeaders();

  try {
    let body: string | undefined;
    if (options?.body !== undefined) {
      body = options.body ?? undefined;
    } else if (method !== "GET" && method !== "HEAD") {
      body = await req.text();
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body || undefined,
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    const normalized = options?.raw ? data : normalizeResponse(data);

    return NextResponse.json(normalized, { status: response.status });
  } catch (error) {
    console.error(`[BFF] Proxy error → ${method} ${targetUrl}:`, error);
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
