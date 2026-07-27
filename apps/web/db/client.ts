import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://workspace_town:workspace_town@localhost:5432/workspace_town";

const queryClient = postgres(databaseUrl, {
  prepare: false,
});

export const db = drizzle(queryClient, { schema });
