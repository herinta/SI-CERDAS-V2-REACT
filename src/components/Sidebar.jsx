import React from 'react';
import { NavLink } from 'react-router-dom'; // <-- 1. IMPORT NavLink
import { 
  LayoutDashboard, 
  Baby, 
  User, 
  UserCheck, 
  Users, 
  FileText, 
  MessageCircleQuestion, 
  Settings, 
  Shield, 
  LogOut,
  Heart,
  X
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, handleLogout }) => {
  const userRole = 'admin'; 

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && isSidebarOpen) { // Hanya tutup di mobile
      toggleSidebar();
    }
  };



  // REVISI: Properti 'current' tidak lagi diperlukan, NavLink akan menanganinya secara otomatis
  const navigationSections = [
    {
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'INPUT DATA',
      items: [
        { name: 'Data Balita (SiGita)', href: '/dashboard/sigita', icon: Baby },
        { name: 'Data Remaja (SiGirema)', href: '/dashboard/sigirema', icon: User },
        { name: 'Data Lansia (SiGilansa)', href: '/dashboard/sigilansa', icon: UserCheck },
        { name: 'Data Warga (Saraga)', href: '/dashboard/saraga', icon: Users }
      ]
    },
    {
      title: 'LAINNYA',
      items: [
        // { name: 'Laporan', href: '/dashboard/laporan', icon: FileText },
        { name: 'Tanya AI', href: '/dashboard/tanya-ai', icon: MessageCircleQuestion },
        { name: 'Profil Admin', href: '/dashboard/profil', icon: Settings }
      ]
    },
    {
      title: 'ADMINISTRASI',
      items: [
        ...(userRole === 'admin' ? [{ name: 'Manajemen Pengguna', href: '/dashboard/users', icon: Shield }] : [])
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">SiCerdas</h2>
              <p className="text-xs text-gray-500">Dashboard Admin</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-8">
            {navigationSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <div className="px-3 mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.name}>
                        {/* <-- 2. GANTI <a> DENGAN <NavLink> */}
                        <NavLink
                          to={item.href} // <-- Gunakan 'to' bukan 'href'
                          onClick={handleLinkClick}
                          // <-- 3. className menjadi fungsi untuk mendeteksi state 'isActive'
                          className={({ isActive }) =>
                            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border-r-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`
                          }
                        >
                          {({ isActive }) => ( // <-- Render prop untuk mengubah style icon juga
                            <>
                              <IconComponent
                                className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                              />
                              <span className="truncate">{item.name}</span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
