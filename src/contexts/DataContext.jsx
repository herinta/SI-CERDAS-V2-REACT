import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar

// 1. Membuat Context
const DataContext = createContext();

// Hook kustom untuk mempermudah penggunaan
export const useData = () => {
  return useContext(DataContext);
};

// 2. Membuat Provider (Penyedia Data)
export const DataProvider = ({ children }) => {
  // State untuk setiap jenis data
  const [wargaList, setWargaList] = useState([]);
  const [lansiaList, setLansiaList] = useState([]);
  const [remajaList, setRemajaList] = useState([]);
  const [balitaList, setBalitaList] = useState([]);

  // State loading untuk setiap jenis data agar lebih spesifik
  const [loading, setLoading] = useState({
    warga: true,
    lansia: true,
    remaja: true,
    balita: true,
  });

  // Fetch semua data secara bersamaan saat provider dimuat
  useEffect(() => {
    const fetchAllData = async () => {
      // Promise.all menjalankan semua fetch secara paralel untuk efisiensi
      const [wargaData, lansiaData, remajaData, balitaData] = await Promise.all([
        supabase.from('saraga').select('*').order('created_at', { ascending: false }),
        supabase.from('sigilansa').select('*').order('created_at', { ascending: false }),
        supabase.from('sigirema').select('*').order('created_at', { ascending: false }),
        supabase.from('sigita').select('*').order('created_at', { ascending: false }),
      ]);

      // Set data jika tidak ada error
      if (!wargaData.error) setWargaList(wargaData.data);
      if (!lansiaData.error) setLansiaList(lansiaData.data);
      if (!remajaData.error) setRemajaList(remajaData.data);
      if (!balitaData.error) setBalitaList(balitaData.data);
      
      // Handle error (opsional, bisa ditambahkan logging)
      if (wargaData.error) console.error("Error fetching warga:", wargaData.error);
      if (lansiaData.error) console.error("Error fetching lansia:", lansiaData.error);
      if (remajaData.error) console.error("Error fetching remaja:", remajaData.error);
      if (balitaData.error) console.error("Error fetching balita:", balitaData.error);

      // Set semua loading menjadi false setelah selesai
      setLoading({ warga: false, lansia: false, remaja: false, balita: false });
    };

    fetchAllData();
  }, []); // Dependency kosong, hanya berjalan sekali

  // Kumpulan fungsi untuk memanipulasi state (CRUD)
  const crudFunctions = {
    // Warga (Saraga)
    addWarga: (newWarga) => setWargaList(prev => [newWarga, ...prev]),
    updateWarga: (updated) => setWargaList(prev => prev.map(i => i.id === updated.id ? updated : i)),
    deleteWarga: (id) => setWargaList(prev => prev.filter(i => i.id !== id)),
    
    // Lansia (SiGilansa)
    addLansia: (newLansia) => setLansiaList(prev => [newLansia, ...prev]),
    updateLansia: (updated) => setLansiaList(prev => prev.map(i => i.id === updated.id ? updated : i)),
    deleteLansia: (id) => setLansiaList(prev => prev.filter(i => i.id !== id)),

    // Remaja (SiGirema)
    addRemaja: (newRemaja) => setRemajaList(prev => [newRemaja, ...prev]),
    updateRemaja: (updated) => setRemajaList(prev => prev.map(i => i.id === updated.id ? updated : i)),
    deleteRemaja: (id) => setRemajaList(prev => prev.filter(i => i.id !== id)),

    // Balita (SiGita)
    addBalita: (newBalita) => setBalitaList(prev => [newBalita, ...prev]),
    updateBalita: (updated) => setBalitaList(prev => prev.map(i => i.id === updated.id ? updated : i)),
    deleteBalita: (id) => setBalitaList(prev => prev.filter(i => i.id !== id)),
  };

  // Nilai yang akan dibagikan
  const value = {
    wargaList,
    lansiaList,
    remajaList,
    balitaList,
    loading,
    ...crudFunctions,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
