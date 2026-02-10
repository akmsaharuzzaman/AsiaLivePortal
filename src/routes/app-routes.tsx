import { Roles } from "@/constants/route.enum";
import { DashboardPage } from "@/pages";
import AgencyById from "@/pages/AgencyById";
import { AgencyWithdrawHistoryPage } from "@/pages/AgencyWithdrawHistory";
import { BannedUsers } from "@/pages/BannedUsers";
import CountryAdmin from "@/pages/CountryAdmin";
import CountryAdminById from "@/pages/CountryAdminById";
import { CreateAgencyPage } from "@/pages/CreateAgency";
import { CreateCountryAdminPage } from "@/pages/CreateCountryAdmin";
import { CreateMerchantPage } from "@/pages/CreateMerchant";
import { CreateResellerPage } from "@/pages/CreateReseller";
import { CreateSubAdminPage } from "@/pages/CreateSubAdmin";
import { UpdateSubAdminPermissionsPage } from "@/pages/UpdateSubAdminPermissions";
import BannersPage from "@/pages/Banners";
import CreateBannerPage from "@/pages/CreateBanner";
import UpdateBannerPage from "@/pages/UpdateBanner";
import { GiftListsPage } from "@/pages/GiftLIsts";
import LiveListsPage from "@/pages/LiveLists";
import Merchant from "@/pages/Merchant";
import MerchantById from "@/pages/MerchantById";
import { PortalsTransactionHistoryPage } from "@/pages/PortalsTransactionHistory";
import SalaryManagementPage from "@/pages/SalaryManagement";
import { StoreManagement } from "@/pages/StoreManagement";
import SubAdmin from "@/pages/Sub-admin";
import SubAdminById from "@/pages/SubAdminById";
import { TransactionHistoryPage } from "@/pages/TransactionHistory";
import Users from "@/pages/Users";
import { WithdrawHistoryPage } from "@/pages/WithdrawHistory";
import { BannedLives } from "@/pages/BannedLives";
import { DiamondWithdraws } from "@/pages/DiamondWithdraws";
import { AssignedWithdrawals } from "@/pages/AssignedWithdrawals";
import { ClaimWithdrawals } from "@/pages/ClaimWithdrawals";

export const appRoutes = [
  {
    path: "/",
    element: <DashboardPage />,
    roles: [
      Roles.Admin,
      Roles.SubAdmin,
      Roles.Agency,
      Roles.Merchant,
      Roles.Reseller,
      Roles.CountryAdmin,
    ],
  },
  {
    path: "/agencies/:agencyId", // show hosts lists in table by agencyId
    element: <AgencyById />,
    roles: [Roles.Admin, Roles.SubAdmin, Roles.Agency],
  },
  // Admin and sub-admin's routes
  {
    path: "/sub-admins/:subAdminId", // show agency lists on table format by subAdminId
    element: <SubAdminById />,
    roles: [Roles.Admin, Roles.SubAdmin],
  },
  {
    path: "/users",
    element: <Users />,
    roles: [Roles.Admin, Roles.SubAdmin, Roles.CountryAdmin],
  },
  {
    path: "/create-agency/:subAdminId",
    element: <CreateAgencyPage backRoute={"/"} />,
    roles: [Roles.Admin, Roles.SubAdmin],
  },

  // Admin and Country-admin's routes
  {
    path: "/sub-country-admin/:countryAdminId", // show country-admin details by countryAdminId
    element: <CountryAdminById />,
    roles: [Roles.Admin, Roles.CountryAdmin],
  },
  {
    path: "/create-sub-admin",
    element: <CreateSubAdminPage backRoute={"/"} />,
    roles: [Roles.Admin],
  },
  {
    path: "/update-sub-admin-permissions",
    element: <UpdateSubAdminPermissionsPage backRoute={"/sub-admins"} />,
    roles: [Roles.Admin],
  },
  {
    path: "/create-merchant",
    element: <CreateMerchantPage backRoute={"/"} />,
    roles: [Roles.Admin],
  },
  {
    path: "/create-country-admin",
    element: <CreateCountryAdminPage backRoute={"/"} />,
    roles: [Roles.Admin],
  },
  {
    path: "/create-reseller/:merchantId",
    element: <CreateResellerPage backRoute={"/"} />,
    roles: [Roles.Admin],
  },
  {
    path: "/banners",
    element: <BannersPage />,
    roles: [Roles.Admin],
  },  
  {
    path: "/create-banner",
    element: <CreateBannerPage />,
    roles: [Roles.Admin],
  },
  {
    path: "/update-banner/:id",
    element: <UpdateBannerPage />,
    roles: [Roles.Admin],
  },
  {
    path: "/sub-admins",
    element: <SubAdmin />,
    roles: [Roles.Admin],
  },
  {
    path: "/merchants", // show all merchant
    element: <Merchant />,
    roles: [Roles.Admin],
  },
  {
    path: "/merchants/:merchantId", // show merchant details (reseller-list) by merchantId
    element: <MerchantById />,
    roles: [Roles.Admin],
  },
  {
    path: "/country-admin", // show all country-admin
    element: <CountryAdmin />,
    roles: [Roles.Admin],
  },
  {
    path: "/gifts",
    element: <GiftListsPage backRoute={"/"} />,
    roles: [Roles.Admin],
  },
  {
    path: "/withdraw-history",
    element: <WithdrawHistoryPage onBack={"/"} />,
    roles: [Roles.Admin, Roles.Agency],
  },
  {
    path: "/agency-withdraw-history",
    element: <AgencyWithdrawHistoryPage onBack={"/"} />,
    roles: [Roles.Admin],
  },
  // {
  //   path: "/host-withdraw-history",
  //   element: <HostsWithdrawHistoryPage onBack={"/"} />,
  //   roles: [Roles.Admin],
  // },
  {
    path: "/salary-management",
    element: <SalaryManagementPage />,
    roles: [Roles.Admin],
  },

  {
    path: "/transaction-history",
    element: <TransactionHistoryPage onBack={"/"} />,
    roles: [Roles.Admin],
  },
  {
    path: "/portals-transactions",
    element: <PortalsTransactionHistoryPage onBack={"/"} />,
    roles: [Roles.Merchant, Roles.Reseller],
  },
  {
    path: "/stores",
    element: <StoreManagement backRoute={"/"} />,
    roles: [Roles.Admin],
  },
  {
    path: "/live-lists",
    element: <LiveListsPage />,
    roles: [Roles.Admin],
  },
  {
    path: "/banned-lives",
    element: <BannedLives />,
    roles: [Roles.Admin, Roles.SubAdmin, Roles.CountryAdmin],
  },
  {
    path: "/banned-users",
    element: <BannedUsers />,
    roles: [Roles.Admin, Roles.SubAdmin, Roles.CountryAdmin],
  },
  {
    path: "/diamond-withdraws",
    element: <DiamondWithdraws />,
    roles: [Roles.Admin]
  },
  {
    path: "/assigned-withdrawals",
    element: <AssignedWithdrawals/>,
    roles: [ Roles.Merchant] // replace with merchant
  },
  {
    path: "/claim-withdrawals",
    element: <ClaimWithdrawals />,
    roles: [ Roles.Merchant]
  }
];
