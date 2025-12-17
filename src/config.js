import dotenv from "dotenv";
import path from "path";

dotenv.config();

const required = ["SESSION_SECRET", "BASE_URL"];
required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: env ${key} is not set`);
  }
});

const dbPath = process.env.DB_PATH || "/data/app.db";
const databaseUrl = process.env.DATABASE_URL || `file:${path.resolve(dbPath)}`;

export const config = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  sessionSecret: process.env.SESSION_SECRET || "change-me",
  databaseUrl,
  dbPath,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || "",
  },
  email: {
    mode: process.env.EMAIL_MODE || "dev",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || "Secret Santa <no-reply@example.com>",
  },
};
