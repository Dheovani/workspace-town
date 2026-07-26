"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmail } from "@/lib/auth/client";
import { useRouter } from "@/i18n/navigation";
import { registerSchema } from "../schemas";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const validation = useTranslations("auth.validation");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      const passwordMismatch = parsed.error.issues.some((issue) =>
        issue.path.includes("confirmPassword"),
      );
      setError(
        passwordMismatch
          ? validation("passwordMismatch")
          : validation("invalidRegisterForm"),
      );
      return;
    }

    setIsPending(true);

    try {
      const { error: authError } = await signUpWithEmail({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (authError) {
        setError(t("errors.unableToCreate"));
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
        <Label htmlFor="name">{t("fields.name")}</Label>
        <Input
          className="h-10 rounded-md bg-white px-3"
          id="name"
          name="name"
          autoComplete="name"
          placeholder={t("placeholders.name")}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("fields.email")}</Label>
        <Input
          className="h-10 rounded-md bg-white px-3"
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
          className="h-10 rounded-md bg-white px-3"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder={t("placeholders.password")}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("fields.confirmPassword")}</Label>
        <Input
          className="h-10 rounded-md bg-white px-3"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder={t("placeholders.confirmPassword")}
          disabled={isPending}
          required
        />
      </div>

      {error ? (
        <p
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm leading-5 text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Button
        className="h-10 w-full rounded-md bg-slate-900 hover:bg-slate-800"
        size="lg"
        type="submit"
        disabled={isPending}
      >
        {isPending ? t("loading") : t("submit")}
      </Button>
    </form>
  );
}
