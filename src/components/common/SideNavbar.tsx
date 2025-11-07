import type { ISideBarItems } from "@/types/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SideNavbar: React.FC<{menuItems:ISideBarItems[]}> = ({menuItems}) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");
  const navigate = useNavigate();
  return (
    <nav className="py-3 px-4 ">
      {menuItems.map((item, index) => (
        <a
          key={index}
          className={`flex items-center px-3 py-3 mb-2 rounded-lg text-sm ${
            selectedMenuItem === item.label
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => {
            navigate(item.navigate as string);
            setSelectedMenuItem(item.label);
          }}
        >
          <item.icon className="w-4 h-4 mr-3" />
          {item.label}
        </a>
      ))}
    </nav>
  );
};

export default SideNavbar;
