import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { DashboardCard } from "@/components/cards/dashboard-card";
import { ClientRoutes, Roles } from "@/constants/route.enum";
import { UseSocket } from "@/hook/useSocket";
import {
  useGetMidPortalManagementQuery,
  useGetPortalProfileQuery,
  useGetTopPortalManagementQuery,
  useGetUsersQuery,
  useLowerPortalManagementQuery,
} from "@/redux/api/power-shared";
import { useAppSelector } from "@/redux/hooks";

import { ButtonProps } from "@/types/buttons";
import { ModalName, Role } from "@/types/pages/dashboard";
import {
  Ban,
  Coins,
  DollarSign,
  Gamepad2,
  Gift,
  LucideIcon,
  Store,
} from "lucide-react";
import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Dashboard action button config
interface DashboardAction {
  label: string;
  icon: LucideIcon;
  variant?: ButtonProps["variant"];
  modal?: ModalName;
  link?: string;
}

// Dashboard card config
interface DashboardStat {
  title: string;
  value: ReactNode;
  link?: string;
}

// Dashboard config for each role
interface DashboardConfig {
  stats: DashboardStat[];
  actions: DashboardAction[];
  lists?: { title: string; emptyText: string }[];
}

/**
 * Dashboard: Renders the dashboard for the current role using config.
 * This is fully reusable for any role.
 */
export const DashboardContent: FC<{
  role: Role;
  openModal: (modal: ModalName) => void;
}> = ({ role, openModal }) => {
  // fetching data from server
  const user = useAppSelector((state) => state.auth.user);
  const { data: usersRes, isLoading: usersLoading } = useGetUsersQuery({
    page: 1,
    limit: 99999,
  });
  // const { data: statsDataRes, isLoading } = useGetDashboardStatsQuery();
  const { data: portalProfileRes, isLoading: portalIsLoading } =
    useGetPortalProfileQuery();
  const { data: hostsRes, isLoading: isHostLoading } =
    useLowerPortalManagementQuery({
      // type: Roles.Host,
      id: user!.id!,
    });
  const { data: agencyRes, isLoading: agencyLoading } =
    useGetMidPortalManagementQuery({
      type: Roles.Agency,
      id: user!.id!,
    });
  const { data: subAdminRes, isLoading: subAdminLoading } =
    useGetTopPortalManagementQuery({
      type: Roles.SubAdmin,
      // id: user!.id!,
    });

  const { data: merchantRes, isLoading: merchantLoading } =
    useGetTopPortalManagementQuery({
      type: Roles.Merchant,
      // id: user!.id!,
    });
  const { data: countryAdminRes, isLoading: countryAdminLoading } =
    useGetTopPortalManagementQuery({
      type: Roles.CountryAdmin,
      // id: user!.id!,
    });
  const { audioData: activeRooms } = UseSocket();
  console.dir(activeRooms);
  console.dir("dir");
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error occurred: {(error as any).message}</div>;

  // top level users count
  const users = usersLoading ? "..." : usersRes?.result?.pagination.total || 0;
  const subAdmins = subAdminLoading
    ? 0
    : subAdminRes?.result?.pagination.total || 0;
  const merchants = merchantLoading
    ? 0
    : merchantRes?.result?.pagination.total || 0;
  const countryAdmins = countryAdminLoading
    ? 0
    : countryAdminRes?.result?.pagination.total || 0;
  const hosts = portalIsLoading ? 0 : hostsRes?.result?.users?.length || 0;
  const salary = portalIsLoading ? 0 : portalProfileRes?.result?.coins || 0;

  const agencies = agencyLoading ? "..." : agencyRes?.result?.data.length || 0;
  console.log(salary, "hosts length");

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // const staticStatesData = statsDataRes?.result;
  const staticStatesData = {
    users,
    hosts,
    agencies,
    subAdmins,
    merchants,
    countryAdmins,
    activeRooms: activeRooms ? activeRooms.audio.length : 0,
  };
  console.log(staticStatesData.activeRooms, "SSS");
  /**
   * dashboardConfigs: All dashboard stats, actions, and lists for each role.
   * This makes the dashboard fully config-driven and easy to extend.
   */
  const dashboardConfigs: Record<Role, DashboardConfig> = {
    admin: {
      stats: [
        {
          title: "Total Users",
          value: staticStatesData?.users || 0,
          link: ClientRoutes.Users,
        },
        {
          title: "Total Sub-Admins",
          value: staticStatesData?.subAdmins || 0,
          link: ClientRoutes.SubAdmins,
        },
        // {
        //   title: "Total Agencies",
        //   value: staticStatesData.totalAgency || 0,
        //   link: ClientRoutes.Agencies,
        // },
        {
          title: "Total Merchants",
          value: staticStatesData?.merchants || 0,
          link: ClientRoutes.Merchants,
        },
        {
          title: "Total Country Admins",
          value: staticStatesData?.countryAdmins || 0,
          link: ClientRoutes.CountryAdmins,
        },
        {
          title: "Active Live",
          value: staticStatesData?.activeRooms || 0,
          link: ClientRoutes.Rooms,
        },
        // {
        //   title: "Total Resellers",
        //   value: staticStatesData.totalReseller || 0,
        //   link: ClientRoutes.Resellers,
        // },
      ],
      actions: [
        {
          label: "Sell Coin to Merchant",
          icon: Coins,
          variant: "success",
          modal: "sellCoinToMerchant",
        },
        {
          label: "Agnecy Withdraw History",
          icon: DollarSign,
          variant: "primary",
          link: ClientRoutes.AgencyWithdrawHistory,
        },
        {
          label: "Host Withdraw History",
          icon: DollarSign,
          variant: "primary",
          link: ClientRoutes.hostWithdrawHistory,
        },
        {
          label: "Coin Transaction History",
          icon: DollarSign,
          variant: "primary",
          link: ClientRoutes.TransactionHistory,
        },
        {
          label: "Add Coin",
          icon: Coins,
          variant: "success",
          modal: "addCoin",
        },
        {
          label: "Salary Management",
          icon: DollarSign,
          variant: "primary",
          link: ClientRoutes.SalaryManagement,
        },

        {
          label: "Manage Gifts",
          icon: Gift,
          variant: "info",
          link: ClientRoutes.Gifts,
        },
        {
          label: "Greedy   Game Admin Panel",
          icon: Gamepad2,
          variant: "secondary",
          link: ClientRoutes.GreedyGameDashboardPanel,
        },
        {
          label: "Stores Management",
          icon: Store,
          variant: "primary",
          link: ClientRoutes.StoreManagement,
        },
        {
          label: "Banned Users",
          icon: Ban,
          variant: "danger",
          link: ClientRoutes.BannedUsers,
        },

        // { label: "Create Sub-Admin", icon: UserPlus, modal: "createSubAdmin" },
        // { label: "Create Merchant", icon: Store, modal: "createMerchant" },
        // { label: "Create Reseller", icon: UserCog, modal: "createReseller" },
        // {
        //   label: "Block User",
        //   icon: UserX,
        //   variant: "danger",
        //   modal: "blockUser",
        // },
        // {
        //   label: "History",
        //   icon: History,
        //   variant: "secondary",
        //   modal: "history",
        // },
        // {
        //   label: "Blocked Users",
        //   icon: ListX,
        //   variant: "secondary",
        //   modal: "blockedUsers",
        // },
      ],
      lists: [
        { title: "User List", emptyText: "User data would appear here." },
        {
          title: "Sub-Admin List",
          emptyText: "Sub-admin data would appear here.",
        },
      ],
    },
    "sub-admin": {
      stats: [
        {
          title: "Total Users",
          value: staticStatesData?.users || 0,
          link: ClientRoutes.Users,
        },
        {
          title: "Total Agencies",
          value: staticStatesData?.agencies, //TODO: staticStatesData?.agencies || 0,
          link: `${ClientRoutes.SubAdmins}/${user?.id}`,
        },
        // {
        //   title: "Total Agencies",
        //   value: staticStatesData.totalAgency,
        //   link: ClientRoutes.Agencies,
        // },
        // {
        //   title: "Total Resellers",
        //   value: staticStatesData.totalReseller,
        //   link: ClientRoutes.Resellers,
        // },
      ],
      actions: [
        // {
        //   label: "Sell Coin",
        //   icon: Coins,
        //   variant: "success",
        //   modal: "sellCoin",
        // },
        // { label: "Create Agency", icon: Building, modal: "createAgency" },
        // {
        //   label: "Block User",
        //   icon: UserX,
        //   variant: "danger",
        //   modal: "blockUser",
        // },
        // {
        //   label: "History",
        //   icon: History,
        //   variant: "secondary",
        //   modal: "history",
        // },
      ],
      lists: [
        { title: "User List", emptyText: "User data would appear here." },
      ],
    },
    agency: {
      stats: [
        { title: "Current Salary", value: salary }, // TOD: here add the api response. not static data
        {
          title: "Total Hosts",
          value: isHostLoading ? "..." : hosts || 0,
          link: `${ClientRoutes.Agencies}/${user?.id}`,
        },
      ],
      actions: [
        // { label: "Create Host", icon: UserPlus, modal: "createHost" },
        {
          label: "Withdraw History",
          icon: DollarSign,
          variant: "info",
          link: ClientRoutes.WithdrawHistory,
        },
        {
          label: "Create Host",
          icon: Coins,
          variant: "primary",
          modal: "createHost",
        },
        {
          label: "Withdraw Apply",
          icon: Coins,
          variant: "primary",
          modal: "withdrawApplyForm",
        },
      ],
      lists: [
        { title: "Host List", emptyText: "Host data would appear here." },
      ],
    },
    merchant: {
      stats: [
        // {
        //   title: "Total Resellers",
        //   value: staticStatesData.totalReseller,
        //   link: ClientRoutes.Resellers,
        // },
      ],
      actions: [
        {
          label: "Sell Coin to Reseller",
          icon: Coins,
          variant: "success",
          modal: "sellCoinToReseller",
        },
        {
          label: "Sell Coin to User",
          icon: Coins,
          variant: "success",
          modal: "sellCoinToUser",
        },
        {
          label: "Coin Transaction History",
          icon: DollarSign,
          variant: "primary",
          link: ClientRoutes.PortalsTransactions,
        },
        // { label: "Create Reseller", icon: UserCog, modal: "createReseller" },
        // {
        //   label: "History",
        //   icon: History,
        //   variant: "secondary",
        // modal: "history",
        // },
      ],
      lists: [
        {
          title: "Reseller List",
          emptyText: "Reseller data would appear here.",
        },
      ],
    },
    "re-seller": {
      stats: [
        { title: "Available Reseller Coins", value: 0 }, //TODO: add the value from the api
        // { title: "Total Earning", value: "$1,250" },
      ],
      actions: [
        {
          label: "Sell Coin to User",
          icon: Coins,
          variant: "success",
          modal: "sellCoinToUser",
        },
        {
          label: "Coin Transaction History",
          icon: DollarSign,
          variant: "primary",
          link: ClientRoutes.PortalsTransactions,
        },
        // {
        //   label: "History",
        //   icon: History,
        //   variant: "secondary",
        //   modal: "history",
        // },
      ],
      // No lists for re-seller
    },
  };
  const config = dashboardConfigs[role];
  // Prepare data for the chart
  const chartData = dashboardConfigs[role]?.stats?.map((stat) => ({
    name: stat.title,
    value: stat.value,
  }));
  return (
    <div>
      {/* Stats Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
          role === Roles.Admin ? "xl:grid-cols-5" : ""
        } gap-6 mb-8`}
      >
        {config?.stats?.map((stat) => (
          <DashboardCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            link={stat.link}
          />
        ))}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        {config?.actions?.map((action) => {
          if (action.link) {
            return (
              <Link to={action.link} key={action.label}>
                <ActionTinyButton variant={action.variant || "primary"}>
                  <action.icon size={16} className="mr-2" />
                  {action.label}
                </ActionTinyButton>
              </Link>
            );
          }
          return (
            <ActionTinyButton
              key={action.label}
              variant={action.variant}
              onClick={() => openModal(action.modal!)}
            >
              <action.icon size={16} className="mr-2" />
              {action.label}
            </ActionTinyButton>
          );
        })}

        {/*{role === Roles.Admin && (
          <Link to={ClientRoutes.Gifts}>
            <ActionTinyButton variant="info">
              <Gift size={16} className="mr-2" />
              Manage Gifts
            </ActionTinyButton>
          </Link>
        )}*/}
      </div>
      {/* Data Lists (if any) */}
      {/* {config.lists && (
        <div className={config.lists.length > 1 ? "space-y-8" : undefined}>
          {config.lists.map((list) => (
            <div key={list.title} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">{list.title}</h2>
              <div className="text-center py-4 text-gray-500">
                {list.emptyText}
              </div>
            </div>
          ))}
        </div>
      )} */}
      {/* Visual Graph */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8 w-full">
        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
          Statistics Overview
        </h3>
        <div className="w-full h-[200px] md:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
