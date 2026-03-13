import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, decodeSessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = decodeSessionCookie(cookieValue);

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: session.user,
    },
    { status: 200 }
  );
}
