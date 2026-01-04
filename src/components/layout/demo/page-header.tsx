import { useDispatch, useSelector } from "react-redux";
import { logOut, selectUser } from "@/redux/features/auth.slice";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Activity,
  BarChart3,
  Contact,
  Gift,
  UserIcon,
  Users,
  UsersRound,
} from "lucide-react";
import { useAdminProfileQuery } from "@/redux/api/auth.api";

export function PageHeader() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: adminProfileRes, isLoading } = useAdminProfileQuery();
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", link: "/" },
    { icon: UserIcon, label: "User", link: "/user-lists", hasSubmenu: false },
    { icon: BarChart3, label: "Agency", link: "/agencies", hasSubmenu: false },
    { icon: UsersRound, label: "Reseler", link: "/reseler", hasSubmenu: false },
    { icon: Contact, label: "Merchant", link: "/merchant", hasSubmenu: false },
    { icon: Users, label: "Sub-admin", link: "/sub-admin", hasSubmenu: false },

    { icon: Gift, label: "Gifts", link: "/gifts", hasSubmenu: false },
  ];

  const currentPath = window.location.pathname;

  return (
    <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex items-center justify-between">
      <div>
        {/* <h2 className="text-2xl font-semibold">{title}</h2> */}
        <Link to="/" className="">
          <img src="/logo.png" alt="Logo" className="h-auto w-16 rounded-lg" />
        </Link>
      </div>
      <nav className="mt-4">
        <div className="flex items-center space-x-6">
          {sidebarItems.map((item, index) => {
            const isActive = currentPath === item.link;
            return (
              <Link to={item.link} key={index}>
                <div
                  className={`flex items-center justify-between px-6 py-3 hover:bg-gray-200 cursor-pointer ${
                    isActive
                      ? "text-pink-400 border-r-2 border-pink-400 bg-gray-200"
                      : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-pink-400" : "text-gray-600"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="flex items-center space-x-6">
        {/* <div className="flex items-center space-x-2 text-sm text-gray-400">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className={crumb.active ? "text-pink-400" : ""}>
              {crumb.label}
              {idx < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </div> */}
        {/* Profile Action Bar */}

        <div className="flex items-center gap-1 text-sm text-yellow-500">
          <span className="text-base">🪙</span>{" "}
          {isLoading ? "..." : adminProfileRes?.result?.coins || 0}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            className="ml-4 flex items-center focus:outline-none"
            onClick={() => setOpen((v) => !v)}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.userId || "U"
              }&background=F472B6&color=fff`}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-pink-400 shadow"
            />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
              <div className="px-4 py-2 text-gray-700 text-sm border-b">
                {user?.userId}
              </div>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
