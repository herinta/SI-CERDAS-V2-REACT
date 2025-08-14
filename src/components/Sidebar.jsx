import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

const Sidebar = ({ setPageTitle, isSidebarOpen, toggleSidebar, handleLogout }) => {
  const { userProfile } = useContext(AuthContext);

  const handleNavigation = (title) => {
    setPageTitle(title);
    // Tutup sidebar setelah navigasi di mobile
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Backdrop Overlay untuk mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      <aside className={`fixed inset-y-0 left-0 bg-slate-800 text-slate-300 w-64 transform transition-transform duration-300 ease-in-out z-30 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-20 border-b border-slate-700 flex-shrink-0">
          <i className="fas fa-heart-pulse text-3xl text-indigo-400"></i>
          <h1 className="text-2xl font-bold ml-3 text-white">SiCerdas</h1>
        </div>
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Dashboard')}
          >
            <i className="fas fa-chart-pie w-6 text-center"></i>
            <span className="ml-4">Dashboard</span>
          </NavLink>
          <p className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase">Input Data</p>
          <NavLink
            to="/dashboard/sigita"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Formulir Data Balita (SiGita)')}
          >
            <i className="fas fa-baby w-6 text-center"></i>
            <span className="ml-4">Data Balita (SiGita)</span>
          </NavLink>
          <NavLink
            to="/dashboard/sigirema"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Formulir Data Remaja (SiGirema)')}
          >
            <i className="fas fa-child-reaching w-6 text-center"></i>
            <span className="ml-4">Data Remaja (SiGirema)</span>
          </NavLink>
          <NavLink
            to="/dashboard/sigilansa"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Formulir Data Lansia (SiGilansa)')}
          >
            <i className="fas fa-person-cane w-6 text-center"></i>
            <span className="ml-4">Data Lansia (SiGilansa)</span>
          </NavLink>
          <NavLink
            to="/dashboard/saraga"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Formulir Data Warga (Saraga)')}
          >
            <i className="fas fa-users w-6 text-center"></i>
            <span className="ml-4">Data Warga (Saraga)</span>
          </NavLink>
          <p className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase">Lainnya</p>
          <NavLink
            to="/dashboard/laporan"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Laporan Data Kesehatan')}
          >
            <i className="fas fa-file-alt w-6 text-center"></i>
            <span className="ml-4">Laporan</span>
          </NavLink>
          <NavLink
            to="/dashboard/tanya-ai"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Tanya AI')}
          >
            <i className="fas fa-comments w-6 text-center"></i>
            <span className="ml-4">Tanya AI</span>
          </NavLink>
          <NavLink
            to="/dashboard/pengumuman"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Buat Pengumuman')}
          >
            <i className="fas fa-bullhorn w-6 text-center"></i>
            <span className="ml-4">Buat Pengumuman</span>
          </NavLink>
          <NavLink
            to="/dashboard/profil"
            className={({ isActive }) =>
              `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                isActive ? 'bg-slate-700' : ''
              }`
            }
            onClick={() => handleNavigation('Profil Admin')}
          >
            <i className="fas fa-user-cog w-6 text-center"></i>
            <span className="ml-4">Profil Admin</span>
          </NavLink>

          {/* --- TAUTAN KHUSUS ADMIN --- */}
          {userProfile?.role?.name === 'admin' && (
            <>
              <p className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase">Administrasi</p>
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  `sidebar-link flex items-center px-4 py-2.5 rounded-lg transition duration-200 hover:bg-slate-700 ${
                    isActive ? 'bg-slate-700' : ''
                  }`
                }
                onClick={() => handleNavigation('Manajemen Pengguna')}
              >
                <i className="fas fa-users-cog w-6 text-center"></i>
                <span className="ml-4">Manajemen Pengguna</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 mt-auto border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 rounded-lg transition duration-200 bg-red-500 text-white hover:bg-red-600"
          >
            <i className="fas fa-sign-out-alt w-6 text-center"></i>
            <span className="ml-4">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
