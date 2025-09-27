import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useData } from '../contexts/DataContext'; // 1. IMPORT useData hook

const DashboardPage = () => {
  // 2. Ambil semua data dan state loading dari Context
  const { balitaList, remajaList, lansiaList, wargaList, loading } = useData();

  const balitaChartRef = useRef(null);
  const lansiaChartRef = useRef(null);

  // 3. useEffect sekarang akan bergantung pada data, sehingga chart di-render ulang saat data masuk
  // useEffect(() => {
  //   // --- Chart Balita (Bar Chart) ---
  //   const balitaChartInstance = balitaChartRef.current;
  //   if (balitaChartInstance && balitaList.length > 0) {
  //     if (balitaChartInstance.chart) {
  //       balitaChartInstance.chart.destroy();
  //     }
      
  //     // Proses data untuk chart balita (jumlah pemeriksaan per bulan)
  //     const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  //     const monthlyCounts = Array(6).fill(0);
  //     const labels = [];
  //     const today = new Date();

  //     for (let i = 5; i >= 0; i--) {
  //       const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
  //       labels.push(monthNames[d.getMonth()]);
  //     }

  //     balitaList.forEach(balita => {
  //       const createdAt = new Date(balita.created_at);
  //       const monthDiff = (today.getFullYear() - createdAt.getFullYear()) * 12 + (today.getMonth() - createdAt.getMonth());
  //       if (monthDiff >= 0 && monthDiff < 6) {
  //         monthlyCounts[5 - monthDiff]++;
  //       }
  //     });

  //     const balitaCtx = balitaChartInstance.getContext('2d');
  //     balitaChartInstance.chart = new Chart(balitaCtx, {
  //       type: 'bar',
  //       data: {
  //         labels: labels,
  //         datasets: [{
  //           label: 'Jumlah Pemeriksaan',
  //           data: monthlyCounts,
  //           backgroundColor: 'rgba(79, 70, 229, 0.8)',
  //           borderColor: 'rgba(79, 70, 229, 1)',
  //           borderWidth: 1,
  //           borderRadius: 5
  //         }]
  //       },
  //       options: {
  //         responsive: true,
  //         maintainAspectRatio: false,
  //         scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  //       }
  //     });
  //   }

  //   // --- Chart Lansia (Doughnut Chart) ---
  //   const lansiaChartInstance = lansiaChartRef.current;
  //   if (lansiaChartInstance && lansiaList.length > 0) {
  //     if (lansiaChartInstance.chart) {
  //       lansiaChartInstance.chart.destroy();
  //     }

  //     // Proses data untuk chart lansia (status kesehatan)
  //     const healthStatus = { sehat: 0, hipertensi: 0, diabetes: 0, lainnya: 0 };
  //     lansiaList.forEach(lansia => {
  //       const riwayat = (lansia.riwayat_penyakit || '').toLowerCase();
  //       if (riwayat.includes('hipertensi')) {
  //         healthStatus.hipertensi++;
  //       } else if (riwayat.includes('diabetes')) {
  //         healthStatus.diabetes++;
  //       } else if (riwayat === '' || riwayat.includes('tidak ada') || riwayat.includes('sehat')) {
  //         healthStatus.sehat++;
  //       } else {
  //         healthStatus.lainnya++;
  //       }
  //     });

  //     const lansiaCtx = lansiaChartInstance.getContext('2d');
  //     lansiaChartInstance.chart = new Chart(lansiaCtx, {
  //       type: 'doughnut',
  //       data: {
  //         labels: ['Sehat', 'Hipertensi', 'Diabetes', 'Lainnya'],
  //         datasets: [{
  //           label: 'Status Kesehatan',
  //           data: [healthStatus.sehat, healthStatus.hipertensi, healthStatus.diabetes, healthStatus.lainnya],
  //           backgroundColor: ['#22c55e', '#f97316', '#ef4444', '#64748b'],
  //           hoverOffset: 4
  //         }]
  //       },
  //       options: {
  //         responsive: true,
  //         maintainAspectRatio: false,
  //       }
  //     });
  //   }

  //   // Cleanup function
  //   return () => {
  //     if (balitaChartInstance && balitaChartInstance.chart) {
  //       balitaChartInstance.chart.destroy();
  //     }
  //     if (lansiaChartInstance && lansiaChartInstance.chart) {
  //       lansiaChartInstance.chart.destroy();
  //     }
  //   };
  // }, [balitaList, lansiaList]); // Jalankan ulang useEffect jika data ini berubah

  // Tampilkan loading state untuk seluruh halaman jika data belum siap
  if (loading.warga || loading.lansia || loading.remaja || loading.balita) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="loader" style={{ width: '50px', height: '50px' }}></div>
        </div>
    );
  }

  return (
    <>
      {/* AI Insight Card */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border-l-4 border-indigo-500">
        <div className="flex items-center gap-4">
          <div className="text-indigo-500">
            <i className="fas fa-lightbulb text-3xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">✨ Wawasan AI Harian</h3>
            <div id="ai-insights" className="text-sm text-slate-600 mt-1">
              Berdasarkan data, fokuskan penyuluhan pada pencegahan hipertensi pada lansia bulan ini.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Summary Cards dengan data dinamis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-slate-500 font-medium">Total Balita</h4>
            <p className="text-3xl font-bold text-slate-800 mt-1">{balitaList.length}</p>
          </div>
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <i className="fas fa-baby text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-slate-500 font-medium">Total Remaja</h4>
            <p className="text-3xl font-bold text-slate-800 mt-1">{remajaList.length}</p>
          </div>
          <div className="bg-green-100 text-green-600 p-4 rounded-full">
            <i className="fas fa-child-reaching text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-slate-500 font-medium">Total Lansia</h4>
            <p className="text-3xl font-bold text-slate-800 mt-1">{lansiaList.length}</p>
          </div>
          <div className="bg-orange-100 text-orange-600 p-4 rounded-full">
            <i className="fas fa-person-cane text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-slate-500 font-medium">Total Cargiever</h4>
            <p className="text-3xl font-bold text-slate-800 mt-1">{wargaList.length}</p>
          </div>
          <div className="bg-purple-100 text-purple-600 p-4 rounded-full">
            <i className="fas fa-users text-2xl"></i>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-800 mb-4">Grafik Pemeriksaan Balita (6 Bulan Terakhir)</h3>
          <div className="h-80"><canvas ref={balitaChartRef}></canvas></div>
        </div>
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-800 mb-4">Status Kesehatan Lansia</h3>
          <div className="h-80 flex items-center justify-center"><canvas ref={lansiaChartRef}></canvas></div>
        </div>
      </div> */}
    </>
  );
};

export default DashboardPage;
