import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import frameSrc from "../../assets/frame.svg";
import "./review.css";
import { usePhotoFlow } from "../../hooks/usePhotoFlow";
import { composePhotoWithFrame } from "../../utils/composePhotoWithFrame";

const FRAME_PHOTO_SLOT = {
  x: 0,
  y: 216.335,
  width: 887,
  height: 1262.555
};

export function ReviewPage() {
  const navigate = useNavigate();
  const {
    capturedPhoto,
    framedPhoto,
    setFramedPhoto,
    resetPhotoFlow
  } = usePhotoFlow();

  const [isComposing, setIsComposing] = useState(false);
  const [composeError, setComposeError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function generateFramedPhoto() {
      if (!capturedPhoto || framedPhoto) {
        return;
      }

      try {
        setIsComposing(true);
        setComposeError(null);

        const composed = await composePhotoWithFrame(
          capturedPhoto,
          frameSrc,
          FRAME_PHOTO_SLOT
        );

        if (active) {
          setFramedPhoto(composed);
        }
      } catch {
        if (active) {
          setComposeError("Não foi possível gerar a moldura da foto.");
        }
      } finally {
        if (active) {
          setIsComposing(false);
        }
      }
    }

    generateFramedPhoto();

    return () => {
      active = false;
    };
  }, [capturedPhoto, framedPhoto, setFramedPhoto]);

  function handleRetake() {
    resetPhotoFlow();
    navigate("/capture");
  }

  function handleContinue() {
    navigate("/qrcode");
  }

  if (!capturedPhoto) {
    return <Navigate to="/capture" replace />;
  }

  return (
    <div className="review-container">
      <div className="review-frame">
        <div className="review-photo-area">
          <div className="review-framed-preview">
            <div className="review-photo-slot">
              <img src={capturedPhoto} alt="captured" className="review-photo" />
            </div>
            <img src={frameSrc} alt="Moldura" className="review-frame-overlay" />
          </div>
          {isComposing && <p className="review-status">Gerando moldura...</p>}
          {!isComposing && composeError && (
            <p className="review-status">{composeError}</p>
          )}
        </div>

        <div className="review-actions">
          <button className="btn-retake" onClick={handleRetake}>
            Refazer
          </button>

          <button
            className="btn-continue"
            onClick={handleContinue}
            disabled={isComposing}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
