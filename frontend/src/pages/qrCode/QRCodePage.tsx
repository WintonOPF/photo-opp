import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import frameSrc from "../../assets/frame.svg";
import "./qrcode.css";
import { usePhotoFlow } from "../../hooks/usePhotoFlow";
import { composePhotoWithFrame } from "../../utils/composePhotoWithFrame";
import { uploadPhoto } from "../../services/photoService";
import { NexLogo } from "../../components/NexLogo";
import { Button } from "../../components/button/button";

const FRAME_PHOTO_SLOT = {
  x: 0,
  y: 216.335,
  width: 887,
  height: 1262.555
};

type QRCodeStep =
  | "preview-with-small-qr"
  | "thank-you-overlay"
  | "final-large-qr";

export function QRCodePage() {
  const navigate = useNavigate();
  const { capturedPhoto, framedPhoto, setFramedPhoto, resetPhotoFlow } =
    usePhotoFlow();

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeError, setComposeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<QRCodeStep>("preview-with-small-qr");

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
          setComposeError("Nao foi possivel aplicar a moldura.");
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

  useEffect(() => {
    let active = true;
    const photoData = framedPhoto;

    if (!photoData) {
      return () => {
        active = false;
      };
    }
    const safePhotoData: string = photoData;

    async function uploadCurrentPhoto() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await uploadPhoto(safePhotoData);

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
  }, [framedPhoto]);

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
            <div className="qr-review-photo-area">
              {isComposing && <p>Gerando moldura...</p>}
              {!isComposing && composeError && <p>{composeError}</p>}
              {!isComposing && !composeError && framedPhoto && (
                <img
                  src={framedPhoto}
                  alt="Foto com moldura"
                  className="qr-review-photo"
                />
              )}

              <div className="qr-mini-code-card">
                <span className="qr-mini-title">Baixar foto</span>
                <div className="qr-mini-code">
                  {isLoading && <span>Gerando...</span>}
                  {!isLoading && error && <span>Erro</span>}
                  {!isLoading && !error && downloadUrl && (
                    <QRCodeCanvas value={downloadUrl} size={84} />
                  )}
                </div>
              </div>
            </div>

            <div className="qr-actions">
              <Button onClick={handleFinish} disabled={isLoading}>
                Finalizar
              </Button>
            </div>
          </>
        )}

        {step === "thank-you-overlay" && (
          <>
            <div className="qr-review-photo-area dimmed">
              {framedPhoto && (
                <img
                  src={framedPhoto}
                  alt="Foto com moldura"
                  className="qr-review-photo"
                />
              )}

              <div className="qr-mini-code-card">
                <span className="qr-mini-title">Baixar foto</span>
                <div className="qr-mini-code">
                  {!error && downloadUrl ? (
                    <QRCodeCanvas value={downloadUrl} size={84} />
                  ) : (
                    <span>QR</span>
                  )}
                </div>
              </div>
            </div>

            <div className="qr-actions">
              <Button disabled>Finalizar</Button>
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
            <NexLogo className="qr-final-logo" />

            <h2>Obrigado!</h2>
            <p>Escaneie para baixar sua foto</p>

            <div className="qr-large-code">
              {isLoading && <span>Gerando QR...</span>}
              {!isLoading && error && <span>{error}</span>}
              {!isLoading && !error && downloadUrl && (
                <QRCodeCanvas value={downloadUrl} size={140} />
              )}
            </div>

            <Button onClick={handleFinish}>Finalizar</Button>
          </div>
        )}
      </div>
    </div>
  );
}
