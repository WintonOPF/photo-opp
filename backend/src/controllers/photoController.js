import {
  createPhoto,
  deletePhotoById,
  getPhotoById,
  getPhotoList,
  parseDataUrl,
} from "../services/photoService.js";

export async function uploadPhoto(req, res) {
  const { dataUrl } = req.body ?? {};

  if (typeof dataUrl !== "string") {
    return res.status(400).json({ message: "dataUrl e obrigatorio" });
  }

  if (!parseDataUrl(dataUrl)) {
    return res.status(400).json({ message: "dataUrl invalido" });
  }

  const photo = await createPhoto({ dataUrl, userId: req.user.id });

  const downloadPath = `/photos/${photo.id}/download`;
  const downloadUrl = `${req.protocol}://${req.get("host")}${downloadPath}`;

  return res.status(201).json({
    id: photo.id,
    downloadPath,
    downloadUrl,
  });
}

export async function downloadPhoto(req, res) {
  const { id } = req.params;
  const photo = await getPhotoById(id);

  if (!photo) {
    return res.status(404).json({ message: "foto nao encontrada" });
  }

  const match = parseDataUrl(photo.fileUrl);

  if (!match) {
    return res.status(500).json({ message: "arquivo de foto invalido" });
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const imageBuffer = Buffer.from(base64Data, "base64");

  res.setHeader("Content-Type", mimeType);
  res.setHeader("Cache-Control", "no-store");

  return res.send(imageBuffer);
}

export async function listPhotos(req, res) {
  const photos = await getPhotoList();

  const items = photos.map((photo) => ({
    id: photo.id,
    createdAt: photo.createdAt.getTime(),
    downloadUrl: `${req.protocol}://${req.get("host")}/photos/${photo.id}/download`,
  }));

  return res.json({
    items,
    total: items.length,
  });
}

export async function deletePhoto(req, res) {
  const { id } = req.params;

  try {
    await deletePhotoById(id);
    return res.status(204).send();
  } catch {
    return res.status(404).json({ message: "foto nao encontrada" });
  }
}
