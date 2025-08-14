import React, { useState, useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { AuthContext } from './AuthContext';

const DashboardLayout = () => {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { session, userProfile, loading } = useContext(AuthContext);

  // Proteksi route: kalau belum login redirect ke login
  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [loading, session, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    else navigate('/login');
  };

  // Jangan render layout kalau loading
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="relative min-h-screen lg:flex bg-slate-100">
      <Sidebar 
        setPageTitle={setPageTitle} 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        handleLogout={handleLogout} 
      />
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
