import axios from "axios";
import type { PhotoItem } from "../types/photo";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

interface UploadPhotoResponse {
  id: string;
  downloadPath: string;
  downloadUrl: string;
}

interface ListPhotosResponse {
  items: PhotoItem[];
  total: number;
}

export async function uploadPhoto(dataUrl: string): Promise<UploadPhotoResponse> {
  const response = await api.post<UploadPhotoResponse>("/photos", { dataUrl });
  return response.data;
}

export async function listPhotos(): Promise<ListPhotosResponse> {
  const response = await api.get<ListPhotosResponse>("/photos");
  return response.data;
}
