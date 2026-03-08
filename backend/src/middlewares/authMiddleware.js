import { findUserById } from "../services/userService.js";
import { verifyJwt } from "../lib/jwt.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = verifyJwt(token);
    const user = await findUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Usuario nao encontrado" });
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido" });
  }
}
