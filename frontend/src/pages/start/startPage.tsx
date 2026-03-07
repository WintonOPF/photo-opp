import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function StartPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <h1>Fluxo da ativação</h1>
      <p>Olá, {user?.name}</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}