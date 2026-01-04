import { IApp_LinkedButtonProps, TVariants } from "@/types/buttons";

export const AppButton = ({
  variant,
  onClick,
  label,
  icon,
}: IApp_LinkedButtonProps) => {
  const COLOR_VARIANT: Record<TVariants, string> = {
    primary:
      "bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white",
    secondary:
      "bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white",
    info: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200",
  };
  return (
    <button
      className={`w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r ${variant ? COLOR_VARIANT[variant] : COLOR_VARIANT.primary} rounded-lg shadow-sm transition-all hover:shadow-md group`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="bg-white/20 p-1.5 rounded-md">{icon && icon}</span>
        <span className="font-medium text-start">{label}</span>
      </div>
    </button>
  );
};
