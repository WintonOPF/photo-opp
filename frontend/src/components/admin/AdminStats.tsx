import { memo } from "react";

interface AdminStatsProps {
  totalPhotos: number;
  totalFilteredPhotos: number;
}

export const AdminStats = memo(function AdminStats({
  totalPhotos,
  totalFilteredPhotos,
}: AdminStatsProps) {
  return (
    <section className="admin-stats">
      <article className="admin-stat-card">
        <span>Total photos</span>
        <strong>{totalPhotos}</strong>
      </article>

      <article className="admin-stat-card">
        <span>Total filtered photos</span>
        <strong>{totalFilteredPhotos}</strong>
      </article>
    </section>
  );
});
