import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { DataProvider } from "../contexts/DataContext"; // 1. IMPORT DATAPROVIDER (sesuaikan path jika perlu)
import { ToastProvider } from "../contexts/ToastContext";
import { ConfirmationProvider } from "../contexts/ConfirmationContext";
import { supabase } from "../supabaseClient";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const navigate = useNavigate();

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
              {/* 2. BUNGKUS OUTLET DENGAN PROVIDER */}
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
