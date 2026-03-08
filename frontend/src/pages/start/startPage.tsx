import { useNavigate } from "react-router-dom";
import "./start.css";
import { NexLogo } from "../../components/NexLogo";
import { Button } from "../../components/button/button";
import { useAuth } from "../../hooks/useAuth";

export function StartPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleStart() {
    navigate("/capture");
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="start-container">
      <div className="start-card">
        <button
          type="button"
          className="start-logout-btn"
          onClick={handleLogout}
        >
          Sair
        </button>

        <NexLogo className="logo" />

        <h1>Photo Opp</h1>

        <Button className="start-action-btn" onClick={handleStart}>
          Iniciar
        </Button>
      </div>
    </div>
  );
}
