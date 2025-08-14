import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DashboardLayout = () => {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen lg:flex bg-slate-100">
      {/* Sidebar sekarang berada di dalam div ini */}
      <Sidebar 
        setPageTitle={setPageTitle} 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />
      
      {/* Konten utama */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header 
          pageTitle={pageTitle} 
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
