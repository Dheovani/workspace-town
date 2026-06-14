"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "@/i18n/navigation";

export function SignOutButton() {
  const t = useTranslations("auth.session");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function onSignOut() {
    setIsPending(true);

    await signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onSignOut}
      disabled={isPending}
    >
      <LogOut aria-hidden="true" />
      {isPending ? t("signingOut") : t("signOut")}
    </Button>
  );
}
