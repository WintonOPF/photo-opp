import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { NexLogo } from "../../components/NexLogo";
import { Button } from "../../components/button/button";
import emailIcon from "../../assets/email-icon.svg";
import lockIcon from "../../assets/lock-icon.svg";
import "./login.css";

const LAST_LOGIN_KEY = "last_login_username";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem(LAST_LOGIN_KEY);
    if (savedUsername) {
      setUsername(savedUsername);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 1000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const user = await login(username, password, remember);

      if (remember) {
        localStorage.setItem(LAST_LOGIN_KEY, username);
      } else {
        localStorage.removeItem(LAST_LOGIN_KEY);
      }

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

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Lembrar
            </label>
            <button type="button" className="forgot-password">
              Esqueci minha senha
            </button>
          </div>

          {errorMessage && <p className="login-error-message">{errorMessage}</p>}

          <Button type="submit" className="login-button">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
