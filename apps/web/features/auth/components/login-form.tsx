"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/lib/auth/client";
import { useRouter } from "@/i18n/navigation";
import { loginSchema } from "../schemas";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const validation = useTranslations("auth.validation");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setError(validation("invalidCredentialsForm"));
      return;
    }

    setIsPending(true);

    try {
      const { error: authError } = await signInWithEmail({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (authError) {
        setError(t("errors.invalidCredentials"));
        return;
      }

      router.push("/workspaces");
      router.refresh();
    } catch {
      setError(t("errors.unexpected"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">{t("fields.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("placeholders.email")}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("fields.password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={t("placeholders.password")}
          disabled={isPending}
          required
        />
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button className="w-full" size="lg" type="submit" disabled={isPending}>
        {isPending ? t("loading") : t("submit")}
      </Button>
    </form>
  );
}
