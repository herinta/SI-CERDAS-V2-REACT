import React from 'react';

const MenuUtama = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="menu-card group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="relative z-10">
          <div className="card-icon bg-blue-100 text-blue-600 p-4 rounded-full inline-block">
            <i className="fas fa-baby text-2xl"></i>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">Data Balita</h3>
            <p className="text-slate-500">SiGita</p>
          </div>
          <div className="arrow-icon absolute bottom-0 right-0 p-4 text-blue-600">
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-50 rounded-full transition-transform duration-500 group-hover:scale-[8]"></div>
      </div>
      <div className="menu-card group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="relative z-10">
          <div className="card-icon bg-green-100 text-green-600 p-4 rounded-full inline-block">
            <i className="fas fa-child-reaching text-2xl"></i>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">Data Remaja</h3>
            <p className="text-slate-500">SiGirema</p>
          </div>
          <div className="arrow-icon absolute bottom-0 right-0 p-4 text-green-600">
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-green-50 rounded-full transition-transform duration-500 group-hover:scale-[8]"></div>
      </div>
      <div className="menu-card group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="relative z-10">
          <div className="card-icon bg-orange-100 text-orange-600 p-4 rounded-full inline-block">
            <i className="fas fa-person-cane text-2xl"></i>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">Data Lansia</h3>
            <p className="text-slate-500">SiGilansa</p>
          </div>
          <div className="arrow-icon absolute bottom-0 right-0 p-4 text-orange-600">
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-orange-50 rounded-full transition-transform duration-500 group-hover:scale-[8]"></div>
      </div>
      <div className="menu-card group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="relative z-10">
          <div className="card-icon bg-purple-100 text-purple-600 p-4 rounded-full inline-block">
            <i className="fas fa-users text-2xl"></i>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">Data Cargiever</h3>
            <p className="text-slate-500">Saraga</p>
          </div>
          <div className="arrow-icon absolute bottom-0 right-0 p-4 text-purple-600">
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-50 rounded-full transition-transform duration-500 group-hover:scale-[8]"></div>
      </div>
    </div>
  );
};

export default MenuUtama;
