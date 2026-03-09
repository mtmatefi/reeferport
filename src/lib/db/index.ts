import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// DATABASE_URL is required at runtime but may not be set during build
const DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost/placeholder";

const client = postgres(DATABASE_URL, { ssl: "require", max: 1 });
export const db = drizzle(client, { schema });
export * from "./schema";
