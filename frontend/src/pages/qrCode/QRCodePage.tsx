import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./qrcode.css";
import { usePhotoFlow } from "../../hooks/usePhotoFlow";
import { uploadPhoto } from "../../services/photoService";

export function QRCodePage() {
  const navigate = useNavigate();
  const { capturedPhoto, resetPhotoFlow } = usePhotoFlow();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!capturedPhoto) {
    return <Navigate to="/start" replace />;
  }

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
        const response = await uploadPhoto(photoData);
        if (active) {
          setDownloadUrl(response.downloadUrl);
        }
      } catch {
        if (active) {
          setError("Nao foi possivel gerar o QR Code. Tente novamente.");
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

  function handleFinish() {
    resetPhotoFlow();
    navigate("/start");
  }

  return (
    <div className="qr-container">
      <div className="qr-frame">

        <div className="qr-logo">NEX.lab</div>

        <h2>Obrigado!</h2>
        <p>Escaneie para baixar sua foto</p>

        <div className="qr-code">
          {isLoading && <p>Gerando QR...</p>}
          {!isLoading && error && <p>{error}</p>}
          {!isLoading && !error && downloadUrl && (
            <QRCodeCanvas value={downloadUrl} size={200} />
          )}
        </div>

        <button onClick={handleFinish}>
          Finalizar
        </button>

      </div>
    </div>
  );
}
