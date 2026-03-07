import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./login.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const user = await login(username, password);

      if (user.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      navigate("/start");
    } catch {
      setErrorMessage("Usuário ou senha inválidos");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrapper">
          <div className="login-logo-box">NEX</div>
          <span className="login-logo-text">.lab</span>
        </div>

        <h1 className="login-title">Login</h1>

        <form className="login-form">
          <div className="input-group">
            <input type="email" placeholder="Email" />
            <span className="input-icon">✉</span>
          </div>

          <div className="input-group">
            <input type="password" placeholder="Senha" />
            <span className="input-icon">🔒</span>
          </div>

          <div className="login-options">
            {/* <label className="remember-me">
              <input type="checkbox" />
              <span>Lembrar</span>
            </label>

            <button type="button" className="forgot-password">
              Esqueci minha senha
            </button> */}
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}