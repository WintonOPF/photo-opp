import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordRequest } from "../../services/authService";
import "./resetPassword.css";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await resetPasswordRequest(token, newPassword);
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setError("Token invalido ou expirado");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="reset-page">
        <div className="reset-card">
          <p>Token de reset ausente</p>
          <Link to="/forgot-password">Solicitar novo link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1>Redefinir senha</h1>

        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={6}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>

        {message && <p className="reset-message success">{message}</p>}
        {error && <p className="reset-message error">{error}</p>}

        <Link to="/login">Voltar para login</Link>
      </div>
    </div>
  );
}
