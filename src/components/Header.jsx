import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, User, LogOut } from 'lucide-react';
import { AuthContext } from '../components/AuthContext'; // 1. Import AuthContext

// 2. Terima prop 'handleLogout' dari DashboardLayout
const Header = ({ pageTitle, toggleSidebar, handleLogout }) => {
  const { userProfile } = useContext(AuthContext); // 3. Ambil data pengguna dari context
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Sisi Kiri - Tombol Hamburger + Judul Halaman */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-sm md:text-xl font-semibold text-gray-900">
              {pageTitle}
            </h1>
          </div>

          {/* Sisi Kanan - Menu Profil Pengguna */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* Avatar Dinamis */}
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profil" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              
              {/* Info Pengguna Dinamis */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{userProfile?.full_name || 'Pengguna'}</p>
              </div>
              
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Menu Dropdown Profil */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                {/* Gunakan <Link> untuk navigasi internal */}
                <Link
                  to="/dashboard/profil"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  Profil
                </Link>
                
                <hr className="my-1 border-gray-200" />
                
                {/* 4. Panggil fungsi handleLogout dari props */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
                 <hr className="my-1 border-gray-200" />
                 <Link
                  to="/"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  Home
                </Link>
              </div>
            )}

            {/* Backdrop untuk menutup dropdown */}
            {isMenuOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
