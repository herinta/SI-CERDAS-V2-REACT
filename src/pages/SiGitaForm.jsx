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

const SiGitaForm = () => {
  const initialFormState = {
    id: null,
    nama: '',
    ttl: '',
    pj: '',
    rt: '',
    usia: '',
    bb: '',
    tb: '',
    lila: '',
    lk: '',
    lp: '',
    foodPic: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [balitaList, setBalitaList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [foodPreview, setFoodPreview] = useState('https://placehold.co/100x100/e0e0e0/757575?text=Foto+Makanan');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === 'list') {
      fetchBalita();
    }
  }, [view]);

  const fetchBalita = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sigita')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching balita:', error);
      alert('Gagal memuat data balita.');
    } else {
      setBalitaList(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'sigita-food-pic') {
      const file = files[0];
      setFormData(prev => ({ ...prev, foodPic: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setFoodPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [id.replace('sigita-', '')]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = formData.food_pic_url || null;

    if (formData.foodPic && typeof formData.foodPic !== 'string') {
      const file = formData.foodPic;
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Gagal mengunggah gambar.');
        setLoading(false);
        return;
      }
      
      const { data: urlData } = supabase.storage
        .from('food-images')
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const dataToSubmit = {
      nama: formData.nama,
      ttl: formData.ttl,
      pj: formData.pj,
      rt: formData.rt,
      usia_bulan: formData.usia,
      bb_kg: formData.bb,
      tb_cm: formData.tb,
      lila_cm: formData.lila,
      lk_cm: formData.lk,
      lp_cm: formData.lp,
      food_pic_url: imageUrl,
    };

    let error;
    if (editingId !== null) {
      const { error: updateError } = await supabase
        .from('sigita')
        .update(dataToSubmit)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('sigita')
        .insert([dataToSubmit]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data.');
    } else {
      alert(`Data balita berhasil ${editingId ? 'diperbarui' : 'disimpan'}!`);
      setEditingId(null);
      setFormData(initialFormState);
      setFoodPreview('https://placehold.co/100x100/e0e0e0/757575?text=Foto+Makanan');
      setView('list');
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      nama: item.nama,
      ttl: item.ttl,
      pj: item.pj,
      rt: item.rt,
      usia: item.usia_bulan,
      bb: item.bb_kg,
      tb: item.tb_cm,
      lila: item.lila_cm,
      lk: item.lk_cm,
      lp: item.lp_cm,
      foodPic: null,
      food_pic_url: item.food_pic_url,
    });
    setFoodPreview(item.food_pic_url || 'https://placehold.co/100x100/e0e0e0/757575?text=Foto+Makanan');
    setEditingId(item.id);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const { error } = await supabase
        .from('sigita')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting data:', error);
        alert('Gagal menghapus data.');
      } else {
        alert('Data berhasil dihapus.');
        fetchBalita();
      }
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setView('form');
  };

  const getFoodNutritionAnalysis = async () => { /* ... kode AI Anda ... */ };
  const getBalitaNutritionAdvice = async () => { /* ... kode AI Anda ... */ };

  if (view === 'list') {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Data Balita Tersimpan</h2>
          <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">Tambah Data</button>
        </div>
        <div className="overflow-x-auto">
          {loading ? <p>Memuat data...</p> : (
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-sm font-semibold">Nama</th>
                  <th className="p-3 text-sm font-semibold">Usia (bln)</th>
                  <th className="p-3 text-sm font-semibold">BB (kg)</th>
                  <th className="p-3 text-sm font-semibold">TB (cm)</th>
                  <th className="p-3 text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {balitaList.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.nama}</td>
                    <td className="p-3">{item.usia_bulan}</td>
                    <td className="p-3">{item.bb_kg}</td>
                    <td className="p-3">{item.tb_cm}</td>
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
      <form id="form-sigita" className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{editingId ? 'Edit Data Balita' : 'Tambah Data Balita'}</h2>
          <button type="button" onClick={() => setView('list')} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200">Kembali</button>
        </div>
        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">Informasi Dasar Balita</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sigita-nama" className="block text-sm font-medium text-gray-700">Nama</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-child text-gray-400"></i></span>
                <input type="text" id="sigita-nama" onChange={handleChange} value={formData.nama} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label htmlFor="sigita-ttl" className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-calendar-alt text-gray-400"></i></span>
                <input type="date" id="sigita-ttl" onChange={handleChange} value={formData.ttl} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label htmlFor="sigita-pj" className="block text-sm font-medium text-gray-700">Penanggung Jawab</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-user-shield text-gray-400"></i></span>
                <input type="text" id="sigita-pj" onChange={handleChange} value={formData.pj} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label htmlFor="sigita-rt" className="block text-sm font-medium text-gray-700">RT/RW</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-map-marker-alt text-gray-400"></i></span>
                <input type="text" id="sigita-rt" placeholder="001/002" onChange={handleChange} value={formData.rt} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label htmlFor="sigita-usia" className="block text-sm font-medium text-gray-700">Usia (bulan)</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-baby-carriage text-gray-400"></i></span>
                <input type="number" id="sigita-usia" onChange={handleChange} value={formData.usia} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
          </div>
        </fieldset>
        
        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">Data Pengukuran</legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            <div><label className="block text-sm font-medium text-gray-700">Berat (kg)</label><input type="number" id="sigita-bb" step="0.1" onChange={handleChange} value={formData.bb} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Tinggi (cm)</label><input type="number" id="sigita-tb" step="0.1" onChange={handleChange} value={formData.tb} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700">LILA (cm)</label><input type="number" id="sigita-lila" step="0.1" onChange={handleChange} value={formData.lila} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700">L. Kepala (cm)</label><input type="number" id="sigita-lk" step="0.1" onChange={handleChange} value={formData.lk} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700">L. Perut (cm)</label><input type="number" id="sigita-lp" step="0.1" onChange={handleChange} value={formData.lp} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">Analisis Gizi Makanan (AI)</legend>
          <div>
            <label htmlFor="sigita-food-pic" className="block text-sm font-medium text-gray-700">Unggah Foto Makanan Balita</label>
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
              <img id="sigita-food-preview" src={foodPreview} alt="Pratinjau Makanan" className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
              <input type="file" id="sigita-food-pic" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" accept="image/*" onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-end items-center pt-4 gap-4">
          <button type="button" onClick={getFoodNutritionAnalysis} className="w-full sm:w-auto bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition duration-200 flex items-center justify-center gap-2">✨ Analisis Gizi Foto</button>
          <button type="button" onClick={getBalitaNutritionAdvice} className="w-full sm:w-auto bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition duration-200 flex items-center justify-center gap-2">✨ Buat Saran Gizi</button>
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300">
            {loading ? 'Menyimpan...' : (editingId ? 'Update Data' : 'Simpan Data')}
          </button>
        </div>
      </form>
      {isModalOpen && <Modal title={modalTitle} content={modalContent} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default SiGitaForm;
