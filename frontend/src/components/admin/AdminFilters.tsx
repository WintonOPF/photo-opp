import { memo } from "react";

interface AdminFiltersProps {
  startDate: string;
  endDate: string;
  pageSize: number;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
}

export const AdminFilters = memo(function AdminFilters({
  startDate,
  endDate,
  pageSize,
  onStartDateChange,
  onEndDateChange,
  onPageSizeChange,
}: AdminFiltersProps) {
  return (
    <div className="admin-filters">
      <div className="admin-filter-group">
        <label htmlFor="admin-start-date">Start date</label>
        <input
          id="admin-start-date"
          type="datetime-local"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
      </div>

      <div className="admin-filter-group">
        <label htmlFor="admin-end-date">End date</label>
        <input
          id="admin-end-date"
          type="datetime-local"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
      </div>

      <div className="admin-filter-group">
        <label htmlFor="admin-page-size">Items per page</label>
        <select
          id="admin-page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
});
