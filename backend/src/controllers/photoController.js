import crypto from "crypto";

const photoStore = new Map();
const DATA_URL_REGEX = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/;

export function uploadPhoto(req, res) {
  const { dataUrl } = req.body ?? {};

  if (typeof dataUrl !== "string") {
    return res.status(400).json({ message: "dataUrl e obrigatorio" });
  }

  const match = dataUrl.match(DATA_URL_REGEX);
  if (!match) {
    return res.status(400).json({ message: "dataUrl invalido" });
  }

  const id = crypto.randomUUID();
  const mimeType = match[1];
  const base64Data = match[2];

  photoStore.set(id, {
    mimeType,
    base64Data,
    createdAt: Date.now(),
  });

  const downloadPath = `/photos/${id}/download`;
  const downloadUrl = `${req.protocol}://${req.get("host")}${downloadPath}`;

  return res.status(201).json({
    id,
    downloadPath,
    downloadUrl,
  });
}

export function downloadPhoto(req, res) {
  const { id } = req.params;
  const photo = photoStore.get(id);

  if (!photo) {
    return res.status(404).json({ message: "foto nao encontrada" });
  }

  const imageBuffer = Buffer.from(photo.base64Data, "base64");
  res.setHeader("Content-Type", photo.mimeType);
  res.setHeader("Cache-Control", "no-store");
  return res.send(imageBuffer);

}

export function listPhotos(req, res) {
  const items = Array.from(photoStore.entries())
    .map(([id, photo]) => ({
      id,
      createdAt: photo.createdAt,
      downloadUrl: `${req.protocol}://${req.get("host")}/photos/${id}/download`,
    }))
    .sort((a, b) => b.createdAt - a.createdAt);

  return res.json({
    items,
    total: items.length
  });
}
