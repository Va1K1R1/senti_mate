import React, { useState, useEffect } from 'react';
import './Pagination.css';
import Button from './Button';

/**
 * Pagination component for navigating through pages of content
 * 
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Number of items to display per page
 * @param {number} currentPage - Current active page (1-based)
 * @param {function} onPageChange - Callback function when page changes
 * @param {number} siblingCount - Number of page buttons to show on each side of current page
 * @param {boolean} showFirstLast - Whether to show first/last page buttons
 * @param {boolean} showPrevNext - Whether to show previous/next page buttons
 * @param {boolean} showPageNumbers - Whether to show page number buttons
 * @param {boolean} showItemsPerPageSelect - Whether to show items per page selector
 * @param {Array} itemsPerPageOptions - Options for items per page selector
 * @param {function} onItemsPerPageChange - Callback function when items per page changes
 * @param {string} className - Additional CSS class names
 */
const Pagination = ({
  totalItems = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  showItemsPerPageSelect = false,
  itemsPerPageOptions = [10, 20, 50, 100],
  onItemsPerPageChange,
  className = ''
}) => {
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Ensure current page is within valid range
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    // Update internal state when prop changes
    setPage(Math.min(Math.max(1, currentPage), totalPages));
  }, [currentPage, totalPages]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always include first page
    pageNumbers.push(1);
    
    // Calculate range around current page
    const leftSibling = Math.max(2, page - siblingCount);
    const rightSibling = Math.min(totalPages - 1, page + siblingCount);
    
    // Add ellipsis if needed
    if (leftSibling > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages around current page
    for (let i = leftSibling; i <= rightSibling; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis if needed
    if (rightSibling < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always include last page if not already included
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // Don't render pagination if there's only one page and no items per page selector
  if (totalPages <= 1 && !showItemsPerPageSelect) {
    return null;
  }
  
  return (
    <nav className={`Pagination ${className}`} aria-label="페이지 내비게이션">
      <div className="Pagination_container">
        {/* First page button */}
        {showFirstLast && (
          <Button
            text="처음"
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            className="Pagination_button Pagination_first"
            aria-label="첫 페이지"
            tooltip="첫 페이지로 이동"
          />
        )}
        
        {/* Previous page button */}
        {showPrevNext && (
          <Button
            text="이전"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="Pagination_button Pagination_prev"
            aria-label="이전 페이지"
            tooltip="이전 페이지로 이동"
          />
        )}
        
        {/* Page number buttons */}
        {showPageNumbers && (
          <div className="Pagination_numbers">
            {getPageNumbers().map((pageNumber, index) => (
              pageNumber === '...' ? (
                <span key={`ellipsis-${index}`} className="Pagination_ellipsis">...</span>
              ) : (
                <button
                  key={pageNumber}
                  className={`Pagination_number ${pageNumber === page ? 'Pagination_number_active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                  aria-label={`${pageNumber} 페이지`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              )
            ))}
          </div>
        )}
        
        {/* Next page button */}
        {showPrevNext && (
          <Button
            text="다음"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="Pagination_button Pagination_next"
            aria-label="다음 페이지"
            tooltip="다음 페이지로 이동"
          />
        )}
        
        {/* Last page button */}
        {showFirstLast && (
          <Button
            text="마지막"
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            className="Pagination_button Pagination_last"
            aria-label="마지막 페이지"
            tooltip="마지막 페이지로 이동"
          />
        )}
      </div>
      
      {/* Items per page selector */}
      {showItemsPerPageSelect && (
        <div className="Pagination_itemsPerPage">
          <label htmlFor="itemsPerPage">페이지당 항목 수:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="Pagination_select"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Page info */}
      <div className="Pagination_info" aria-live="polite">
        {totalItems > 0 ? (
          <span>
            전체 {totalItems}개 중 {Math.min((page - 1) * itemsPerPage + 1, totalItems)}-
            {Math.min(page * itemsPerPage, totalItems)}개 표시
          </span>
        ) : (
          <span>데이터가 없습니다</span>
        )}
      </div>
    </nav>
  );
};

export default Pagination;