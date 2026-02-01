import { useEffect } from "react";
import { ClientRoutes, Roles } from "@/constants/route.enum";
import useLiveHosts from "@/hook/useLiveHosts";
import {
  useGetMidPortalManagementQuery,
  useGetPortalProfileQuery,
  useGetTopPortalManagementQuery,
  useGetUsersQuery,
  useLowerPortalManagementQuery,
} from "@/redux/api/power-shared";
import { useAppSelector } from "@/redux/hooks";

import { IApp_LinkedButtonProps } from "@/types/buttons";
import { ModalName, Role } from "@/types/pages/dashboard";
import {
  Ban,
  Coins,
  Diamond,
  DollarSign,
  Gamepad2,
  Gift,
  Store,
} from "lucide-react";
import { FC } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ActionGroupHead } from "./action-group-head";
import { StatusCard } from "./status-card";
import { DashboardActionItems } from "./action-items";

// Dashboard action button config
interface DashboardAction {
  label: string;
  category: string;
  icon: any;
  variant?: IApp_LinkedButtonProps["variant"];
  modal?: ModalName;
  link?: string;
}

// Dashboard card config
interface DashboardStat {
  label: string;
  value: number;
  hoverText: string;
  icon?: any;
  iconWrapper: string;
  bar: string;
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
  const {
    videoHosts,
    audioHosts,
    // errors,
    connected,
    requestVideoHosts,
    requestAudioHosts,
  } = useLiveHosts("anything.ofthe.id.565255");
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
    activeRooms: (videoHosts.length || 0) + (audioHosts.length || 0),
  };
  /**
   * dashboardConfigs: All dashboard stats, actions, and lists for each role.
   * This makes the dashboard fully config-driven and easy to extend.
   */
  const dashboardConfigs: Record<Role, DashboardConfig> = {
    admin: {
      stats: [
        {
          label: "Total Users",
          value: Number(staticStatesData?.users) || 0,
          hoverText: "group-hover:text-primary",
          icon: "group",
          iconWrapper: "text-purple-600 dark:text-purple-400",
          bar: "bg-primary",
          link: ClientRoutes.Users,
        },
        {
          label: "Total Sub-Admins",
          value: staticStatesData?.subAdmins || 0,
          hoverText: "group-hover:text-blue-500",
          icon: "admin_panel_settings",
          iconWrapper: "text-blue-600 dark:text-blue-400",
          bar: "bg-blue-500",
          link: ClientRoutes.SubAdmins,
        },
        {
          label: "Total Merchants",
          value: staticStatesData?.merchants || 0,
          hoverText: "group-hover:text-green-500",
          icon: "storefront",
          iconWrapper: "text-green-600 dark:text-green-400",
          bar: "bg-green-500",
          link: ClientRoutes.Merchants,
        },
        {
          label: "Country Admins",
          value: staticStatesData?.countryAdmins || 0,
          hoverText: "group-hover:text-orange-500",
          icon: "public",
          iconWrapper: "text-orange-600 dark:text-orange-400",
          bar: "bg-orange-500",
          link: ClientRoutes.CountryAdmins,
        },
        {
          label: "Active Live",
          value: staticStatesData?.activeRooms || 0,
          hoverText: "group-hover:text-red-500",
          icon: "live_tv",
          iconWrapper: "text-red-600 dark:text-red-400",
          bar: "bg-red-500",
          link: ClientRoutes.Rooms,
        },
        // {
        //   label: "Total Resellers",
        //   value: staticStatesData.totalReseller || 0,
        //   hoverText: "group-hover:text-red-500",
        //   icon: "live_tv",
        //   iconWrapper: "text-red-600 dark:text-red-400",
        //   bar: "bg-red-500",
        //   link: ClientRoutes.Resellers,
        // },
        // {
        //   title: "Total Users",
        //   value: staticStatesData?.users || 0,
        //   link: ClientRoutes.Users,
        // },
        // {
        //   title: "Total Sub-Admins",
        //   value: staticStatesData?.subAdmins || 0,
        //   link: ClientRoutes.SubAdmins,
        // // },
        // // {
        // //   title: "Total Agencies",
        // //   value: staticStatesData.totalAgency || 0, // after added new theme on site then will commt thiss totally
        // //   link: ClientRoutes.Agencies,
        // // },
        // {
        //   title: "Total Merchants",
        //   value: staticStatesData?.merchants || 0,
        //   link: ClientRoutes.Merchants,
        // },
        // {
        //   title: "Total Country Admins",
        //   value: staticStatesData?.countryAdmins || 0,
        //   link: ClientRoutes.CountryAdmins,
        // },
        // {
        //   title: "Active Live",
        //   value: staticStatesData?.activeRooms || 0,
        //   link: ClientRoutes.Rooms,
        // },
        // {
        //   title: "Total Resellers",
        //   value: staticStatesData.totalReseller || 0,
        //   link: ClientRoutes.Resellers,
        // },
      ],
      actions: [
        {
          label: "Sell Coin to Merchant",
          category: "coins",
          icon: <Coins className="w-4 h-4" />,
          variant: "primary",
          modal: "sellCoinToMerchant",
        },
        {
          label: "Agnecy Withdrawals",
          category: "history",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "secondary",
          link: ClientRoutes.AgencyWithdrawHistory,
        },
        {
          label: "Bank Withdrawals",
          category: "history",
          icon: <Diamond className="w-4 h-4" />,
          variant: "secondary",
          link: ClientRoutes.DiamondWithdraws,
        },
        {
          label: "Host Withdrawals",
          category: "history",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "info",
          link: ClientRoutes.hostWithdrawHistory,
        },
        {
          label: "Coin Transactions",
          category: "history",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "info",
          link: ClientRoutes.TransactionHistory,
        },
        {
          label: "Add Coin",
          category: "coins",
          icon: <Coins className="w-4 h-4" />,
          variant: "info",
          modal: "addCoin",
        },
        {
          label: "Salary",
          category: "management",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "secondary",
          link: ClientRoutes.SalaryManagement,
        },

        {
          label: "Gifts",
          category: "management",
          icon: <Gift className="w-4 h-4" />,
          variant: "info",
          link: ClientRoutes.Gifts,
        },
        {
          label: "Greedy Panel",
          category: "tools",
          icon: <Gamepad2 className="w-5 h-5 text-sky-400" />,
          variant: "secondary",
          link: ClientRoutes.GreedyGameDashboardPanel,
        },
        {
          label: "Teen Patti Panel",
          category: "tools",
          icon: <Gamepad2 className="w-5 h-5 text-sky-400" />,
          variant: "secondary",
          link: ClientRoutes.TinPattiGameDashboardPanel,
        },
        {
          label: "Stores",
          category: "management",
          icon: <Store className="w-4 h-4" />,
          variant: "info",
          link: ClientRoutes.StoreManagement,
        },
        {
          label: "Banned Users",
          category: "tools",
          icon: <Ban className="w-4 h-4 text-red-500" />,
          variant: "secondary",
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
          label: "Total Users",
          value: Number(staticStatesData?.users) || 0,
          link: ClientRoutes.Users,
          hoverText: "group-hover:text-red-500",
          // icon: "live_tv",
          iconWrapper:
            "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
          bar: "bg-red-500",
        },
        {
          label: "Total Agencies",
          value: Number(staticStatesData?.agencies), //TODO: staticStatesData?.agencies || 0,
          link: `${ClientRoutes.SubAdmins}/${user?.id}`,
          hoverText: "group-hover:text-green-500",
          icon: "storefront",
          iconWrapper:
            "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
          bar: "bg-green-500",
        },
        // {
        //   title: "Total Agencies",
        //   value: staticStatesData?.agencies, //TODO: staticStatesData?.agencies || 0,
        //   link: `${ClientRoutes.SubAdmins}/${user?.id}`,
        // },

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
        {
          label: "Current Salary",
          value: salary,
          hoverText: "group-hover:text-red-500",
          // icon: "live_tv",
          iconWrapper:
            "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
          bar: "bg-red-500",
        },
        {
          label: "Total Hosts",
          value: isHostLoading ? 0 : hosts || 0,
          link: `${ClientRoutes.Agencies}/${user?.id}`,
          hoverText: "group-hover:text-red-500",
          // icon: "live_tv",
          iconWrapper:
            "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
          bar: "bg-red-500",
        },
        // { title: "Current Salary", value: salary }, // TOD: here add the api response. not static data
        // {
        //   title: "Total Hosts",
        //   value: isHostLoading ? "..." : hosts || 0,
        //   link: `${ClientRoutes.Agencies}/${user?.id}`,
        // },
      ],
      actions: [
        // { label: "Create Host", icon: UserPlus, modal: "createHost" },
        {
          label: "Withdraw History",
          category: "history",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "primary",
          link: ClientRoutes.WithdrawHistory,
        },
        {
          label: "Create Host",
          category: "history",
          icon: <Coins className="w-4 h-4" />,
          variant: "secondary",
          modal: "createHost",
        },
        {
          label: "Withdraw Apply",
          category: "history",
          icon: <Coins className="w-4 h-4" />,
          variant: "secondary",
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
          category: "history",
          icon: <Coins className="w-4 h-4" />,
          variant: "primary",
          modal: "sellCoinToReseller",
        },
        {
          label: "Sell Coin to User",
          category: "history",
          icon: <Coins className="w-4 h-4" />,
          variant: "secondary",
          modal: "sellCoinToUser",
        },
        {
          label: "Coin Transaction History",
          category: "history",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "secondary",
          link: ClientRoutes.PortalsTransactions,
        },
        {
          label: "Assigned Withdrawals",
          category: "diamond-withdrawals",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "secondary",
          link: ClientRoutes.AssignedWithdrawals,
        },
        {
          label: "Claim Withdrawals",
          category: "diamond-withdrawals",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "secondary",
          link: ClientRoutes.ClaimWithdrawals,
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
        {
          label: "Available Reseller Coins",
          value: 0,
          hoverText: "group-hover:text-red-500",
          // icon: "live_tv",
          iconWrapper:
            "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
          bar: "bg-red-500",
        },
        // { title: "Available Reseller Coins", value: 0 }, //TODO: add the value from the api
        // { title: "Total Earning", value: "$1,250" },
      ],
      actions: [
        {
          label: "Sell Coin to User",
          category: "coins",
          icon: <Coins className="w-4 h-4" />,
          variant: "primary",
          modal: "sellCoinToUser",
        },
        {
          label: "Coin Transaction History",
          category: "coins",
          icon: <DollarSign className="w-4 h-4" />,
          variant: "secondary",
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
    name: stat.label,
    value: stat.value,
  }));

  // when connected, automatically request latest hosts (safe to call repeatedly)
  useEffect(() => {
    if (!connected) return;
    // request current lists after connect
    requestVideoHosts();
    requestAudioHosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);
  return (
    <div>
      {/* Stats Cards */}
      {/*<div
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
      </div>*/}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {config?.stats?.map((card, index) => (
          <StatusCard
            key={index}
            label={card.label}
            value={card.value}
            hoverText={card.hoverText}
            icon={card.icon}
            iconWrapper={card.iconWrapper}
            bar={card.bar}
            link={card.link!}
          />
        ))}
      </section>
      {/* Action Buttons */}
      <DashboardActionItems actions={config?.actions} openModal={openModal} />
      {/*<div className="flex flex-wrap gap-4 mb-8">
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
      </div>*/}
      {/*{role === Roles.Admin && (
          <Link to={ClientRoutes.Gifts}>
            <ActionTinyButton variant="info">
              <Gift size={16} className="mr-2" />
              Manage Gifts
            </ActionTinyButton>
          </Link>
        )}*/}
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
      <div className="rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8 w-full">
        <ActionGroupHead title={"Statistics Overview"}>
          {/*<h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
          Statistics Overview
        </h3>*/}
          <div className="w-full h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ActionGroupHead>
      </div>
    </div>
  );
};
