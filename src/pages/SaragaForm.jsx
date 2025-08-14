import React, { useState, useEffect } from 'react';
import { callGemini } from '../api/gemini';
import { supabase } from '../supabaseClient'; // <-- 1. IMPORT SUPABASE

const Modal = ({ title, content, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="text-2xl">&times;</button>
      </div>
      <div>{content}</div>
    </div>
  </div>
);

const SaragaForm = () => {
  const initialFormState = {
    id: null,
    nama: '',
    rt: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [wargaList, setWargaList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');
  const [pasteData, setPasteData] = useState('');
  const [loading, setLoading] = useState(false);

  // <-- 2. READ: Mengambil data dari Supabase saat komponen dimuat
  useEffect(() => {
    if (view === 'list') {
      fetchWarga();
    }
  }, [view]);

  const fetchWarga = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('saraga')
      .select('*')
      .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

    if (error) {
      console.error('Error fetching warga:', error);
      alert('Gagal memuat data warga.');
    } else {
      setWargaList(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('saraga-', '')]: value }));
  };

  // <-- 3. CREATE & UPDATE: Menyimpan atau memperbarui data ke Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // NIK dan KK dihapus dari data yang akan dikirim
    const dataToSubmit = {
      nama: formData.nama,
      rt: formData.rt,
    };

    let error;
    if (editingId !== null) {
      // UPDATE
      const { error: updateError } = await supabase
        .from('saraga')
        .update(dataToSubmit)
        .eq('id', editingId);
      error = updateError;
    } else {
      // CREATE
      const { error: insertError } = await supabase
        .from('saraga')
        .insert([dataToSubmit]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data.');
    } else {
      alert(`Data warga berhasil ${editingId ? 'diperbarui' : 'disimpan'}!`);
      setEditingId(null);
      setFormData(initialFormState);
      setView('list'); // Otomatis kembali ke daftar dan memicu useEffect untuk refresh
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    // NIK dan KK dihapus dari form edit
    setFormData({
      id: item.id,
      nama: item.nama,
      rt: item.rt,
    });
    setEditingId(item.id);
    setView('form');
  };

  // <-- 4. DELETE: Menghapus data dari Supabase
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const { error } = await supabase
        .from('saraga')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting data:', error);
        alert('Gagal menghapus data.');
      } else {
        alert('Data berhasil dihapus.');
        fetchWarga(); // Refresh data setelah hapus
      }
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setView('form');
  };

  const autofillSaragaForm = async () => {
    if (!pasteData.trim()) {
        alert("Harap tempelkan data warga di dalam kotak teks.");
        return;
    }
    // NIK dan KK dihapus dari skema AI
    const schema = {
        type: "OBJECT",
        properties: {
            nama: { type: "STRING" },
            rt_rw: { type: "STRING" }
        },
        required: ["nama", "rt_rw"]
    };
    const prompt = `Ekstrak informasi berikut dari teks dan kembalikan sebagai JSON yang valid. Abaikan informasi lain. Teks: "${pasteData}"`;
    const result = await callGemini(prompt, null, schema);
    if (result) {
        setFormData(prev => ({
            ...prev,
            nama: result.nama || prev.nama,
            rt: result.rt_rw || prev.rt,
        }));
    } else {
        alert("Gagal mengekstrak data. Pastikan format teks benar.");
    }
  };

  if (view === 'list') {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Data Warga Tersimpan</h2>
          <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">Tambah Data</button>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p>Memuat data...</p> : (
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-sm font-semibold">Nama</th>
                  <th className="p-3 text-sm font-semibold">RT/RW</th>
                  <th className="p-3 text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {wargaList.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.nama}</td>
                    <td className="p-3">{item.rt}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{editingId ? 'Edit Data Warga' : 'Tambah Data Warga'}</h2>
            <button type="button" onClick={() => setView('list')} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200">Kembali</button>
        </div>
        <div className="mb-6">
          <label htmlFor="saraga-paste-box" className="block text-sm font-medium text-gray-700">Tempel Data Warga di Sini</label>
          <textarea id="saraga-paste-box" rows="4" value={pasteData} onChange={(e) => setPasteData(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: Nama: Budi Santoso, RT/RW: 001/005"></textarea>
          <button id="autofill-btn" onClick={autofillSaragaForm} className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2"> <i className="fas fa-magic-wand-sparkles"></i> ✨ Isi Otomatis dari Teks </button>
        </div>
        <hr className="my-6" />
        <form id="form-saraga" className="space-y-6" onSubmit={handleSubmit}>
          <div><label htmlFor="saraga-nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label><div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-user text-gray-400"></i></span><input type="text" id="saraga-nama" onChange={handleChange} value={formData.nama} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required /></div></div>
          <div><label htmlFor="saraga-rt" className="block text-sm font-medium text-gray-700">RT/RW</label><div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-map-marker-alt text-gray-400"></i></span><input type="text" id="saraga-rt" placeholder="001/002" onChange={handleChange} value={formData.rt} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" /></div></div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300">
              {loading ? 'Menyimpan...' : (editingId ? 'Update Data' : 'Simpan Data')}
            </button>
          </div>
        </form>
    </div>
  );
};

export default SaragaForm;
