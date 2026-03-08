import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateJwt } from "../lib/jwt.js";
import {
  createUser,
  findUserByEmail,
  findUserByResetToken,
  updateUser,
} from "./userService.js";
import { env } from "../config/env.js";

function toAuthUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function getDefaultNameFromEmail(email) {
  const [localPart = "promoter"] = email.split("@");
  return localPart;
}

export async function loginOrAutoRegister({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  let user = await findUserByEmail(normalizedEmail);
  let message = "Login realizado com sucesso";

  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await createUser({
      name: getDefaultNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      passwordHash,
      role: "PROMOTER",
    });
    message = "Conta criada com sucesso";
  } else {
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error = new Error("Senha incorreta");
      error.statusCode = 401;
      throw error;
    }
  }

  const token = generateJwt(user);

  return {
    message,
    token,
    user: toAuthUser(user),
  };
}

export async function forgotPassword(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    return {
      message: "Se o email existir, um link de recuperacao foi gerado.",
      resetLink: null,
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await updateUser(user.id, {
    resetToken,
    resetTokenExpiry,
  });

  const resetLink = `${env.appUrl}/reset-password?token=${resetToken}`;

  return {
    message: "Link de recuperacao gerado com sucesso",
    resetLink,
  };
}

export async function resetPassword({ token, newPassword }) {
  const user = await findUserByResetToken(token);

  if (!user) {
    const error = new Error("Token invalido ou expirado");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await updateUser(user.id, {
    passwordHash,
    resetToken: null,
    resetTokenExpiry: null,
  });

  return {
    message: "Senha redefinida com sucesso",
  };
}

export function buildMeResponse(user) {
  return toAuthUser(user);
}
