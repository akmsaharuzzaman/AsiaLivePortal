import { ReactNode } from "react";

// All possible roles in the dashboard
export type Role = "admin" | "sub-admin" | "agency" | "merchant" | "re-seller" | "country-admin";

// Modal names for actions
// Extend this as you add more modals
export type ModalName =
  | "sellCoin"
  | "addCoin"
  | "sellCoinToUser"
  | "sellCoinToMerchant"
  | "sellCoinToReseller"
  | "createHost"
  | "withdrawApplyForm";
// | "createSubAdmin"
// | "createMerchant"
// | "createReseller"
// | "createAgency"
// | "createHost"
// | "removeHost"
// | "blockUser"
// | "blockedUsers"
// | "history";

// Modal content config
export interface ModalContentConfig {
  title: string;
  description?: string;
  content: ReactNode;
}
