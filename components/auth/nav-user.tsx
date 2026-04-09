"use client";

import axios from "axios";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SessionResponse = {
  authenticated: boolean;
  user: {
    id: number;
    name: string;
    email?: string;
    username?: string;
  } | null;
};

export function NavUser() {
  const locale = useLocale();
  const t = useTranslations("Auth");
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionResponse | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const response = await axios.get<SessionResponse>("/api/auth/session", {
          headers: {
            "Cache-Control": "no-store",
          },
        });

        if (mounted) {
          setSession(response.data);
        }
      } catch {
        if (mounted) {
          setSession({ authenticated: false, user: null });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch {
    }

    setSession({ authenticated: false, user: null });
    router.push(`/${locale}/login`);
    router.refresh();
  };

  const nextPath = pathname || `/${locale}`;
  const loginHref = `/${locale}/login?next=${encodeURIComponent(nextPath)}`;
  const registerHref = `/${locale}/register`;
  const userIcon = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );

  if (loading) {
    return (
      <div className="inline-flex size-9 items-center justify-center rounded-md border" aria-hidden="true">
        {userIcon}
      </div>
    );
  }

  if (!session?.authenticated || !session.user) {
    return (
      <div className="group relative">
        <Link
          href={loginHref}
          aria-label={t("login")}
          className="inline-flex size-9 items-center justify-center rounded-md border transition hover:bg-muted/40"
        >
          {userIcon}
        </Link>

        <div className="invisible absolute right-0 top-full z-20 mt-2 w-44 rounded-md border border-input bg-background p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="px-2 pb-2 text-xs text-muted-foreground">
            {t("login")} / {t("register")}
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href={loginHref}
              className="rounded-sm px-2 py-2 text-sm hover:bg-muted"
            >
              {t("login")}
            </Link>
            <Link
              href={registerHref}
              className="rounded-sm px-2 py-2 text-sm hover:bg-muted"
            >
              {t("register")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={session.user.name}
        className="inline-flex size-9 items-center justify-center rounded-md border transition hover:bg-muted/40"
      >
        {userIcon}
      </button>

      <div className="invisible absolute right-0 top-full z-20 mt-2 w-52 rounded-md border border-input bg-background p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="border-b border-border px-2 pb-2">
          <div className="truncate text-sm font-medium">{session.user.name}</div>
          {session.user.email ? (
            <div className="truncate text-xs text-muted-foreground">{session.user.email}</div>
          ) : null}
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-sm px-2 py-2 text-left text-sm hover:bg-muted"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
