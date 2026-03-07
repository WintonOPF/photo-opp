import { createContext, useMemo, useState } from 'react';

interface PhotoFlowContextType {
  capturedPhoto: string | null;
  setCapturedPhoto: (photo: string | null) => void;
  resetPhotoFlow: () => void;
}

export const PhotoFlowContext = createContext<PhotoFlowContextType | null>(null);

export function PhotoFlowProvider({ children }: { children: React.ReactNode }) {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  function resetPhotoFlow() {
    setCapturedPhoto(null);
  }

  const value = useMemo(
    () => ({
      capturedPhoto,
      setCapturedPhoto,
      resetPhotoFlow
    }),
    [capturedPhoto]
  );

  return (
    <PhotoFlowContext.Provider value={value}>
      {children}
    </PhotoFlowContext.Provider>
  );
}