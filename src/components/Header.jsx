import React from 'react';

const Header = ({ pageTitle }) => {
  return (
    <header className="flex items-center justify-between h-20 px-4 sm:px-6 bg-white shadow-md flex-shrink-0">
      <button id="sidebar-toggle" className="text-gray-600 focus:outline-none lg:hidden">
        <i className="fas fa-bars text-2xl"></i>
      </button>
      <div id="page-title-header" className="text-xl sm:text-2xl font-semibold text-gray-800 truncate">{pageTitle}</div>
      <div className="relative">
        <button id="user-menu-button" className="flex items-center focus:outline-none">
          <img id="header-profile-pic" className="w-10 h-10 rounded-full object-cover" src="https://placehold.co/100x100/E2E8F0/4A5568?text=A" alt="Admin" />
          <span id="header-profile-name" className="ml-3 hidden md:inline">Admin</span>
          <i className="fas fa-chevron-down ml-2 text-sm hidden md:inline"></i>
        </button>
        <div id="user-menu" className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl hidden z-10">
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">Profil</a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">Logout</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
