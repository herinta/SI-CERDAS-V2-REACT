import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useData } from '../contexts/DataContext'; // <-- 1. IMPORT hook useData
import { callGemini } from '../api/gemini'; // Asumsikan path ini benar
import { useToast } from '../contexts/ToastContext'; // 1. Impor hook useToast
import { useConfirmation } from '../contexts/ConfirmationContext';
import DetailModal from '../components/DetailModal';

// Komponen Modal tidak perlu diubah
const Modal = ({ title, content, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="md:text-2xl">&times;</button>
      </div>
      <div>{content}</div>
    </div>
  </div>
);

const SaragaForm = () => {
  // 2. Ambil data dan fungsi dari Context
  const { wargaList, loading, addWarga, updateWarga, deleteWarga } = useData();
  const { showToast } = useToast(); 
  const { askForConfirmation } = useConfirmation();

  const initialFormState = { id: null, nama: '', rt: '' };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');
  const [pasteData, setPasteData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading khusus untuk form submit
   const [detailItem, setDetailItem] = useState(null);

  const handleShowDetail = (item) => setDetailItem(item);
  const handleCloseDetail = () => setDetailItem(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('saraga-', '')]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = { nama: formData.nama, rt: formData.rt };

    let result;
    if (editingId !== null) {
      result = await supabase.from('saraga').update(dataToSubmit).eq('id', editingId).select().single();
    } else {
      result = await supabase.from('saraga').insert([dataToSubmit]).select().single();
    }

    const { data: newOrUpdatedData, error } = result;

    if (error) {
      console.error('Error saving data:', error);
      showToast('Gagal menyimpan data.');
    } else {
      showToast(`Data berhasil ${editingId ? 'diperbarui' : 'disimpan'}!`);
      
      // 3. Panggil fungsi dari Context
      if (editingId) {
        updateWarga(newOrUpdatedData);
      } else {
        addWarga(newOrUpdatedData);
      }

      setEditingId(null);
      setFormData(initialFormState);
      setView('list');
    }
    setIsSubmitting(false);
  };

  const handleEdit = (item) => {
    setFormData({ id: item.id, nama: item.nama, rt: item.rt });
    setEditingId(item.id);
    setView('form');
  };

  const handleDelete = async (id) => {
     const confirmed = await askForConfirmation({
      title: 'Hapus Data Warga',
      message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'
    });
    if (confirmed) {
      const { error } = await supabase.from('saraga').delete().eq('id', id);
      if (error) {
        console.error('Error deleting data:', error);
        showToast('Gagal menghapus data.');
      } else {
        showToast('Data berhasil dihapus.');
        // 4. Panggil fungsi dari Context
        deleteWarga(id);
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
      showToast("Harap tempelkan data warga di dalam kotak teks.");
      return;
    }
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
      showToast("Gagal mengekstrak data. Pastikan format teks benar.");
    }
  };

  if (view === 'list') {
    return (
      <div className="bg-white p-3 sm:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-2xl font-bold text-slate-800">Data Warga </h2>
          <button onClick={handleAddNew} className="text-xs md:text-md bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">Tambah Data</button>
        </div>
        <div className="overflow-x-auto">
          {/* 5. Gunakan loading.warga dari context */}
          {loading.warga ? (
            <p>Memuat data warga...</p>
          ) : (
            <table className="w-full min-w-max text-left">
              <thead className="bg-slate-100 px-10">
                <tr className='px-5'>
                  <th className="p-3 text-xs md:text-sm font-semibold">Nama</th>
                  <th className="p-3 text-xs md:text-sm font-semibold">RT/RW</th>
                  <th className="p-3 text-xs md:text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {wargaList.map(item => (
                  <tr key={item.id} className="border-b text">
                    <td className="p-3  text-xs md:text-sm">{item.nama}</td>
                    <td className="p-3  text-xs md:text-sm">{item.rt}</td>
                    <td className="p-3  text-xs md:text-sm flex gap-2 ">
                      <button onClick={() => handleShowDetail(item)} className="text-white hover:text-sky-700 bg-blue-400 py-1 px-2 md:py-1.5 rounded hover:bg-blue-100 text-xs md:text-sm md:px-3" title="Lihat Detail">Detail</button>
                      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
         <DetailModal isOpen={!!detailItem} onClose={handleCloseDetail} title="Detail Data Warga" data={detailItem || {}} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-2xl font-bold text-slate-800">{editingId ? 'Edit Data Warga' : 'Tambah Data Warga'}</h2>
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
          <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300">
            {isSubmitting ? 'Menyimpan...' : (editingId ? 'Update Data' : 'Simpan Data')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaragaForm;
