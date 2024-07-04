import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest, ) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);
  
  
  requestHeaders.set("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  requestHeaders.set("Access-Control-Allow-Credentials", "true");
  requestHeaders.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  

  return NextResponse.next();
}
