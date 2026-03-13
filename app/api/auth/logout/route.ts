import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, sameOrigin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request.headers.get("origin"), request.url)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
