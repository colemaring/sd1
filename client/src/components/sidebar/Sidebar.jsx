import {
  ArrowRightIcon,
  ArrowLeftIcon,
  HomeIcon,
  ChartPieIcon,
  UserIcon,
  SunIcon,
  ChartBarSquareIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ReactNode, useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";

function Sidebar({ children, expanded, handleToggle }) {
  return (
    <div className="relative">
      <div
        className={`fixed inset-0 -z-10 block bg-gray-400 ${
          expanded ? "block sm:hidden" : "hidden"
        }`}
      />
      <aside
        className={`box-border h-screen transition-all ${
          expanded ? "w-5/6 sm:w-64" : "w-0 sm:w-20"
        }`}
      >
        <nav className="flex h-full flex-col border-r bg-white shadow-sm">
          <div className="flex items-center justify-between p-4 pb-2">
            {/* <img
              src={Logo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-10" : "w-0"
              }`}
              alt=""
            /> */}
            <h1
              className={`overflow-hidden font-bold ${
                expanded ? "w-30" : "w-0"
              }`}
            >
              AI For Safe Driving
            </h1>
            <div className={`${expanded ? "" : "hidden sm:block"}`}>
              <button
                onClick={handleToggle}
                className="rounded-lg bg-gray-50 p-1.5 hover:bg-gray-100"
              >
                {expanded ? (
                  <ArrowRightIcon className="h-6 w-6" />
                ) : (
                  <ArrowLeftIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          <ul className="flex-1 px-3">{children}</ul>
          <div className="flex border-t p-3">
            <div
              className={`flex items-center justify-between overflow-hidden transition-all ${
                expanded ? "ml-3 w-52" : "w-0"
              }`}
            >
              <div>
                <a href="/" className="leading-4 flex items-center">
                  <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                  <h4 className="text-primary-500 pl-2">Log out</h4>
                </a>
                <div className="leading-4 flex items-center pt-2">
                  <SunIcon className="h-6 w-6" />
                  <h4 className="text-primary-500 pl-2">Light Mode</h4>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default function MakeSidebar({ sendSizeChange }) {
  const location = useLocation();

  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem("navbarCollapsed");
    return saved ? JSON.parse(saved) : true; // default to true
  });

  useEffect(() => {
    sendSizeChange(expanded);
  }, [expanded, sendSizeChange]); // Call sendSizeChange when expanded changes

  const handleToggle = () => {
    setExpanded((prev) => {
      const newState = !prev;
      localStorage.setItem("navbarCollapsed", JSON.stringify(newState));
      return newState;
    });
  };

  const navBarItems = [
    {
      icon: <HomeIcon />,
      text: "Dashboard",
      to: "/",
    },
    {
      icon: <ChartBarSquareIcon />,
      subMenu: [
        {
          icon: <></>,
          text: "Driver Name 1",
          to: "/driver",
        },
        {
          icon: <></>,
          text: "Driver Name 2",
          to: "/driver",
        },
      ],
      text: "Driver Analytics",
      to: "/driver",
    },
  ];

  return (
    <Sidebar expanded={expanded} handleToggle={handleToggle}>
      {navBarItems.map((item, index) => (
        <SidebarItem
          key={index}
          expanded={expanded}
          {...item}
          active={location.pathname === item.to}
        />
      ))}
    </Sidebar>
  );
}
