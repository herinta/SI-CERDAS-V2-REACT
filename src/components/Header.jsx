import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

const Header = ({ pageTitle, toggleSidebar, handleLogout }) => {
  const { userProfile } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-20 px-4 sm:px-6 bg-white shadow-md flex-shrink-0">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none lg:hidden mr-4" aria-label="Buka menu">
          <i className="fas fa-bars text-2xl"></i>
        </button>
        <div className="text-xl sm:text-2xl font-semibold text-gray-800 truncate">{pageTitle}</div>
      </div>

      <div className="relative">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center focus:outline-none">
          <img className="w-10 h-10 rounded-full object-cover" src={userProfile?.avatar_url || `https://placehold.co/100x100/E2E8F0/4A5568?text=${userProfile?.full_name?.charAt(0) || 'A'}`} alt="Admin" />
          <span className="ml-3 hidden md:inline">{userProfile?.full_name || 'Admin'}</span>
          <i className="fas fa-chevron-down ml-2 text-sm hidden md:inline"></i>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
            <Link to="/dashboard/profil" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">Profil</Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
