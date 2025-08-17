import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          pageTitle="Dashboard SiCerdas" 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet/>
         
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;