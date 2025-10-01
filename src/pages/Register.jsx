import React from 'react';

const Register = ({ onRegister, onToggleForm }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister();
  };

  return (
    <div className="w-full p-8 md:p-12">
      <div id="register-form-container" className="relative">
        <div id="register-form" classN  ame="transition-all duration-500">
          <h2 className="mb-3 text-3xl font-bold text-gray-800">Daftar Akun Baru</h2>
          <p className="mb-8 text-sm text-gray-600">Buat akun untuk mulai menggunakan SiCerdas.</p>
          <form onSubmit={handleSubmit}>
            <div className="py-3">
              <label htmlFor="reg-name" className="mb-2 text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" id="reg-name" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="py-3">
              <label htmlFor="reg-email" className="mb-2 text-sm font-medium text-gray-700">Alamat Email</label>
              <input type="email" id="reg-email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="py-3">
              <label htmlFor="reg-password" className="mb-2 text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="reg-password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <button type="submit" className="w-full mt-4 bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Daftar
            </button>
          </form>
          <div className="mt-8 text-center text-gray-500">
            Sudah punya akun?
            <a href="#" onClick={onToggleForm} className="font-semibold text-indigo-600 hover:underline">Login di sini</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
