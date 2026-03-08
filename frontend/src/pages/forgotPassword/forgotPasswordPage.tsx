import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordRequest } from "../../services/authService";
import "./forgotPassword.css";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setResetLink(null);
    setError("");

    try {
      const response = await forgotPasswordRequest(email);
      setMessage(response.message);
      setResetLink(response.resetLink);
    } catch {
      setError("Nao foi possivel gerar o link de recuperacao");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h1>Esqueci minha senha</h1>

        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Gerando..." : "Gerar link"}
          </button>
        </form>

        {message && <p className="forgot-message success">{message}</p>}
        {error && <p className="forgot-message error">{error}</p>}
        {resetLink && (
          <p className="forgot-message">
            Link de teste:{" "}
            <a href={resetLink} target="_blank" rel="noreferrer">
              {resetLink}
            </a>
          </p>
        )}

        <Link to="/login">Voltar para login</Link>
      </div>
    </div>
  );
}
