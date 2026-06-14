import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://workspace_town:workspace_town@localhost:5432/workspace_town";

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
