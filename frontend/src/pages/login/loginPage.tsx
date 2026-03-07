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
    <div className="login-container">
      <div className="login-card">
        <div className="logo">NEX.lab</div>

        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}