import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "bb_auth";
export const AUTH_TTL_SECONDS = 60 * 60 * 8;

export type AuthUser = {
  id: number;
  name: string;
  email?: string;
  username?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
  exp: number;
};

type WordPressJwtResponse = {
  token: string;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
};

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getAuthSecret() {
  return process.env.AUTH_COOKIE_SECRET ?? "dev-auth-cookie-secret-change-in-production";
}

function sign(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(parts[1]));
  } catch {
    return null;
  }
}

export function createSessionFromWordPressResponse(data: WordPressJwtResponse): AuthSession {
  const payload = parseJwtPayload(data.token);
  const now = Math.floor(Date.now() / 1000);
  const exp = typeof payload?.exp === "number" ? payload.exp : now + AUTH_TTL_SECONDS;
  const userId = typeof payload?.data === "object" && payload.data && "user" in payload.data
    ? Number((payload.data as { user?: { id?: number } }).user?.id ?? 0)
    : 0;

  return {
    token: data.token,
    exp,
    user: {
      id: Number.isFinite(userId) ? userId : 0,
      name: data.user_display_name || data.user_nicename || "User",
      email: data.user_email,
      username: data.user_nicename,
    },
  };
}

export function encodeSessionCookie(session: AuthSession) {
  const payload = toBase64Url(JSON.stringify(session));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function decodeSessionCookie(cookieValue: string | undefined): AuthSession | null {
  if (!cookieValue) {
    return null;
  }

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as AuthSession;
    if (!parsed?.token || !parsed?.user || typeof parsed.exp !== "number") {
      return null;
    }
    if (parsed.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getSafeNextPath(nextPath: string | null | undefined, locale: string) {
  if (!nextPath) {
    return `/${locale}`;
  }

  if (!nextPath.startsWith("/")) {
    return `/${locale}`;
  }

  if (nextPath.startsWith("//")) {
    return `/${locale}`;
  }

  return nextPath;
}

export function sameOrigin(requestOrigin: string | null, requestBaseUrl: string) {
  if (!requestOrigin) {
    return true;
  }

  try {
    return new URL(requestOrigin).origin === new URL(requestBaseUrl).origin;
  } catch {
    return false;
  }
}
