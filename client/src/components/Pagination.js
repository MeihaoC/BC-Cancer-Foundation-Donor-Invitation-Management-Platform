// src/components/Pagination.js
import React from 'react';

/**
 * Pagination Component
 * ----------------------
 * Props:
 * - currentPage: (number) current page number (1-indexed)
 * - totalPages: (number) total number of pages available
 * - rowsPerPage: (number) number of rows currently displayed per page
 * - onPageChange: (function) called with the new page number when changing pages
 * - onRowsPerPageChange: (function) called on rows-per-page select change (receives the change event)
 * - pageSizeOptions: (array, optional) options for rows per page (default: [5,10,20,50])
 */
const Pagination = ({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  // Create an array with page numbers 1..totalPages.
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div
      className="pagination-controls"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '16px 0',
      }}
    >
      {/* Rows per page selector on the left */}
      <div className="rows-per-page">
        <label>
          Rows per page:&nbsp;
          <select value={rowsPerPage} onChange={onRowsPerPageChange}>
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Pagination navigation on the right */}
      <div className="pagination-wrapper">
        <ul className="pagination">
          {/* Previous Button */}
          <li
            className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          >
            Previous
          </li>

          {/* Page Numbers */}
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? 'active' : ''}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </li>
          ))}

          {/* Next Button */}
          <li
            className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          >
            Next
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
