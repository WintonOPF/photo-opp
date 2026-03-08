export async function composePhotoWithFrame(
  photoSrc: string,
  frameSrc: string,
  framePhotoSlot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
): Promise<string> {
  const photo = await loadImage(photoSrc);
  const frame = await loadImage(frameSrc);

  const canvas = document.createElement("canvas");
  canvas.width = frame.width;
  canvas.height = frame.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Nao foi possivel obter o contexto do canvas.");
  }

  const slot = framePhotoSlot ?? {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  drawPhotoCover(context, photo, slot.x, slot.y, slot.width, slot.height);
  context.drawImage(frame, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/png");
}

function drawPhotoCover(
  context: CanvasRenderingContext2D,
  photo: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const slotRatio = width / height;
  const photoRatio = photo.width / photo.height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = x;
  let offsetY = y;

  if (photoRatio > slotRatio) {
    drawHeight = height;
    drawWidth = photo.width * (height / photo.height);
    offsetX = x + (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = photo.height * (width / photo.width);
    offsetY = y + (height - drawHeight) / 2;
  }

  context.drawImage(photo, offsetX, offsetY, drawWidth, drawHeight);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
