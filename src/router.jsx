import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
// Register dihapus
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
import UserManagement from './pages/UserManagement'; // Import halaman baru

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      // Rute 'register' dihapus
    ],
  },
  {
    path: 'dashboard',
    element: (
       <AuthProvider>
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    </AuthProvider>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'laporan', element: <LaporanPage /> },
      { path: 'menu-utama', element: <MenuUtama /> },
      { path: 'pengumuman', element: <PengumumanPage /> },
      { path: 'profil', element: <ProfilPage /> },
      { path: 'saraga', element: <SaragaForm /> },
      { path: 'sigilansa', element: <SiGilansaForm /> },
      { path: 'sigirema', element: <SiGiremaForm /> },
      { path: 'sigita', element: <SiGitaForm /> },
      { path: 'tanya-ai', element: <TanyaAiPage /> },
      { path: 'users', element: <UserManagement /> }, // Tambahkan rute baru
    ],
  },
]);

export default router;
