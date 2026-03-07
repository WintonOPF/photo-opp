import { useContext } from 'react';
import { PhotoFlowContext } from '../context/PhotoFlowContext';

export function usePhotoFlow() {
  const context = useContext(PhotoFlowContext);

  if (!context) {
    throw new Error('usePhotoFlow deve ser usado dentro de PhotoFlowProvider');
  }

  return context;
}