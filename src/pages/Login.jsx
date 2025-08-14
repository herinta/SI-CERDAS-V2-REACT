import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard'); // Arahkan ke dashboard setelah login berhasil
    }
    setLoading(false);
  };

  return (
    <div className="w-full p-8 md:p-12">
      <div id="login-form-container" className="relative">
        <div id="login-form" className="transition-all duration-500">
          <h2 className="mb-3 text-3xl font-bold text-gray-800">Login</h2>
          <p className="mb-8 text-sm text-gray-600">Selamat datang kembali! Silakan masuk ke akun Anda.</p>
          <form onSubmit={handleSubmit}>
            <div className="py-3">
              <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">Alamat Email</label>
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
              <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">Password</label>
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
            <div id="login-error" className="text-red-500 text-sm mt-2 text-center h-5">
              {error && <p>{error}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full mt-4 bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>
          {/* Link registrasi dihapus */}
        </div>
      </div>
    </div>
  );
};

export default Login;
