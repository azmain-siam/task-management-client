import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH = "/admin";
const USER_PATH = "/user";
const LOGIN_PATH = "/login";
const ADMIN_HOME = "/admin/tasks";
const USER_HOME = "/user/tasks";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("task_mgmt_token")?.value;
  const role = request.cookies.get("task_mgmt_role")?.value;

  const isAdminRoute = pathname.startsWith(ADMIN_PATH);
  const isUserRoute = pathname.startsWith(USER_PATH);
  const isLoginRoute = pathname === LOGIN_PATH;
  const isProtectedRoute = isAdminRoute || isUserRoute;

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (token && isLoginRoute) {
    const destination = role === "ADMIN" ? ADMIN_HOME : USER_HOME;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (token && role === "USER" && isAdminRoute) {
    return NextResponse.redirect(new URL(USER_HOME, request.url));
  }

  if (token && role === "ADMIN" && isUserRoute) {
    return NextResponse.redirect(new URL(ADMIN_HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*", "/user/:path*"],
};
