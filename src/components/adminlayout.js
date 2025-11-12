import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import ScrollMiddleware from "../scrollMiddleware";

const AdminLayout = () => {
  const navItems = [
    { path: "/admin/main", label: "MAIN", icon: "○" },
    { path: "/admin/transit", label: "TRANSIT", icon: "◉" },
    { path: "/admin/graph", label: "GRAPH", icon: "☰" },
    { path: "/admin/settings", label: "SETTINGS", icon: "⚙" },
  ];

  const bottomNavItems = [
    { path: "/admin/synastry", label: "SYNASTRY", icon: "♡" },
    { path: "/admin/composite", label: "COMPOSITE", icon: "◐" },
    { path: "/admin/chat", label: "CHAT", icon: "⚉" },
    { path: "/admin/docs", label: "DOCS", icon: "?" },
    { path: "/admin/account", label: "ACCOUNT", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
   
      <ScrollMiddleware/>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="px-4 sm:px-6 md:px-10 py-4 md:py-5">
   
          <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-16">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 sm:gap-2 text-gray-500 hover:text-gray-800 transition-colors ${
                    isActive ? "text-gray-900" : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`text-2xl sm:text-3xl md:text-4xl ${
                        isActive ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div
                      className={`text-[10px] sm:text-xs tracking-wider ${
                        isActive ? "font-bold" : "font-medium"
                      }`}
                    >
                      {item.label}
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

        
          <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-16 mt-4 md:mt-5">
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 sm:gap-2 text-gray-500 hover:text-gray-800 transition-colors ${
                    isActive ? "text-gray-900" : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`text-2xl sm:text-3xl md:text-4xl ${
                        isActive ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div
                      className={`text-[10px] sm:text-xs tracking-wider ${
                        isActive ? "font-bold" : "font-medium"
                      }`}
                    >
                      {item.label}
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
