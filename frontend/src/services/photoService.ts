import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

interface UploadPhotoResponse {
  id: string;
  downloadPath: string;
  downloadUrl: string;
}

export async function uploadPhoto(dataUrl: string): Promise<UploadPhotoResponse> {
  const response = await api.post<UploadPhotoResponse>("/photos", { dataUrl });
  return response.data;
}
