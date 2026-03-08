import { useNavigate } from "react-router-dom";
import "./start.css";
import { NexLogo } from "../../components/NexLogo";
import { Button } from "../../components/button/button";

export function StartPage() {
  const navigate = useNavigate();

  function handleStart() {
    navigate("/capture");
  }

  return (
    <div className="start-container">
      <div className="start-card">
        <NexLogo className="logo" />

        <h1>Photo Opp</h1>

        <Button onClick={handleStart}>Iniciar</Button>
      </div>
    </div>
  );
}
