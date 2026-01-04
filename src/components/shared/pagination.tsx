import React, { ReactNode, ButtonHTMLAttributes } from "react";

// Button component with proper types
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled,
  ...props
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md font-medium flex items-center justify-center ${className}`}
    disabled={disabled}
    aria-disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// Chevron icons with types
interface IconProps {
  className?: string;
}

const ChevronLeft: React.FC<IconProps> = ({ className }) => (
  <span className={className} role="img" aria-label="Previous page">
    ←
  </span>
);

const ChevronRight: React.FC<IconProps> = ({ className }) => (
  <span className={className} role="img" aria-label="Next page">
    →
  </span>
);

// Pagination props
interface PaginationProps {
  totalPages?: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const AppPagination: React.FC<PaginationProps> = ({
  totalPages = 10,
  currentPage,
  setCurrentPage,
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages: ReactNode[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 ${
            currentPage === i
              ? "pagination-btn-active"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
          aria-label={`Go to page ${i}`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-card flex items-center justify-between gap-2">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`pagination-btn w-10 h-10 ${
          currentPage === 1 ? "disabled" : ""
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="flex gap-2">{renderPageNumbers()}</div>
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`pagination-btn w-10 h-10 ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
