import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth";
import { NexLogo } from "../../components/NexLogo";
import { Button } from "../../components/button/button";
import emailIcon from "../../assets/email-icon.svg";
import lockIcon from "../../assets/lock-icon.svg";
import "./login.css";

const LAST_LOGIN_KEY = "last_login_email";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem(LAST_LOGIN_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await login(email, password);

      if (remember) {
        localStorage.setItem(LAST_LOGIN_KEY, email);
      } else {
        localStorage.removeItem(LAST_LOGIN_KEY);
      }

      window.alert(response.message);

      if (response.user.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      navigate("/start");
    } catch (error) {
      if (isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Falha ao autenticar");
      } else {
        setErrorMessage("Falha ao autenticar");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleForgotPassword() {
    navigate("/forgot-password");
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
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
              required
            />
            <span className="input-icon">
              <img src={lockIcon} alt="" className="input-icon-image" />
            </span>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Lembrar
            </label>
            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Esqueci minha senha
            </button>
          </div>

          {errorMessage && <p className="login-error-message">{errorMessage}</p>}

          <Button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
