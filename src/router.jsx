import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import LaporanPage from './pages/LaporanPage';
import MenuUtama from './pages/MenuUtama';
import PengumumanPage from './pages/PengumumanPage';
import ProfilPage from './pages/ProfilPage';
import SaragaForm from './pages/SaragaForm';
import SiGilansaForm from './pages/SiGilansaForm';
import SiGiremaForm from './pages/SiGiremaForm';
import SiGitaForm from './pages/SiGitaForm';
import TanyaAiPage from './pages/TanyaAiPage';
import UserManagement from './pages/UserManagement';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  // --- Rute Publik ---
  // Rute ini tidak akan menggunakan DashboardLayout
  {
    path: '/',
    element: <LandingPage />, // LandingPage sekarang menjadi halaman utama
  },
  {
    path: '/login',
    element: (
      
        <Login />
      
    ),
  },

  // --- Rute Privat / Dashboard ---
  // Semua rute di sini akan dilindungi dan menggunakan DashboardLayout
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout/>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> }, // Halaman default dashboard
      { path: 'laporan', element: <LaporanPage /> },
      { path: 'menu-utama', element: <MenuUtama /> },
      { path: 'pengumuman', element: <PengumumanPage /> },
      { path: 'profil', element: <ProfilPage /> },
      { path: 'saraga', element: <SaragaForm /> },
      { path: 'sigilansa', element: <SiGilansaForm /> },
      { path: 'sigirema', element: <SiGiremaForm /> },
      { path: 'sigita', element: <SiGitaForm /> },
      { path: 'tanya-ai', element: <TanyaAiPage /> },
      { path: 'users', element: <UserManagement /> },
    ],
  },
]);

export default router;
