import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./admin.css";

export function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="admin-container">
      <div className="admin-frame">
        <h1>Painel administrativo</h1>
        <p>Ola, {user?.name}</p>
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}
