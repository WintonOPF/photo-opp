import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminFilters } from "../components/admin/AdminFilters";
import { AdminQrCode } from "../components/admin/AdminQrCode";
import { AdminStats } from "../components/admin/AdminStats";
import { AdminTable } from "../components/admin/AdminTable";
import { useAuth } from "../hooks/useAuth";
import { deletePhoto, listPhotos } from "../services/photoService";
import type { PhotoItem } from "../types/photo";
import "./admin/admin.css";

function parseFilterDate(value: string): number | null {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  useEffect(() => {
    let isMounted = true;

    async function fetchPhotos() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await listPhotos();
        if (isMounted) {
          setPhotos(response.items);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load photos.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPhotos = useMemo(() => {
    const startDateTimestamp = parseFilterDate(startDate);
    const endDateTimestamp = parseFilterDate(endDate);

    return photos.filter((photo) => {
      const photoTimestamp = new Date(photo.createdAt).getTime();
      if (Number.isNaN(photoTimestamp)) {
        return false;
      }

      if (startDateTimestamp !== null && photoTimestamp < startDateTimestamp) {
        return false;
      }

      if (endDateTimestamp !== null && photoTimestamp > endDateTimestamp) {
        return false;
      }

      return true;
    });
  }, [photos, startDate, endDate]);

  const totalPhotos = photos.length;
  const totalFilteredPhotos = filteredPhotos.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredPhotos / pageSize));

  const paginatedPhotos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPhotos.slice(start, start + pageSize);
  }, [currentPage, filteredPhotos, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((previous) => Math.max(1, previous - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((previous) => Math.min(totalPages, previous + 1));
  }, [totalPages]);

  const handlePreviewPhoto = useCallback((photo: PhotoItem) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleDeletePhoto = useCallback(async (photo: PhotoItem) => {
    const confirmed = window.confirm("Deseja excluir esta foto?");
    if (!confirmed) {
      return;
    }

    try {
      await deletePhoto(photo.id);
      setPhotos((previous) => previous.filter((item) => item.id !== photo.id));
      setSelectedPhoto((previous) => (previous?.id === photo.id ? null : previous));
    } catch {
      setError("Nao foi possivel excluir a foto.");
    }
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Photo Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <button className="admin-logout-btn" type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <AdminStats
        totalPhotos={totalPhotos}
        totalFilteredPhotos={totalFilteredPhotos}
      />

      <section className="admin-section">
        <h2>Photos</h2>

        <AdminFilters
          startDate={startDate}
          endDate={endDate}
          pageSize={pageSize}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onPageSizeChange={setPageSize}
        />

        {isLoading && <p>Loading photos...</p>}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && !error && totalFilteredPhotos === 0 && (
          <p>No photos found for this filter.</p>
        )}

        {!isLoading && !error && totalFilteredPhotos > 0 && (
          <AdminTable
            photos={paginatedPhotos}
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPreviewPhoto={handlePreviewPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}
      </section>

      <AdminQrCode photo={selectedPhoto} onClose={handleCloseModal} />
    </div>
  );
}
