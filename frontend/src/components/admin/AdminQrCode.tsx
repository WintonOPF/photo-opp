import { memo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import type { PhotoItem } from "../../types/photo";

interface AdminQrCodeProps {
  photo: PhotoItem | null;
  onClose: () => void;
}

export const AdminQrCode = memo(function AdminQrCode({
  photo,
  onClose,
}: AdminQrCodeProps) {
  if (!photo) {
    return null;
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="admin-modal-title">Photo QR Code</h3>
        <p className="admin-modal-id">{photo.id}</p>

        <div className="admin-modal-preview">
          <img src={photo.downloadUrl} alt="Selected photo" loading="lazy" />
        </div>

        <div className="admin-modal-qr">
          <QRCodeCanvas value={photo.downloadUrl} size={220} />
        </div>

        <button className="admin-modal-close" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
});
