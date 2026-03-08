import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateJwt(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
}

export function verifyJwt(token) {
  return jwt.verify(token, env.jwtSecret);
}
