import { IApp_LinkedButtonProps, TVariants } from "@/types/buttons";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";



export const LinkedButton = ({ variant, link, label, icon }: IApp_LinkedButtonProps) => {
  const COLOR_VARIANT: Record<TVariants, string> = {
    primary:
      "bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white",
    secondary:
      "bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white",
    "info":
      "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200",
  };
  return (
    <Link
      to={link ? link : "#"}
      className={`w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r ${variant ? COLOR_VARIANT[variant] : COLOR_VARIANT.primary} rounded-lg shadow-sm transition-all hover:shadow-md group`}
    >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <span className="material-symbols-outlined text-gray-500 text-sm group-hover:translate-x-1 transition-transform group-hover:text-gray-300">
          <ChevronRight />
        </span>
    </Link>
  );
};
