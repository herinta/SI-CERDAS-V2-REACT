import React, { useState, useEffect } from 'react';
import { callGemini } from '../api/gemini';
import { supabase } from '../supabaseClient';

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

const SiGiremaForm = () => {
  const initialFormState = {
    id: null,
    nama: '',
    ttl: '',
    usia: '',
    rt: '',
    bb: '',
    tb: '',
    td: '',
    hb: '',
    anemia: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [remajaList, setRemajaList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === 'list') {
      fetchRemaja();
    }
  }, [view]);

  const fetchRemaja = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sigirema')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching remaja:', error);
      alert('Gagal memuat data remaja.');
    } else {
      setRemajaList(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('sigirema-', '')]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      nama: formData.nama,
      ttl: formData.ttl,
      usia_tahun: formData.usia,
      rt: formData.rt,
      bb_kg: formData.bb,
      tb_cm: formData.tb,
      td: formData.td,
      hb: formData.hb,
      anemia_symptoms: formData.anemia,
    };

    let error;
    if (editingId !== null) {
      const { error: updateError } = await supabase
        .from('sigirema')
        .update(dataToSubmit)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('sigirema')
        .insert([dataToSubmit]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data.');
    } else {
      alert(`Data remaja berhasil ${editingId ? 'diperbarui' : 'disimpan'}!`);
      setEditingId(null);
      setFormData(initialFormState);
      setView('list');
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      nama: item.nama,
      ttl: item.ttl,
      usia: item.usia_tahun,
      rt: item.rt,
      bb: item.bb_kg,
      tb: item.tb_cm,
      td: item.td,
      hb: item.hb,
      anemia: item.anemia_symptoms,
    });
    setEditingId(item.id);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const { error } = await supabase
        .from('sigirema')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting data:', error);
        alert('Gagal menghapus data.');
      } else {
        alert('Data berhasil dihapus.');
        fetchRemaja();
      }
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setView('form');
  };
  
  const getRemajaAnemiaAnalysis = async () => { /* ... kode AI Anda ... */ };

  if (view === 'list') {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Data Remaja Tersimpan</h2>
          <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">Tambah Data</button>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p>Memuat data...</p> : (
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-sm font-semibold">Nama</th>
                  <th className="p-3 text-sm font-semibold">Usia (thn)</th>
                  <th className="p-3 text-sm font-semibold">Tensi</th>
                  <th className="p-3 text-sm font-semibold">HB</th>
                  <th className="p-3 text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {remajaList.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.nama}</td>
                    <td className="p-3">{item.usia_tahun}</td>
                    <td className="p-3">{item.td}</td>
                    <td className="p-3">{item.hb}</td>
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
        {isModalOpen && <Modal title={modalTitle} content={modalContent} onClose={() => setIsModalOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <form id="form-sigirema" className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{editingId ? 'Edit Data Remaja' : 'Tambah Data Remaja'}</h2>
          <button type="button" onClick={() => setView('list')} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200">Kembali</button>
        </div>
        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">Informasi Dasar Remaja</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label htmlFor="sigirema-nama" className="block text-sm font-medium text-gray-700">Nama</label><div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-user text-gray-400"></i></span><input type="text" id="sigirema-nama" onChange={handleChange} value={formData.nama} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div></div>
            <div><label htmlFor="sigirema-ttl" className="block text-sm font-medium text-gray-700">Tanggal Lahir</label><div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-calendar-alt text-gray-400"></i></span><input type="date" id="sigirema-ttl" onChange={handleChange} value={formData.ttl} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div></div>
            <div><label htmlFor="sigirema-usia" className="block text-sm font-medium text-gray-700">Usia (tahun)</label><div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-birthday-cake text-gray-400"></i></span><input type="number" id="sigirema-usia" onChange={handleChange} value={formData.usia} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div></div>
            <div><label htmlFor="sigirema-rt" className="block text-sm font-medium text-gray-700">RT/RW</label><div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-map-marker-alt text-gray-400"></i></span><input type="text" id="sigirema-rt" placeholder="001/002" onChange={handleChange} value={formData.rt} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div></div>
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">Pemeriksaan Kesehatan</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div><label htmlFor="sigirema-bb" className="block text-sm font-medium text-gray-700">Berat (kg)</label><input type="number" id="sigirema-bb" step="0.1" onChange={handleChange} value={formData.bb} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" /></div>
            <div><label htmlFor="sigirema-tb" className="block text-sm font-medium text-gray-700">Tinggi (cm)</label><input type="number" id="sigirema-tb" step="0.1" onChange={handleChange} value={formData.tb} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" /></div>
            <div><label htmlFor="sigirema-td" className="block text-sm font-medium text-gray-700">Tensi Darah</label><input type="text" id="sigirema-td" placeholder="120/80" onChange={handleChange} value={formData.td} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" /></div>
            <div><label htmlFor="sigirema-hb" className="block text-sm font-medium text-gray-700">Kadar HB</label><input type="number" id="sigirema-hb" step="0.1" onChange={handleChange} value={formData.hb} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" /></div>
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">Skrining Anemia (AI)</legend>
          <div>
            <label htmlFor="sigirema-anemia" className="block text-sm font-medium text-gray-700">Gejala yang Dirasakan</label>
            <textarea id="sigirema-anemia" rows="3" placeholder="Contoh: Sering pusing, mudah lelah, wajah pucat..." onChange={handleChange} value={formData.anemia} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
        </fieldset>
        <div className="flex flex-col sm:flex-row justify-end items-center pt-4 gap-4">
          <button type="button" onClick={getRemajaAnemiaAnalysis} className="w-full sm:w-auto bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition duration-200 flex items-center justify-center gap-2">✨ Analisis Gejala Anemia</button>
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300">
            {loading ? 'Menyimpan...' : (editingId ? 'Update Data' : 'Simpan Data')}
          </button>
        </div>
      </form>
      {isModalOpen && <Modal title={modalTitle} content={modalContent} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default SiGiremaForm;
