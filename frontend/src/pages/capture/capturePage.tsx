import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./capture.css";
import { usePhotoFlow } from "../../hooks/usePhotoFlow";

export function CapturePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const { setCapturedPhoto, setFramedPhoto } = usePhotoFlow();

  const [streamReady, setStreamReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = async () => {
            await videoRef.current?.play();
            setStreamReady(true);
          };
        }
      } catch (error) {
        console.error("Erro ao abrir câmera", error);
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!streamReady || countdown !== null) return;

    const timer = setTimeout(() => {
      setCountdown(3);
    }, 1000);

    return () => clearTimeout(timer);
  }, [streamReady, countdown]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 1) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown !== 1) return;

    const timer = setTimeout(() => {
      capturePhoto();
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  function capturePhoto() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const photoDataUrl = canvas.toDataURL("image/png");

    setFramedPhoto(null);
    setCapturedPhoto(photoDataUrl);
    navigate("/review");
  }

  return (
    <div className="capture-container">
      <div className="capture-frame">
        {!streamReady && (
          <div className="capture-loading">
            <div className="spinner" />
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="capture-video"
        />

        {!streamReady && (
          <div className="capture-overlay-text">[câmera abrindo]</div>
        )}

        {countdown !== null && (
          <div className="capture-countdown">{countdown}</div>
        )}

        <div className="capture-trigger" />
      </div>
    </div>
  );
}
