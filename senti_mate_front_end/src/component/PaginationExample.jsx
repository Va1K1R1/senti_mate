import React, { useState } from "react";
import Pagination from "./Pagination";

/**
 * Example component demonstrating the usage of the Pagination component
 */
const PaginationExample = () => {
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);
  
  // Example data (could be any list of items)
  const totalItems = 87;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calculate which items to display based on current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // In a real application, you would fetch data for the new page here
    console.log(`Fetching data for page ${page}`);
  };
  
  return (
    <div className="PaginationExample">
      <h2>Pagination Example</h2>
      
      {/* Display current page information */}
      <div className="page-info">
        <p>
          Showing items {startIndex + 1}-{endIndex} of {totalItems}
        </p>
        <p>Page {currentPage} of {totalPages}</p>
      </div>
      
      {/* Example content - in a real app, this would be your actual list of items */}
      <div className="example-content">
        <ul>
          {Array.from({ length: endIndex - startIndex }, (_, i) => (
            <li key={startIndex + i}>Item {startIndex + i + 1}</li>
          ))}
        </ul>
      </div>
      
      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        siblingCount={1}
      />
      
      {/* Additional example with more siblings */}
      <h3>With more page numbers visible (siblingCount=2)</h3>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        siblingCount={2}
      />
    </div>
  );
};

export default PaginationExample;