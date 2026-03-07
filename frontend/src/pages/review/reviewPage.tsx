import { Navigate, useNavigate } from "react-router-dom";
import "./review.css";
import { usePhotoFlow } from "../../hooks/usePhotoFlow";

export function ReviewPage() {
  const navigate = useNavigate();
  const { capturedPhoto, resetPhotoFlow } = usePhotoFlow();

  if (!capturedPhoto) {
    return <Navigate to="/capture" replace />;
  }

  function handleRetake() {
    resetPhotoFlow();
    navigate("/capture");
  }

  function handleContinue() {
    navigate("/qrcode");
  }

  return (
    <div className="review-container">
      <div className="review-frame">
        <div className="review-header">
          <div className="review-brand">
            <span className="review-logo-box">NEX</span>
            <span className="review-logo-text">.lab</span>
          </div>

          <span className="review-header-text">we make tech simple...</span>
        </div>

        <div className="review-photo-area">
          <img src={capturedPhoto} alt="captured" className="review-photo" />
        </div>

        <div className="review-footer">we make tech simple...</div>

        <div className="review-actions">
          <button className="btn-retake" onClick={handleRetake}>
            Refazer
          </button>

          <button className="btn-continue" onClick={handleContinue}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}