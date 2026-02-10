import { ModalDialog } from "@/components/dialog/modal-dialog";
import { AddCoinForm } from "@/components/forms/add-coin-form";
import { CreateHostForm } from "@/components/forms/create-host-form";
import { SellCoinForm } from "@/components/forms/sell-coin-form";
import { SellCoinToMerchantForm } from "@/components/forms/sell-coin-to-merchant-form";
import { SellCoinToResellerForm } from "@/components/forms/sell-coin-to-reseller";
import { WithdrawApplyForm } from "@/components/forms/withdraw-apply-form";

import { DashboardContent } from "@/components/pages/dashboard/dashboard";
import { RoleContext } from "@/provider/role-provider";
import { ModalContentConfig, ModalName } from "@/types/pages/dashboard";
import { FC, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

/**
 * modalContentConfig: All modal titles and content for each modal action.
 * Replace <p>...</p> with your actual forms/components as needed.
 */
const modalContentConfig: Record<ModalName, ModalContentConfig> = {
  sellCoin: {
    title: "Sell Coin",
    description: "Send coins to Merchant.",
    content: <SellCoinForm />,
  },
  sellCoinToUser: {
    title: "Sell Coin",
    description: "Send coins to User.",
    content: <SellCoinForm />,
  },

  sellCoinToMerchant: {
    title: "Sell Coin to Merchantd",
    description: "Send coins to Merchant.",
    content: <SellCoinToMerchantForm />,
  },
  sellCoinToReseller: {
    title: "Sell Coin to Reseller",
    description: "Send coins to Reseller.",
    content: <SellCoinToResellerForm />,
  },
  addCoin: {
    title: "Add Coin",
    description: "Add coins to self.",
    content: <AddCoinForm />,
  },
  createHost: {
    title: "Create Host",
    description: "Create host with updating permissions.",
    content: <CreateHostForm />,
  },
  withdrawApplyForm: {
    title: "Withdraw Apply",
    description: "Create withdraw for request salary.",
    content: <WithdrawApplyForm />,
  },
  removePermissions:{
    title: "Remove Permissions",
    description: "Remove permissions from a user.",
    content: <p>Remove permissions form goes here.</p>,
  }
  // createSubAdmin: {
  //   title: "Create Sub-Admin",
  //   content: <CreateSubAdmin />,
  // },
  // createMerchant: {
  //   title: "Create Merchant",
  //   content: <CreateMerchantForm />,
  // },
  // createReseller: {
  //   title: "Create Reseller",
  //   content: <CreateReselerForm />,
  // },
  // createAgency: {
  //   title: "Create Agency",
  //   content: <CreateAgencyForm />,
  // },
  // createHost: {
  //   title: "Create Host",
  //   content: <CreateHostForm />,
  // },
  // removeHost: {
  //   title: "Remove Host",
  //   content: <RemoveHostForm />,
  // },
  // blockUser: {
  //   title: "Block User",
  //   content: <BlockUserForm />,
  // },
  // blockedUsers: {
  //   title: "Blocked Users",
  //   content: <p>List of blocked users.</p>,
  // },
  // history: {
  //   title: "Transaction History",
  //   content: <p>Display coin send and receive history.</p>,
  // },
};
export const DashboardPage: FC = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("DashboardPage must be used within a RoleProvider");
  }
  const { role } = context;
  const [activeModal, setActiveModal] = useState<ModalName | null>(null);

  // Open/close modal handlers
  const closeModal = () => setActiveModal(null);
  const openModal = (modalName: ModalName) => setActiveModal(modalName);

  // Get modal content for the current modal
  const modalConfig = activeModal ? modalContentConfig[activeModal] : null;

  return (
    <>
      <DashboardContent role={role} openModal={openModal} />

      {/* Modal for actions */}
      <ModalDialog
        isOpen={!!activeModal}
        onClose={closeModal}
        title={modalConfig?.title || ""}
        description={modalConfig?.description}
      >
        {modalConfig?.content}
      </ModalDialog>
      <Outlet />
    </>
  );
};

/**
 * App: Main dashboard app. Handles role switching, modal state, and renders dashboard.
 * - Role-based logic is handled by dashboardConfigs and Dashboard component.
 * - Modal content is config-driven for easy extension.
 */

// =========================
// 7. Explanations
// =========================
//
// - All UI is config-driven: stats, actions, and lists for each role are defined in dashboardConfigs.
// - The Dashboard component is fully reusable for any role, just by changing the config.
// - Modal content is also config-driven, so adding new modals is easy and type-safe.
// - All components are typed and reusable, with clear prop interfaces.
// - Role-based logic is handled by switching the config and rendering accordingly.
// - This approach makes the dashboard easy to extend, maintain, and test.
