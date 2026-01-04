import React, { ReactNode, MouseEvent } from "react";

// Shadcn/ui Button component with types
interface ButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
}
const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${className}`}
    aria-label={typeof children === "string" ? children : undefined}
    type="button"
  >
    {children}
  </button>
);

// Lucide icon (Search for not found) with types
interface IconProps {
  className?: string;
}
const Search: React.FC<IconProps> = ({ className }) => (
  <span className={className} role="img" aria-label="Search icon">
    🔍
  </span>
);

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full text-center shadow-lg hover:-translate-y-1 transition-transform">
        <Search className="h-16 w-16 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved. Try
          returning to the homepage or contact support if you need assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:from-blue-600 hover:to-blue-500"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => (window.location.href = "/support")}
            className="bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-700"
          >
            Contact Support
          </Button>
        </div>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Want to search?{" "}
          <a href="/search" className="text-blue-600 dark:text-blue-400 hover:underline">
            Try our search page
          </a>
        </p>
      </div>
    </div>
  );
};
