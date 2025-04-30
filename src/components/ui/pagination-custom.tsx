import React from "react";
// import PropTypes from "prop-types";

import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}) => {
  const visiblePages = 5; // Maximum number of visible page links
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = startPage + visiblePages - 1;

  // Adjust startPage and endPage if they exceed boundaries
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  // Generate an array of page numbers
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="mt-4 flex items-center justify-center space-x-2">
        <nav>
          <ul className="flex items-center space-x-2">
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <div className="flex cursor-pointer items-center justify-center space-x-2 rounded-md px-3 py-1.5 ">
                  <ChevronLeft className="text-black" />
                  <div className="text-black font-semibold">
                    <p>Previous</p>
                  </div>
                </div>
              </button>
            </li>

            {/* First Page Link (if not in range) */}
            {startPage > 1 && (
              <>
                <li className="page-item">
                  <button className="page-link" onClick={() => onPageChange(1)}>
                    1
                  </button>
                </li>
                {startPage > 2 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
              </>
            )}

            {/* Visible Page Links */}
            {pageNumbers.map((number) => (
              <li
                key={number}
                className={`flex h-10 w-10 items-center justify-center rounded-md font-semibold ${
                  currentPage === number
                    ? "border border-gray-300 text-black"
                    : "bg-transparent text-slate-400"
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(number)}
                >
                  {number}
                </button>
              </li>
            ))}

            {/* Last Page Link (if not in range) */}
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            {/* Next Button */}
            <li
              className={`page-item ${
                currentPage === totalPages && "disabled"
              }`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <div className="flex cursor-pointer items-center justify-center space-x-2 rounded-md  px-3 py-1.5 ">
                  <div className="text-black font-semibold">
                    <p>Next</p>
                  </div>
                  <ChevronRight className="text-black" />
                </div>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

// Type-checking with PropTypes
// Pagination.propTypes = {
//   currentPage: PropTypes.number.isRequired,
//   totalPages: PropTypes.number.isRequired,
//   totalElements: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
// };

export default Pagination;
