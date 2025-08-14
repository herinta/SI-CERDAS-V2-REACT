import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// 1. Buat Context
export const AuthContext = createContext();

// 2. Buat Provider Component
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil sesi yang sedang berjalan saat aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Cek perubahan status autentikasi (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Jika ada sesi (user login), ambil data profilnya dari tabel 'profiles'
    if (session?.user) {
      setLoading(true);
      const fetchUserProfile = async () => {
        // Query ini mengambil data dari 'profiles' dan nama peran dari tabel 'roles'
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            full_name,
            role_id,
            roles ( name ) 
          `)
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (data) {
          // Susun ulang objek agar lebih mudah diakses di komponen lain
          const profile = {
            full_name: data.full_name,
            role: data.roles // Hasilnya akan menjadi objek seperti { name: 'admin' }
          };
          setUserProfile(profile);
        }
        setLoading(false);
      };

      fetchUserProfile();
    } else {
      setUserProfile(null); // Reset profil jika user logout
    }
  }, [session]);

  const value = {
    session,
    userProfile,
    loading,
  };

  // Tampilkan children hanya jika tidak sedang loading sesi awal
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
