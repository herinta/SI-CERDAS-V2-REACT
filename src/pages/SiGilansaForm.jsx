import React, { useState, useEffect } from "react";
import { callGemini } from "../api/gemini";
import { supabase } from "../supabaseClient";
import { useData } from "../contexts/DataContext";
import { useToast } from "../contexts/ToastContext";
import { useConfirmation } from "../contexts/ConfirmationContext";
import DetailModal from "../components/DetailModal";

const Modal = ({ title, content, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="md:text-2xl">
          &times;
        </button>
      </div>
      <div>{content}</div>
    </div>
  </div>
);

const SiGilansaForm = () => {
  const { lansiaList, loading, addLansia, updateLansia, deleteLansia } =
    useData();

  const initialFormState = {
    id: null,
    nama: "",
    ttl: "",
    usia: "",
    rt: "",
    bb: "",
    tb: "",
    td: "",
    gds: "",
    riwayat: "",
  };

  const { showToast } = useToast();
  const { askForConfirmation } = useConfirmation();

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState("list");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading khusus untuk submit

  // useEffect untuk fetch data sudah TIDAK DIPERLUKAN

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [detailItem, setDetailItem] = useState(null);

  const handleShowDetail = (item) => setDetailItem(item);
  const handleCloseDetail = () => setDetailItem(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id.replace("sigilansa-", "")]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = {
      nama: formData.nama,
      ttl: formData.ttl || null,
      usia_tahun: formData.usia ? parseInt(formData.usia, 10) : null,
      rt: formData.rt,
      bb_kg: formData.bb ? parseFloat(formData.bb) : null,
      tb_cm: formData.tb ? parseFloat(formData.tb) : null,
      td: formData.td,
      gds: formData.gds ? parseInt(formData.gds, 10) : null,
      riwayat_penyakit: formData.riwayat,
    };

    let result;
    if (editingId !== null) {
      result = await supabase
        .from("sigilansa")
        .update(dataToSubmit)
        .eq("id", editingId)
        .select()
        .single();
    } else {
      result = await supabase
        .from("sigilansa")
        .insert([dataToSubmit])
        .select()
        .single();
    }

    const { data: newOrUpdatedData, error } = result;

    if (error) {
      console.error("Error saving data:", error);
      showToast("Gagal menyimpan data.");
    } else {
      showToast(
        `Data lansia berhasil ${editingId ? "diperbarui" : "disimpan"}!`
      );

      // 3. Panggil fungsi dari Context
      if (editingId) {
        updateLansia(newOrUpdatedData);
      } else {
        addLansia(newOrUpdatedData);
      }

      setEditingId(null);
      setFormData(initialFormState);
      setView("list");
    }
    setIsSubmitting(false);
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
      gds: item.gds,
      riwayat: item.riwayat_penyakit,
    });
    setEditingId(item.id);
    setView("form");
  };

  const handleDelete = async (id) => {
    const confirmed = await askForConfirmation({
      title: "Hapus Data Lansia",
      message:
        "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
    });

    if (confirmed) {
      const { error } = await supabase.from("sigilansa").delete().eq("id", id);
      if (error) {
        console.error("Error deleting data:", error);
        showToast("Gagal menghapus data.");
      } else {
        showToast("Data berhasil dihapus.");
        // 4. Panggil fungsi dari Context
        deleteLansia(id);
      }
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setView("form");
  };

  const getLansiaRecommendation = async () => {
    /* ... kode AI Anda ... */
  };

  if (view === "list") {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-2xl font-bold text-slate-800">Data Lansia</h2>
          <button
            onClick={handleAddNew}
            className="text-xs md:text-md bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Tambah Data
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading.lansia ? (
            <p>Memuat data...</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-sm font-semibold">Nama</th>
                  <th className="p-3 text-sm font-semibold">RT/RW</th>
                  <th className="p-3 text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {lansiaList.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.nama}</td>
                    <td className="p-3">{item.rt}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleShowDetail(item)}
                        className="text-white hover:text-sky-700 bg-blue-400 py-1 px-2 md:py-1.5 rounded hover:bg-blue-100 text-xs md:text-sm md:px-3"
                        title="Lihat Detail"
                      >
                        Detail
                      </button>

                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <DetailModal
          isOpen={!!detailItem}
          onClose={handleCloseDetail}
          title="Detail Data Warga"
          data={detailItem || {}}
        />

        {isModalOpen && (
          <Modal
            title={modalTitle}
            content={modalContent}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <form id="form-sigilansa" className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="md:text-2xl font-bold text-slate-800">
            {editingId ? "Edit Data Lansia" : "Tambah Data Lansia"}
          </h2>
          <button
            type="button"
            onClick={() => setView("list")}
            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200"
          >
            Kembali
          </button>
        </div>
        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">
            Informasi Pribadi
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="sigilansa-nama"
                className="block text-sm font-medium text-gray-700"
              >
                Nama
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-user-alt text-gray-400"></i>
                </span>
                <input
                  type="text"
                  id="sigilansa-nama"
                  onChange={handleChange}
                  value={formData.nama}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="sigilansa-ttl"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal Lahir
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-calendar-alt text-gray-400"></i>
                </span>
                <input
                  type="date"
                  id="sigilansa-ttl"
                  onChange={handleChange}
                  value={formData.ttl}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="sigilansa-usia"
                className="block text-sm font-medium text-gray-700"
              >
                Usia (tahun)
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-birthday-cake text-gray-400"></i>
                </span>
                <input
                  type="number"
                  id="sigilansa-usia"
                  onChange={handleChange}
                  value={formData.usia}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="sigilansa-rt"
                className="block text-sm font-medium text-gray-700"
              >
                RT/RW
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-map-marker-alt text-gray-400"></i>
                </span>
                <input
                  type="text"
                  id="sigilansa-rt"
                  placeholder="001/002"
                  onChange={handleChange}
                  value={formData.rt}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">
            Pemeriksaan Kesehatan
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <label
                htmlFor="sigilansa-bb"
                className="block text-sm font-medium text-gray-700"
              >
                Berat (kg)
              </label>
              <input
                type="number"
                id="sigilansa-bb"
                step="0.1"
                onChange={handleChange}
                value={formData.bb}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="sigilansa-tb"
                className="block text-sm font-medium text-gray-700"
              >
                Tinggi (cm)
              </label>
              <input
                type="number"
                id="sigilansa-tb"
                step="0.1"
                onChange={handleChange}
                value={formData.tb}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="sigilansa-td"
                className="block text-sm font-medium text-gray-700"
              >
                Tensi Darah
              </label>
              <input
                type="text"
                id="sigilansa-td"
                placeholder="120/80"
                onChange={handleChange}
                value={formData.td}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="sigilansa-gds"
                className="block text-sm font-medium text-gray-700"
              >
                Gula Darah
              </label>
              <input
                type="number"
                id="sigilansa-gds"
                onChange={handleChange}
                value={formData.gds}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">
            Kondisi Kesehatan (AI)
          </legend>
          <div>
            <label
              htmlFor="sigilansa-riwayat"
              className="block text-sm font-medium text-gray-700"
            >
              Riwayat Penyakit & Keluhan
            </label>
            <textarea
              id="sigilansa-riwayat"
              rows="3"
              placeholder="Contoh: Punya riwayat hipertensi, sering merasa pusing dan pegal di leher..."
              onChange={handleChange}
              value={formData.riwayat}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            ></textarea>
          </div>
        </fieldset>
        <div className="flex flex-col sm:flex-row justify-end items-center pt-4 gap-4">
          <button
            type="button"
            onClick={getLansiaRecommendation}
            className="w-full sm:w-auto bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition duration-200 flex items-center justify-center gap-2"
          >
            ✨ Buat Rekomendasi
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300"
          >
            {isSubmitting
              ? "Menyimpan..."
              : editingId
              ? "Update Data"
              : "Simpan Data"}
          </button>
        </div>
      </form>
      {isModalOpen && (
        <Modal
          title={modalTitle}
          content={modalContent}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SiGilansaForm;
