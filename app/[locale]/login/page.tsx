"use client";

import axios from "axios";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginResponse = {
  ok?: boolean;
  nextPath?: string;
  error?: string;
};

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next") ?? `/${locale}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        "/api/auth/login",
        {
          username,
          password,
          next: nextPath,
          locale,
        },
        {
          validateStatus: () => true,
        }
      );

      const data = response.data;

      if (response.status >= 400 || !data.ok) {
        setError(data.error ?? t("loginFailed"));
        return;
      }

      router.push(data.nextPath ?? `/${locale}`);
      router.refresh();
    } catch {
      setError(t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("loginTitle")}</h1>
        <p className="text-muted-foreground">{t("loginDescription")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
        <div className="space-y-1">
          <label htmlFor="username" className="text-sm font-medium">
            {t("username")}
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {loading ? t("loggingIn") : t("login")}
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        {t("noAccount")} {" "}
        <Link href={`/${locale}/register`} className="text-foreground underline underline-offset-4">
          {t("register")}
        </Link>
      </p>
    </main>
  );
}
