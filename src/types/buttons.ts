import { ReactNode } from "react";

// Props for Button
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "info";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export type TVariants = "primary" | "secondary" | "info";
export interface IApp_LinkedButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: TVariants;
  className?: string;
  btn_type?: "button" | "submit";
  disabled?: boolean;
  link?: any;
  label: string;
  icon?: any;
}
