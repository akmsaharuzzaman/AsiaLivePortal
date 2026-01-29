export type TDiamondBankWithdraw = {
  _id: string;
  userId: string;
  country: string;
  method: string;
  diamondAmount: number;
  moneyshare: number;
  adminApproval: boolean;
  paidStatus: boolean;
  assignedMerchant?: string;
  createdAt: string;
  updatedAt: string;
};
