import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import session from "express-session";
import pgSession from "connect-pg-simple";

const { Pool } = pg;
const PostgresqlStore = pgSession(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export const sessionStore = new PostgresqlStore({
  pool,
  tableName: 'session',
  createTableIfMissing: true,
});