import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-50 p-4">
      <div className="relative flex flex-col w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl md:flex-row">
        {/* Left side with information */}
        <div className="relative p-8 md:p-12 md:w-1/2 bg-indigo-600 text-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <img
                src="/public/images/logo.png"
                alt="SiCerdas Logo"
                className="w-12 h-12"
              />
              <h1 className="text-3xl font-bold">SiCerdas</h1>
            </div>
            <p className="mt-4 text-indigo-200">
              Program inovasi digital untuk meningkatkan akses dan penyebaran
              informasi kesehatan secara cepat, tepat, dan berkelanjutan.
            </p>
            <div className="mt-8 space-y-6 border-t border-indigo-500 pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500 text-white p-3 rounded-full flex-shrink-0">
                  <i className="fas fa-bullhorn"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Edukasi Efisien</h3>
                  <p className="text-sm text-indigo-200">
                    Mendukung penyampaian edukasi kesehatan kepada masyarakat.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500 text-white p-3 rounded-full flex-shrink-0">
                  <i className="fas fa-database"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Data Terpusat</h3>
                  <p className="text-sm text-indigo-200">
                    Menyediakan data kesehatan warga berbasis RT/RW untuk
                    perencanaan.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500 text-white p-3 rounded-full flex-shrink-0">
                  <i className="fas fa-users-cog"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Kapasitas Kader</h3>
                  <p className="text-sm text-indigo-200">
                    Meningkatkan kapasitas kader dalam pengelolaan data digital.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-indigo-500 rounded-full opacity-30"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-indigo-500 rounded-full opacity-30"></div>
        </div>

        <div className="w-full p-8 md:p-12">
          <div id="login-form-container" className="relative">
            <div id="login-form" className="transition-all duration-500">
              <h2 className="mb-3 text-3xl font-bold text-gray-800">Login</h2>
              <p className="mb-8 text-sm text-gray-600">
                Selamat datang kembali! Silakan masuk ke akun Anda.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="py-3">
                  <label
                    htmlFor="email"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg placeholder:font-light placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="py-3">
                  <label
                    htmlFor="password"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-full p-3 border border-gray-300 rounded-lg placeholder:font-light placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div
                  id="login-error"
                  className="text-red-500 text-sm mt-2 text-center h-5"
                >
                  {error && <p>{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Login"}
                </button>
              </form>
              {/* Link registrasi dihapus */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
