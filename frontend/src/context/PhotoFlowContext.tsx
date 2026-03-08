import { createContext, useMemo, useState } from 'react';

interface PhotoFlowContextType {
  capturedPhoto: string | null;
  framedPhoto: string | null;
  setCapturedPhoto: (photo: string | null) => void;
  setFramedPhoto: (photo: string | null) => void;
  resetPhotoFlow: () => void;
}

export const PhotoFlowContext = createContext<PhotoFlowContextType | null>(null);

export function PhotoFlowProvider({ children }: { children: React.ReactNode }) {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [framedPhoto, setFramedPhoto] = useState<string | null>(null);

  function resetPhotoFlow() {
    setCapturedPhoto(null);
    setFramedPhoto(null);
  }

  const value = useMemo(
    () => ({
      capturedPhoto,
      framedPhoto,
      setCapturedPhoto,
      setFramedPhoto,
      resetPhotoFlow
    }),
    [capturedPhoto, framedPhoto]
  );

  return (
    <PhotoFlowContext.Provider value={value}>
      {children}
    </PhotoFlowContext.Provider>
  );
}