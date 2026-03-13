import { Buffer } from "node:buffer";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { sameOrigin } from "@/lib/auth";

type RegisterBody = {
  username?: string;
  email?: string;
  password?: string;
};

function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request.headers.get("origin"), request.url)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limitResult = checkRateLimit(`auth:register:${ip}`, 5, 15 * 60 * 1000);

  if (!limitResult.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limitResult.retryAfterSeconds),
        },
      }
    );
  }

  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const username = body.username?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Username, email, and password are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");
  const adminUsername = process.env.WP_ADMIN_USERNAME;
  const adminAppPassword = process.env.WP_ADMIN_APP_PASSWORD;

  if (!baseUrl) {
    return NextResponse.json({ error: "WordPress URL is not configured." }, { status: 500 });
  }

  if (!adminUsername || !adminAppPassword) {
    return NextResponse.json(
      { error: "Registration is not enabled yet. Configure WP admin app password env vars." },
      { status: 503 }
    );
  }

  const authHeader = `Basic ${Buffer.from(`${adminUsername}:${adminAppPassword}`).toString("base64")}`;

  const wpResponse = await axios.post(
    `${baseUrl}/wp-json/wp/v2/users`,
    {
      username,
      email,
      password,
      roles: ["customer"],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      validateStatus: () => true,
    }
  );

  if (wpResponse.status < 200 || wpResponse.status >= 300) {
    return NextResponse.json({ error: "Unable to create account." }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
