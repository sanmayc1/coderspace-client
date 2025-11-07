import { useState } from "react";
import { Menu, X } from "lucide-react";
import SideNavbar from "@/components/common/SideNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux-custom-hook";
import { logout } from "@/api/auth/auth.api";
import { clearAuth } from "@/app/redux-slice/authReducer";
import LoadingSpin from "../common/LoadingSpin";
import { Button } from "../ui/Button";
import type { ISideBarItems } from "@/types/types";

const CommonLayout: React.FC<{
  menuItems: ISideBarItems[];
  profileNavigate: string;
}> = ({ menuItems, profileNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profileUrl =
    useAppSelector((s) => s.authReducer.profileUrl) || "/defaultProfile.jpg";

  const accountLogout = async () => {
    try {
      setLoading(true);
      const res = await logout();
      if (res && res.status === 204) {
        dispatch(clearAuth());
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex w-[100%]  bg-gray-100 ">
      <div
        className={`bg-white w-64 min-h-screen shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static z-30`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <img
              src="/logo.png"
              alt="logo"
              className="max-h-12 min-h-10 min-w-32 select-none cursor-pointer"
            />
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
     
          <SideNavbar menuItems={menuItems} />
       
      </div>

      <div className="flex flex-col w-full">
        <header className="bg-white shadow-sm p-4 flex items-center md:justify-end justify-between ">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex gap-3 px-4 justify-center items-center">
            <Button size={"sm"} onClick={accountLogout}>
              {isLoading ? (
                <LoadingSpin />
              ) : (
                <span className="pt-1"> Logout</span>
              )}
            </Button>
            <img
              src={profileUrl}
              onClick={() => navigate(profileNavigate)}
              alt="profile"
              className="rounded-full h-8 border-2 border-black p-[1.5px] min-w-8 box-content "
            />
          </div>
        </header>
        <main className="p-4 w-full  ">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CommonLayout;
