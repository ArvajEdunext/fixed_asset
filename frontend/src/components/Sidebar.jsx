import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "./ui/input";
import {
  Package,
  Search,
  Home,
  Wrench,
  Shield,
  Users,
  Settings,
  FileBarChart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  setActiveMenuItem,
  setCurrentPage,
  toggleExpandedMenu,
} from "../redux/slices/navigationSlice";
import Images from "@/config/Images";

const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  hasSubmenu,
  isExpanded,
  onClick,
  children,
}) => (
  <div>
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-expanded={hasSubmenu ? isExpanded : undefined}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5" aria-hidden="true" />
        <span className="font-medium">{label}</span>
      </div>
      {hasSubmenu && (
        <div className="transform transition-transform">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          )}
        </div>
      )}
    </div>
    {hasSubmenu && isExpanded && (
      <div className="ml-6 mt-2 space-y-1" role="group">
        {children}
      </div>
    )}
  </div>
);

const SubMenuItem = ({ label, isActive, onClick, path }) => (
  <div
    className={`px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-400 hover:bg-slate-700 hover:text-white"
    }`}
    onClick={() => onClick(path)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(path);
      }
    }}
  >
    {label}
  </div>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { activeMenuItem, sidebarCollapsed, expandedMenus } = useSelector(
    (state) => state.navigation
  );

  // Auto-expand menu when a child route is active
  useEffect(() => {
    const checkAndExpandParentMenu = () => {
      menuItems.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some(
            (child) => location.pathname === child.path
          );

          if (isChildActive && !expandedMenus[item.key]) {
            dispatch(toggleExpandedMenu(item.key));
          }
        }
      });
    };

    checkAndExpandParentMenu();
  }, [location.pathname, dispatch, expandedMenus]);

  const handleMenuClick = (menuItem, hasSubmenu = false, path = null) => {
    if (hasSubmenu) {
      dispatch(toggleExpandedMenu(menuItem));
    } else {
      dispatch(setActiveMenuItem(menuItem));
      dispatch(setCurrentPage(menuItem));
      if (path) {
        navigate(path);
      }
    }
  };

  const handleSubMenuClick = (path) => {
    navigate(path);
    // Set active menu item based on path
    const activeItem = menuItems.find(
      (item) =>
        item.children && item.children.some((child) => child.path === path)
    ) || { key: path };

    dispatch(setActiveMenuItem(activeItem.key));
    dispatch(setCurrentPage(path));
  };

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
      key: "Dashboard",
    },
    {
      icon: Package,
      label: "Asset Management",
      hasSubmenu: true,
      key: "AssetManagement",
      children: [
        { label: "Asset Master", path: "/asset-management/asset-master" },
        { label: "Asset Transfer", path: "/asset-management/asset-transfer" },
        { label: "Asset Disposal", path: "/asset-management/asset-disposal" },
        {
          label: "Depreciation Calculation",
          path: "/asset-management/depreciation-calculation",
        },
      ],
    },
    {
      icon: Wrench,
      label: "Maintenance Manag",
      hasSubmenu: true,
      key: "MaintenanceManagement",
      children: [
        {
          label: "Maintenance Tickets",
          path: "/maintenance-management/tickets",
        },
        {
          label: "Scheduled Maintenance",
          path: "/maintenance-management/scheduled",
        },
      ],
    },
    {
      icon: Shield,
      label: "Audit Module",
      hasSubmenu: true,
      key: "AuditModule",
      children: [
        { label: "Audit Reports", path: "/audit-module/reports" },
        { label: "Compliance Check", path: "/audit-module/compliance" },
      ],
    },
    {
      icon: Users,
      label: "Users",
      path: "/users",
      key: "Users",
    },
    {
      icon: Settings,
      label: "Configuration",
      path: "/configuration",
      key: "Configuration",
    },
    {
      icon: FileBarChart,
      label: "Report",
      path: "/reports",
      key: "Reports",
    },
  ];

  const isActiveMenuItem = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  const isActiveSubMenuItem = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`bg-[#21263C] transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-72"
      } flex flex-col fixed left-0 top-0 h-full z-30`}
    >
      <div className="p-6 bg-[#181C2E]">
        <div className={`flex justify-center`}>
          
          {!sidebarCollapsed && (
            <div className="">
              <img src={Images.common.Logo} className="object-contain" alt="" />
            </div>
          )}
        </div>
      </div>


      {/* Navigation */}
      <nav
        className="flex-1 px-4 py-3 space-y-1 overflow-y-auto"
        role="navigation"
        aria-label="Main navigation"
      >
        {menuItems.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            label={sidebarCollapsed ? "" : item.label}
            isActive={isActiveMenuItem(item)}
            hasSubmenu={item.hasSubmenu}
            isExpanded={expandedMenus[item.key]}
            onClick={() =>
              handleMenuClick(item.key, item.hasSubmenu, item.path)
            }
          >
            {item.children &&
              item.children.map((child) => (
                <SubMenuItem
                  key={child.path}
                  label={child.label}
                  isActive={isActiveSubMenuItem(child.path)}
                  onClick={handleSubMenuClick}
                  path={child.path}
                />
              ))}
          </SidebarItem>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
