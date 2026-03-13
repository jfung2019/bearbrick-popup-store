import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_TTL_SECONDS,
  createSessionFromWordPressResponse,
  encodeSessionCookie,
  getSafeNextPath,
  sameOrigin,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

type LoginBody = {
  username?: string;
  password?: string;
  next?: string;
  locale?: string;
};

type WordPressJwtResponse = {
  token: string;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
};

type WordPressMeResponse = {
  roles?: unknown;
};

function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function getAllowedRoles() {
  const configured = process.env.AUTH_ALLOWED_ROLES;
  const roles = (configured ?? "customer")
    .split(",")
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean);

  return roles.length > 0 ? roles : ["customer"];
}

async function getUserRoles(baseUrl: string, token: string) {
  const meResponse = await axios.get<WordPressMeResponse>(`${baseUrl}/wp-json/wp/v2/users/me?context=edit`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true,
  });

  if (meResponse.status < 200 || meResponse.status >= 300) {
    return null;
  }

  const meData = meResponse.data;
  if (!Array.isArray(meData.roles)) {
    return null;
  }

  return meData.roles
    .filter((role): role is string => typeof role === "string")
    .map((role) => role.toLowerCase());
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request.headers.get("origin"), request.url)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limitResult = checkRateLimit(`auth:login:${ip}`, 8, 15 * 60 * 1000);

  if (!limitResult.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limitResult.retryAfterSeconds),
        },
      }
    );
  }

  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const username = body.username?.trim();
  const password = body.password;
  const locale = body.locale ?? "en";
  const nextPath = getSafeNextPath(body.next, locale);

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json({ error: "WordPress URL is not configured." }, { status: 500 });
  }

  const wpResponse = await axios.post<WordPressJwtResponse>(
    `${baseUrl}/wp-json/jwt-auth/v1/token`,
    { username, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    }
  );

  if (wpResponse.status < 200 || wpResponse.status >= 300) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const wpData = wpResponse.data;

  if (!wpData.token) {
    return NextResponse.json({ error: "Authentication failed." }, { status: 502 });
  }

  const allowedRoles = getAllowedRoles();
  const userRoles = await getUserRoles(baseUrl, wpData.token);

  if (!userRoles || !userRoles.some((role) => allowedRoles.includes(role))) {
    return NextResponse.json({ error: "This account type is not allowed to sign in." }, { status: 403 });
  }

  const session = createSessionFromWordPressResponse(wpData);
  const cookieValue = encodeSessionCookie(session);
  const now = Math.floor(Date.now() / 1000);
  const cookieMaxAge = Math.max(1, Math.min(AUTH_TTL_SECONDS, session.exp - now));

  const response = NextResponse.json(
    {
      ok: true,
      user: session.user,
      nextPath,
    },
    { status: 200 }
  );

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: cookieValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookieMaxAge,
  });

  return response;
}
