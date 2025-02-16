import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const validRoutes = [
  "/",
  "/layout",
  "/layout/capture",
  "/layout/capture/select",
  "/layout/capture/select/filter",
  "/layout/capture/select/filter/review",
];

const staticFileExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico", ".css", ".js", ".json", ".woff", ".woff2", ".ttf", ".eot"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api") || staticFileExtensions.some((ext) => path.toLowerCase().endsWith(ext))) {
    return NextResponse.next();
  }

  if (!validRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
