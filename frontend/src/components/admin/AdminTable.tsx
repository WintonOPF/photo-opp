import { memo } from "react";
import type { PhotoItem } from "../../types/photo";

interface AdminTableProps {
  photos: PhotoItem[];
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPreviewPhoto: (photo: PhotoItem) => void;
  onDeletePhoto: (photo: PhotoItem) => void;
}

export const AdminTable = memo(function AdminTable({
  photos,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onPreviewPhoto,
  onDeletePhoto,
}: AdminTableProps) {
  return (
    <>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Download</th>
              <th>Visualização</th>
              <th>Excluir</th>
            </tr>
          </thead>

          <tbody>
            {photos.map((photo) => (
              <tr key={photo.id}>
                <td className="admin-id-cell">{photo.id}</td>

                <td>{new Date(photo.createdAt).toLocaleString()}</td>

                <td>
                  <a href={photo.downloadUrl} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </td>

                <td>
                  <button
                    className="admin-qr-btn"
                    type="button"
                    onClick={() => onPreviewPhoto(photo)}
                  >
                    Visualizar
                  </button>
                </td>

                <td>
                  <button
                    className="admin-qr-btn"
                    type="button"
                    onClick={() => onDeletePhoto(photo)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button
          type="button"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <span>
          Pagina {currentPage} de {totalPages}
        </span>

        <button
          type="button"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          Proximo
        </button>
      </div>
    </>
  );
});
