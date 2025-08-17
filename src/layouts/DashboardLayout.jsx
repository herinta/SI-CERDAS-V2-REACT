import React, { useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { DataProvider } from "../contexts/DataContext";
import { ToastProvider } from "../contexts/ToastContext";
import { ConfirmationProvider } from "../contexts/ConfirmationContext";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../components/AuthContext"; // Tambahkan ini

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext); // Ambil userProfile dari context
  const userRole = userProfile?.role?.name || "user"; // Ambil role

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <ConfirmationProvider>
      <ToastProvider>
        <div className="h-screen bg-gray-50 md:flex">
          {/* Sidebar */}
          <Sidebar
            userRole={userRole}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            handleLogout={handleLogout}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <Header
              pageTitle="Dashboard SiCerdas"
              toggleSidebar={toggleSidebar}
              handleLogout={handleLogout}
            />

            {/* Page Content */}
            <main className="flex-1 p-1 md:p-6 overflow-y-auto w-full">
              <DataProvider>
                <Outlet />
              </DataProvider>
            </main>
          </div>
        </div>
      </ToastProvider>
    </ConfirmationProvider>
  );
};

export default DashboardLayout;
