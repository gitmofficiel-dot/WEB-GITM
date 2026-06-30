import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}) => {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 my-8 rtl:space-x-reverse">
      <button
        onClick={() => onPageChange(1)}
        disabled={!hasPrevPage}
        className="p-2 rounded-lg glass-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500/20 transition-colors"
        aria-label="First page"
      >
        <ChevronsLeft className="w-5 h-5 rtl:rotate-180" />
      </button>
      
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="p-2 rounded-lg glass-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500/20 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
      </button>

      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-lg transition-colors ${
              currentPage === pageNum 
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold'
                : 'glass-card hover:bg-cyan-500/20'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="p-2 rounded-lg glass-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500/20 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5 rtl:rotate-180" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={!hasNextPage}
        className="p-2 rounded-lg glass-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500/20 transition-colors"
        aria-label="Last page"
      >
        <ChevronsRight className="w-5 h-5 rtl:rotate-180" />
      </button>
    </div>
  );
};

export default Pagination;
