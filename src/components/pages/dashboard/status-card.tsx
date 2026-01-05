import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type TStatusCardProps = {
  label: string;
  value: number;
  hoverText: string;
  icon: any;
  iconWrapper: any;
  bar: string;
  link: string;
}
export const StatusCard = ({
  label,
  value,
  hoverText,
  iconWrapper,
  bar,
  link,
}:TStatusCardProps) => {
  return (
    <Link
      to={link}
      className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <h3
            className={`text-3xl font-bold mt-1 transition-colors ${hoverText}`}
          >
            {value}
          </h3>
        </div>
        <span className={`p-2 rounded-lg ${iconWrapper}`}>
          <ChevronRight />
        </span>
      </div>
      <a
        href="#"
        className={`absolute bottom-0 left-0 w-full h-1 ${bar} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
      />
    </Link>
  );
};
