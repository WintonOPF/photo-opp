import { useEffect, useRef, useState } from "react";
import "./capture.css";

export function CapturePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user"
          },
          audio: false
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
    if (!streamReady) return;

    const timer = setTimeout(() => {
      setCountdown(3);
    }, 1000);

    return () => clearTimeout(timer);
  }, [streamReady]);

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
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

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