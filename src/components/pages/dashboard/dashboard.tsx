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
    ArrowLeftRight,
  Ban,
  ChevronRight,
  Coins,
  CreditCard,
  DollarSign,
  Gamepad2,
  Gift,
  History as HistoryIcon,
  LucideIcon,
  PlusCircle,
  Receipt,
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
  const { audioData, videoHosts } = UseSocket();
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
    activeRooms: (audioData?.audio?.length || 0) + (videoHosts?.hosts?.length || 0),
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
            label: "Total Users",
            value: "1,412",
            hoverText: "group-hover:text-primary",
            icon: "group",
            iconWrapper: "text-purple-600 dark:text-purple-400",
            bar: "bg-primary",
          },
          {
            label: "Total Sub-Admins",
            value: "6",
            hoverText: "group-hover:text-blue-500",
            icon: "admin_panel_settings",
            iconWrapper: "text-blue-600 dark:text-blue-400",
            bar: "bg-blue-500",
          },
          {
            label: "Total Merchants",
            value: "3",
            hoverText: "group-hover:text-green-500",
            icon: "storefront",
            iconWrapper: "text-green-600 dark:text-green-400",
            bar: "bg-green-500",
          },
          {
            label: "Country Admins",
            value: "0",
            hoverText: "group-hover:text-orange-500",
            icon: "public",
            iconWrapper: "text-orange-600 dark:text-orange-400",
            bar: "bg-orange-500",
          },
          {
            label: "Active Live",
            value: "0",
            hoverText: "group-hover:text-red-500",
            icon: "live_tv",
            iconWrapper: "text-red-600 dark:text-red-400",
            bar: "bg-red-500",
          },
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
           label: "Total Users",
           value: staticStatesData?.users || 0,
           link: ClientRoutes.Users,
           hoverText: "group-hover:text-red-500",
           // icon: "live_tv",
           iconWrapper: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
           bar: "bg-red-500",
         },
         {
            label: "Total Agencies",
            value: staticStatesData?.agencies, //TODO: staticStatesData?.agencies || 0,
            link: `${ClientRoutes.SubAdmins}/${user?.id}`,
            hoverText: "group-hover:text-green-500",
            icon: "storefront",
            iconWrapper: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
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
           iconWrapper: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
           bar: "bg-red-500",
         },
         {
            label: "Total Hosts",
            value: isHostLoading ? "..." : hosts || 0,
            link: `${ClientRoutes.Agencies}/${user?.id}`,
            hoverText: "group-hover:text-red-500",
            // icon: "live_tv",
            iconWrapper: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
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
        {
           label: "Available Reseller Coins",
           value: 0,
           hoverText: "group-hover:text-red-500",
           // icon: "live_tv",
           iconWrapper: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
           bar: "bg-red-500",
         },
        // { title: "Available Reseller Coins", value: 0 }, //TODO: add the value from the api
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
    name: stat.label,
    value: stat.value,
  }));
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
              <StatusCard key={index}
                 label={card.label}
                 value={card.value}
                 hoverText={card.hoverText}
                 icon={card.icon}
                 iconWrapper={card.iconWrapper}
                 bar={card.bar}
                />
            ))}
          </section>
      {/* Action Buttons */}
      <Dashboard/>
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
        <ActionGroup title={'Statistics Overview'}>
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
        </ActionGroup>
      </div>
    </div>
  );
};



// =========================
// Reusable Status Card
// =========================
const StatusCard = ({ label, value, hoverText, icon, iconWrapper, bar }) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <h3 className={`text-3xl font-bold mt-1 transition-colors ${hoverText}`}>
            {value}
          </h3>
        </div>
        <span className={`p-2 rounded-lg ${iconWrapper}`}>

            <ChevronRight/>

        </span>
      </div>
      <a
        href="#"
        className={`absolute bottom-0 left-0 w-full h-1 ${bar} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
      />
    </div>
  );
};

const ActionGroup = ({ title, children }) => (
  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);




const Dashboard = () => (
  <section className="flex-grow p-4 w-full space-y-8">
    <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <span className="w-1.5 h-6 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full mr-3"></span>
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionGroup title="Finance & Coins">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white rounded-lg shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 p-1.5 rounded-md">
                <Coins className="w-5 h-5" />
              </span>
              <span className="font-medium">Sell Coin</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white rounded-lg shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 p-1.5 rounded-md">
                <PlusCircle className="w-5 h-5" />
              </span>
              <span className="font-medium">Add Coin</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm transition-all group">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-sm">Coin History</span>
            </div>
            <span className="material-symbols-outlined text-gray-400 text-sm group-hover:translate-x-1 transition-transform"><ChevronRight/></span>
          </button>
        </ActionGroup>

        <ActionGroup title="Management">
          {[
            { icon: <Store className="w-5 h-5" />, label: "Stores" },
            { icon: <Gift className="w-5 h-5" />, label: "Gifts" },
            { icon: <CreditCard className="w-5 h-5" />, label: "Salary" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-300 group-hover:text-white transition-colors">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-gray-500 text-sm group-hover:translate-x-1 transition-transform group-hover:text-gray-300">
                <ChevronRight/>
              </span>
            </button>
          ))}
        </ActionGroup>

        <ActionGroup title="History">
          {["Agency Withdraw", "Host Withdraw"].map((label, idx) => (
            <button
              key={label}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm transition-all group border border-transparent hover:border-gray-300 dark:hover:border-gray-500"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                  {idx === 0 ? <HistoryIcon className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                </span>
                <span className="font-medium">{label}</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-sm group-hover:translate-x-1 transition-transform"><ChevronRight/></span>
            </button>
          ))}
        </ActionGroup>

        <ActionGroup title="Admin Tools">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg shadow-sm transition-all group">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-5 h-5 text-sky-400" />
              <span className="font-medium">Game Admin</span>
            </div>
            <span className="material-symbols-outlined text-gray-500 text-sm group-hover:translate-x-1 transition-transform group-hover:text-gray-300"><ChevronRight/></span>
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm transition-all group">
            <div className="flex items-center gap-3">
              <Ban className="w-5 h-5 text-red-500" />
              <span className="font-medium">Banned Users</span>
            </div>
            <span className="material-symbols-outlined text-gray-400 text-sm group-hover:translate-x-1 transition-transform"><ChevronRight/></span>
          </button>
        </ActionGroup>
      </div>
    </section>
  </section>
);
