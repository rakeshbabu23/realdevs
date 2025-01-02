import React, { useState, useEffect } from "react";
import { Home, User, Share, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarIcon = ({ icon: Icon, label, action }) => (
    <li className="mb-6">
      <Link
        to={action}
        className="flex items-center text-gray-400 hover:text-purple-500 transition-colors duration-200"
      >
        <Icon size={24} />
        {isExpanded && !isMobile && <span className="ml-4">{label}</span>}
      </Link>
    </li>
  );

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        isExpanded && !isMobile ? "w-64" : "w-16"
      } bg-black h-screen overflow-hidden`}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
    >
      <ul className="flex flex-col items-center mt-8">
        <SidebarIcon icon={Home} label="Home" action=" " />
        <SidebarIcon icon={User} label="Profile" action="profile" />
        <SidebarIcon icon={LayoutDashboard} label="Group" action="group" />
        <SidebarIcon icon={Share} label="Share" action="share" />
      </ul>
    </div>
  );
}

export default Sidebar;
