import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Client-side guarding only: disable server middleware behavior
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // no routes matched -> effectively disabled
};