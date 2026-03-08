export function roleMiddleware(allowedRoles = []) {
  return function checkRole(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "Nao autenticado" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado para este perfil" });
    }

    return next();
  };
}
