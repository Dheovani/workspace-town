import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthPageShellProps = {
  appName: string;
  title: string;
  description: string;
  children: ReactNode;
  alternateAction: ReactNode;
};

export function AuthPageShell({
  appName,
  title,
  description,
  children,
  alternateAction,
}: AuthPageShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
            <Building2 aria-hidden="true" className="size-5" />
          </span>
          <span className="text-lg font-semibold">{appName}</span>
        </div>

        <Card className="gap-0 rounded-lg bg-white py-0 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="gap-1.5 px-6 pt-7 pb-5 text-center">
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="leading-6">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {children}
            <div className="mt-5 text-center text-sm text-slate-600">
              {alternateAction}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
