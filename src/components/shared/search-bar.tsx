import { UserSearch } from "lucide-react";
import React, { Dispatch } from "react";

export const SearchBar = ({
  // value,
  onChange,
  placeholder = "Search users by name, email or uid...",
}: {
  // value: string;
  onChange: Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem(
      "search_user"
    ) as HTMLInputElement | null;
    onChange(input?.value || "");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center"
    >
      <input
        type="text"
        name="search_user"
        placeholder={placeholder}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-80 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <button
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        type="submit"
      >
        <UserSearch />
      </button>
    </form>
  );
};
