import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  appUrl: process.env.APP_URL ?? "http://localhost:5173",
  frontendUrl: process.env.FRONTEND_URL ?? process.env.APP_URL ?? "http://localhost:5173",
};
