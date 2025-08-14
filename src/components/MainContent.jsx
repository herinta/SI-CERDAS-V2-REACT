import React from 'react';

import DashboardPage from './DashboardPage';
import SiGitaForm from './SiGitaForm';
import SiGiremaForm from './SiGiremaForm';
import SiGilansaForm from './SiGilansaForm';
import SaragaForm from './SaragaForm';
import LaporanPage from './LaporanPage';
import TanyaAiPage from './TanyaAiPage';
import PengumumanPage from './PengumumanPage';
import ProfilPage from './ProfilPage';
// Import other page components as they are created

const MainContent = ({ currentPage }) => {
  const renderPageContent = () => {
    switch (currentPage) {
      
      case 'page-dashboard':
        return <DashboardPage />;
      case 'page-sigita':
        return <SiGitaForm />;
      case 'page-sigirema':
        return <SiGiremaForm />;
      case 'page-sigilansa':
        return <SiGilansaForm />;
      case 'page-saraga':
        return <SaragaForm />;
      case 'page-laporan':
        return <LaporanPage />;
      case 'page-pusat-informasi':
        return <TanyaAiPage />;
      case 'page-pengumuman':
        return <PengumumanPage />;
      case 'page-profil':
        return <ProfilPage />;
      default:
        return <div>Page Not Found</div>;
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
      {renderPageContent()}
    </main>
  );
};

export default MainContent;