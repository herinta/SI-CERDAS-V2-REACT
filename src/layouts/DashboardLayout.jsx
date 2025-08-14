import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  const [pageTitle, setPageTitle] = useState('Dashboard');

  return (
    <div className="relative min-h-screen lg:flex bg-slate-100">
      <Sidebar setPageTitle={setPageTitle} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <button className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110">
        <i className="fas fa-robot text-2xl"></i>
      </button>
    </div>
  );
};

export default DashboardLayout;
