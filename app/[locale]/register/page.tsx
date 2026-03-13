"use client";

import axios from "axios";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type RegisterResponse = {
  ok?: boolean;
  error?: string;
};

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Auth");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (isPasswordMismatch) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<RegisterResponse>(
        "/api/auth/register",
        {
          username,
          email,
          password,
        },
        {
          validateStatus: () => true,
        }
      );

      const data = response.data;

      if (response.status >= 400 || !data.ok) {
        setError(data.error ?? t("registerFailed"));
        return;
      }

      router.push(`/${locale}/login`);
      router.refresh();
    } catch {
      setError(t("registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("registerTitle")}</h1>
        <p className="text-muted-foreground">{t("registerDescription")}</p>
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
          <label htmlFor="email" className="text-sm font-medium">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            {t("confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
            className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
              isPasswordMismatch ? "border-destructive" : "border-input"
            }`}
          />
          {isPasswordMismatch ? <p className="text-sm text-destructive">{t("passwordMismatch")}</p> : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={loading || confirmPassword.length === 0 || isPasswordMismatch}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {loading ? t("creatingAccount") : t("createAccount")}
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        {t("haveAccount")} {" "}
        <Link href={`/${locale}/login`} className="text-foreground underline underline-offset-4">
          {t("login")}
        </Link>
      </p>
    </main>
  );
}
