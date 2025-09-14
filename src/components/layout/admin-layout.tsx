import { useState } from "react";
import { Menu, X } from "lucide-react";
import SideNavbar from "@/components/admin/side-navbar";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
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
        <SideNavbar />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex items-center md:justify-end justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </header>
        <main className="flex-1 p-6">
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

export default AdminLayout;
