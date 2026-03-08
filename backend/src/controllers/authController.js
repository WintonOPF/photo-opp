import {
  buildMeResponse,
  forgotPassword,
  loginOrAutoRegister,
  resetPassword,
} from "../services/authService.js";

export async function login(req, res) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha sao obrigatorios" });
  }

  try {
    const result = await loginOrAutoRegister({ email, password });
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode ?? 500;
    return res.status(statusCode).json({ message: error.message });
  }
}

export async function forgotPasswordHandler(req, res) {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ message: "Email e obrigatorio" });
  }

  const result = await forgotPassword(email);
  return res.json(result);
}

export async function resetPasswordHandler(req, res) {
  const { token, newPassword } = req.body ?? {};

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token e nova senha sao obrigatorios" });
  }

  try {
    const result = await resetPassword({ token, newPassword });
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode ?? 500;
    return res.status(statusCode).json({ message: error.message });
  }
}

export function me(req, res) {
  return res.json(buildMeResponse(req.user));
}
