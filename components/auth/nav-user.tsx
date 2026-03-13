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

  if (loading) {
    return (
      <div className="inline-flex size-9 items-center justify-center rounded-md border" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      </div>
    );
  }

  if (!session?.authenticated || !session.user) {
    return (
      <Link
        href={`/${locale}/login`}
        aria-label={t("login")}
        className="inline-flex size-9 items-center justify-center rounded-md border"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-28 truncate text-sm text-muted-foreground sm:inline">
        {session.user.name}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex h-9 items-center rounded-md border px-3 text-sm"
      >
        {t("logout")}
      </button>
    </div>
  );
}
