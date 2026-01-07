import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Roles } from "@/constants/route.enum";
import { RoleContext } from "@/provider/role-provider";
import { useAdminProfileQuery } from "@/redux/api/auth.api";
import { useGetPortalProfileQuery } from "@/redux/api/power-shared";
import { logOut } from "@/redux/features/auth.slice";
import { useAppDispatch } from "@/redux/hooks";
import { LogOut, User } from "lucide-react";
import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

// const roleOptions: { value: Role; label: string }[] = [
//   { value: "admin", label: "Admin" },
//   { value: "sub-admin", label: "Sub-Admin" },
//   { value: "agency", label: "Agency" },
//   { value: "merchant", label: "Merchant" },
//   { value: "re-seller", label: "Re-Seller" },
// ];
const RootLayout = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("DashboardPage must be used within a RoleProvider");
  }
  const { role } = context;
  // const context = useContext(RoleContext);
  // if (!context) {
  //   throw new Error("DemoLayout must be used within a RoleProvider");
  // }
  // const { role, setRole } = context;
  // const user = useAppSelector(selectUser);
  // const isAdmin = role === Roles.Admin;
  // const { data: profileRes } = useMyProfileQuery(undefined, {skip: isAdmin});
  // const {data: portalProfileRes} = useGetPortalProfileQuery(undefined, {skip: !isAdmin});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const { data: adminProfileRes, isLoading } = useAdminProfileQuery();
  const { data: portalProfileRes, isLoading: portalIsLoading } =
    useGetPortalProfileQuery();

  // const profile = role !== Roles.Admin ? portalProfileRes?.result : profileRes?.result;
  // const fallbackName = profile?.name
  //   ? profile.name.charAt(0).toUpperCase()
  //   : "U";
  const renderAdmin = isLoading ? "..." : adminProfileRes?.result?.coins || 0;
  const renderPortal = portalIsLoading
    ? "..."
    : portalProfileRes?.result?.coins || 0;
  // const renderAdmin = isLoading ? "..." : adminProfileRes?.result?.coins || 0;

  return (
    <div className="min-h-screen font-sans">
      {/* Header with role switcher */}
      <Header
        // fallbackName={fallbackName}
        renderAdmin={renderAdmin}
        renderPortal={renderPortal}
        handleLogout={handleLogout}
        role={role}
      />
      {/* Main dashboard view */}
      {/*<main className="container mx-auto p-4 sm:p-6 lg:p-8">*/}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        <Outlet />
      </main>
    </div>
  );
};
export default RootLayout;

const Header = ({
  // fallbackName,
  renderAdmin,
  renderPortal,
  handleLogout,
  role,
}: any) => {
  return (
    <header className="bg-surface-light dark:bg-surface-dark shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-600 to-sky-100 flex items-center justify-center shadow-md"> */}
            <Link to="/" className="">
          <img src="/logo.png" alt="Logo" className="h-auto w-16 rounded-lg" />
        </Link>
          {/* </div> */}
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-gray-500">
            Asian Live Pro
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/*<div className="hidden md:flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800/50">
              <DollarSign className="text-yellow-600 dark:text-yellow-400 mr-2 w-5 h-5" />
              <span className="text-base mr-2 w-5 h-5">🪙</span>{" "}
              <span className="font-semibold text-yellow-800 dark:text-yellow-300">98,767,280</span>
            </div>*/}
          {role === Roles.Admin && (
            <div className="hidden md:flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800/50">
              <span className="text-base mr-2 w-5 h-5">🪙</span>{" "}
              <span className="font-semibold text-yellow-800 dark:text-yellow-300">
                {renderAdmin}
              </span>
            </div>
          )}
          {role === Roles.Merchant && (
            <div className="hidden md:flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800/50">
              <span className="text-base mr-2 w-5 h-5">🪙</span>{" "}
              <span className="font-medium">{renderPortal}</span>
            </div>
          )}
          {role === Roles.Reseller && (
            <div className="hidden md:flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800/50">
              <span className="text-base mr-2 w-5 h-5">🪙</span>{" "}
              <span className="font-medium">{renderPortal}</span>
            </div>
          )}

          {/* If needed toggle of the light and dark theme then it will help to make it */}
          {/* <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            onClick={() => document.documentElement.classList.toggle("dark")}
          >
            <Moon className="block dark:hidden w-5 h-5" />
            <Sun className="hidden dark:block w-5 h-5" />
          </button> */}
          <NavDropdownMenu
            // fallbackName={fallbackName}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

const NavDropdownMenu = ({ handleLogout }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 focus:outline-none">
        <div className="relative cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
            <User className="text-gray-500 dark:text-gray-300 w-6 h-6" />
          </div>
        </div>
        {/*<div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-medium text-gray-800">John</span>
          <span className="text-xs text-gray-500">john@example.com</span>
        </div>*/}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/*<DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>*/}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
