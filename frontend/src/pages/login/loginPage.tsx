import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { NexLogo } from "../../components/NexLogo";
import { Button } from "../../components/button/button";
import emailIcon from "../../assets/email-icon.svg";
import lockIcon from "../../assets/lock-icon.svg";
import "./login.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const user = await login(username, password);

      if (user.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      navigate("/start");
    } catch {
      setErrorMessage("Usuario ou senha invalidos");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrapper">
          <NexLogo className="login-logo" />
        </div>

        <h1 className="login-title">Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <span className="input-icon">
              <img src={emailIcon} alt="" className="input-icon-image" />
            </span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <span className="input-icon">
              <img src={lockIcon} alt="" className="input-icon-image" />
            </span>
          </div>

          {errorMessage && <p className="login-error-message">{errorMessage}</p>}

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              Lembrar
            </label>
            <button type="button" className="forgot-password">
              Esqueci minha senha
            </button>
          </div>

          <Button type="submit" className="login-button">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
