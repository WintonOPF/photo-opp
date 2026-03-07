import { useNavigate } from "react-router-dom";
import "./start.css";

export function StartPage() {
  const navigate = useNavigate();

  function handleStart() {
    navigate("/capture");
  }

  return (
    <div className="start-container">
      <div className="start-card">
        <div className="logo">NEX.lab</div>

        <h1>Photo Opp</h1>

        <button onClick={handleStart}>Iniciar</button>
      </div>
    </div>
  );
}