"use client";

import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

type AuthClientError = {
  message?: string;
};

type AuthActionResult = {
  error: AuthClientError | null;
};

export async function signInWithEmail(input: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  const result = await authClient.signIn.email(input);

  return {
    error: result.error,
  };
}

export async function signUpWithEmail(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  const result = await authClient.signUp.email(input);

  return {
    error: result.error,
  };
}

export async function signOut(): Promise<void> {
  await authClient.signOut();
}
