import { prisma } from "../lib/prisma.js";

const DATA_URL_REGEX = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/;

export function parseDataUrl(dataUrl) {
  return dataUrl.match(DATA_URL_REGEX);
}

export async function createPhoto({ dataUrl, userId }) {
  const created = await prisma.photo.create({
    data: {
      fileUrl: dataUrl,
      qrCodeUrl: "",
      createdById: userId,
    },
  });

  const qrCodeUrl = `/photos/${created.id}/download`;

  return prisma.photo.update({
    where: { id: created.id },
    data: { qrCodeUrl },
  });
}

export async function getPhotoById(id) {
  return prisma.photo.findUnique({
    where: { id },
  });
}

export async function getPhotoList() {
  return prisma.photo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deletePhotoById(id) {
  return prisma.photo.delete({
    where: { id },
  });
}
