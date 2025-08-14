import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

const DashboardPage = () => {
  const balitaChartRef = useRef(null);
  const lansiaChartRef = useRef(null);

  useEffect(() => {
    const balitaChart = balitaChartRef.current;
    const lansiaChart = lansiaChartRef.current;

    // Balita Chart
    if (balitaChart) {
      if (balitaChart.chart) {
        balitaChart.chart.destroy();
      }
      const balitaCtx = balitaChart.getContext('2d');
      balitaChart.chart = new Chart(balitaCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
          datasets: [{
            label: 'Jumlah Pemeriksaan',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(79, 70, 229, 0.8)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1,
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Lansia Chart
    if (lansiaChart) {
      if (lansiaChart.chart) {
        lansiaChart.chart.destroy();
      }
      const lansiaCtx = lansiaChart.getContext('2d');
      lansiaChart.chart = new Chart(lansiaCtx, {
        type: 'doughnut',
        data: {
          labels: ['Sehat', 'Hipertensi', 'Diabetes', 'Lainnya'],
          datasets: [{
            label: 'Status Kesehatan',
            data: [50, 20, 15, 13],
            backgroundColor: ['#22c55e', '#f97316', '#ef4444', '#64748b'],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    // Cleanup function to destroy charts on component unmount
    return () => {
      if (balitaChart && balitaChart.chart) {
        balitaChart.chart.destroy();
      }
      if (lansiaChart && lansiaChart.chart) {
        lansiaChart.chart.destroy();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      {/* New AI Insight Card */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border-l-4 border-indigo-500">
        <div className="flex items-center gap-4">
          <div className="text-indigo-500">
            <i className="fas fa-lightbulb text-3xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">✨ Wawasan AI Harian</h3>
            <div id="ai-insights" className="text-sm text-slate-600 mt-1">
              <div className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: '0' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {/* Card 1: Total Balita */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-slate-500 font-medium">Total Balita</h4>
            <p className="text-3xl font-bold text-slate-800 mt-1">125</p>
            <p className="text-xs text-green-500 flex items-center mt-1"><i className="fas fa-arrow-up mr-1"></i> 5% dari bulan lalu</p>
          </div>
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <i className="fas fa-baby text-2xl"></i>
          </div>
        </div>
        {/* Card 2: Total Remaja */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-slate-500 font-medium">Total Remaja</h4>
            <p className="text-3xl font-bold text-slate-800 mt-1">340</p>
            <p className="text-xs text-green-500 flex items-center mt-1"><i className="fas fa-arrow-up mr-1"></i> 2% dari bulan lalu</p>
          </div>
          <div className="bg-green-100 text-green-600 p-4 rounded-full">
            <i className="fas fa-child-reaching text-2xl"></i>
          </div>
        </div>
        {/* Card 3: Total Lansia */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-slate-500 font-medium">Total Lansia</h4>
            <p className="text-3xl font-bold text-slate-800 mt-1">88</p>
            <p className="text-xs text-red-500 flex items-center mt-1"><i className="fas fa-arrow-down mr-1"></i> 1% dari bulan lalu</p>
          </div>
          <div className="bg-orange-100 text-orange-600 p-4 rounded-full">
            <i className="fas fa-person-cane text-2xl"></i>
          </div>
        </div>
        {/* Card 4: Total Warga */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-slate-500 font-medium">Total Warga</h4>
            <p className="text-3xl font-bold text-slate-800 mt-1">1,250</p>
            <p className="text-xs text-green-500 flex items-center mt-1"><i className="fas fa-arrow-up mr-1"></i> 3% dari bulan lalu</p>
          </div>
          <div className="bg-purple-100 text-purple-600 p-4 rounded-full">
            <i className="fas fa-users text-2xl"></i>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-800 mb-4">Grafik Pertumbuhan Balita</h3>
          <div className="h-80"><canvas id="balitaChart" ref={balitaChartRef}></canvas></div>
        </div>
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-800 mb-4">Status Kesehatan Lansia</h3>
          <div className="h-80 flex items-center justify-center"><canvas id="lansiaChart" ref={lansiaChartRef}></canvas></div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
