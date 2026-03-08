import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./qrcode.css";
import { usePhotoFlow } from "../../hooks/usePhotoFlow";
import { uploadPhoto } from "../../services/photoService";

type QRCodeStep =
  | "preview-with-small-qr"
  | "thank-you-overlay"
  | "final-large-qr";

export function QRCodePage() {
  const navigate = useNavigate();
  const { capturedPhoto, resetPhotoFlow } = usePhotoFlow();

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<QRCodeStep>("preview-with-small-qr");

  useEffect(() => {
    let active = true;
    const photoData = capturedPhoto;

    if (!photoData) {
      return () => {
        active = false;
      };
    }

    async function uploadCurrentPhoto() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await uploadPhoto(photoData!);

        if (active) {
          setDownloadUrl(response.downloadUrl);
        }
      } catch {
        if (active) {
          setError("Não foi possível gerar o QR Code. Tente novamente.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    uploadCurrentPhoto();

    return () => {
      active = false;
    };
  }, [capturedPhoto]);

  useEffect(() => {
    if (step !== "thank-you-overlay") {
      return;
    }

    const timer = setTimeout(() => {
      setStep("final-large-qr");
    }, 1800);

    return () => clearTimeout(timer);
  }, [step]);

  function handleFinish() {
    if (step === "preview-with-small-qr") {
      setStep("thank-you-overlay");
      return;
    }

    if (step === "final-large-qr") {
      resetPhotoFlow();
      navigate("/start");
    }
  }

  if (!capturedPhoto) {
    return <Navigate to="/start" replace />;
  }

  return (
    <div className="qr-container">
      <div className="qr-frame">
        {step === "preview-with-small-qr" && (
          <>
            <div className="qr-review-header">
              <span className="qr-logo">NEX.lab</span>
              <span className="qr-header-text">we make tech simple...</span>
            </div>

            <div className="qr-review-photo-area">
              <img
                src={capturedPhoto}
                alt="Foto capturada"
                className="qr-review-photo"
              />

              <div className="qr-small-download-card">
                <div className="qr-small-title">Fazer download</div>

                <div className="qr-small-code">
                  {isLoading && <span>Gerando...</span>}
                  {!isLoading && error && <span>Erro</span>}
                  {!isLoading && !error && downloadUrl && (
                    <QRCodeCanvas value={downloadUrl} size={58} />
                  )}
                </div>
              </div>
            </div>

            <div className="qr-review-footer">we make tech simple...</div>

            <div className="qr-actions">
              <button onClick={handleFinish} disabled={isLoading}>
                Finalizar
              </button>
            </div>
          </>
        )}

        {step === "thank-you-overlay" && (
          <>
            <div className="qr-review-header">
              <span className="qr-logo">NEX.lab</span>
              <span className="qr-header-text">we make tech simple...</span>
            </div>

            <div className="qr-review-photo-area dimmed">
              <img
                src={capturedPhoto}
                alt="Foto capturada"
                className="qr-review-photo"
              />

              <div className="qr-small-download-card">
                <div className="qr-small-title">Fazer download</div>

                <div className="qr-small-code">
                  {!error && downloadUrl ? (
                    <QRCodeCanvas value={downloadUrl} size={58} />
                  ) : (
                    <span>QR</span>
                  )}
                </div>
              </div>
            </div>

            <div className="qr-review-footer">we make tech simple...</div>

            <div className="qr-actions">
              <button disabled>Finalizar</button>
            </div>

            <div className="qr-overlay">
              <div className="qr-overlay-card">
                <h2>Obrigado!</h2>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </div>
          </>
        )}

        {step === "final-large-qr" && (
          <div className="qr-final-content">
            <div className="qr-final-logo">NEX.lab</div>

            <h2>Obrigado!</h2>
            <p>Escaneie para baixar sua foto</p>

            <div className="qr-large-code">
              {isLoading && <span>Gerando QR...</span>}
              {!isLoading && error && <span>{error}</span>}
              {!isLoading && !error && downloadUrl && (
                <QRCodeCanvas value={downloadUrl} size={140} />
              )}
            </div>

            <button onClick={handleFinish}>Finalizar</button>
          </div>
        )}
      </div>
    </div>
  );
}