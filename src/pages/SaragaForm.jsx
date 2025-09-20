import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useData } from "../contexts/DataContext";
import { callGemini } from "../api/gemini";
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

const SaragaForm = () => {
  const { wargaList, loading, addWarga, updateWarga, deleteWarga } = useData();
  const { showToast } = useToast();
  const { askForConfirmation } = useConfirmation();

  const initialFormState = { id: null, nama: "", rt: "", gender: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [selectedRW, setSelectedRW] = useState(""); // ✅ filter RW

  const handleShowDetail = (item) => setDetailItem(item);
  const handleCloseDetail = () => setDetailItem(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id.replace("saraga-", "")]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = {
      nama: formData.nama,
      rt: formData.rt,
      gender: formData.gender,
    };

    let result;
    if (editingId !== null) {
      result = await supabase
        .from("saraga")
        .update(dataToSubmit)
        .eq("id", editingId)
        .select()
        .single();
    } else {
      result = await supabase
        .from("saraga")
        .insert([dataToSubmit])
        .select()
        .single();
    }

    const { data: newOrUpdatedData, error } = result;

    if (error) {
      console.error("Error saving data:", error);
      showToast("Gagal menyimpan data.");
    } else {
      showToast(`Data berhasil ${editingId ? "diperbarui" : "disimpan"}!`);
      if (editingId) {
        updateWarga(newOrUpdatedData);
      } else {
        addWarga(newOrUpdatedData);
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
      rt: item.rt,
      gender: item.gender,
    });
    setEditingId(item.id);
    setView("form");
  };

  const handleDelete = async (id) => {
    const confirmed = await askForConfirmation({
      title: "Hapus Cargiever",
      message:
        "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
    });
    if (confirmed) {
      const { error } = await supabase.from("saraga").delete().eq("id", id);
      if (error) {
        console.error("Error deleting data:", error);
        showToast("Gagal menghapus data.");
      } else {
        showToast("Data berhasil dihapus.");
        deleteWarga(id);
      }
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setView("form");
  };

  // ✅ Ambil daftar RW unik dari data
  const uniqueRWs = [
    ...new Set(
      wargaList.map((w) => (w.rt.includes("/") ? w.rt.split("/")[1] : ""))
    ),
  ].filter((rw) => rw !== "");

  // ✅ Sort dan filter data sebelum render
  const filteredWarga = [...wargaList]
    .sort((a, b) => {
      const rwA = parseInt(a.rt.split("/")[1] || 0, 10);
      const rwB = parseInt(b.rt.split("/")[1] || 0, 10);
      return rwA - rwB;
    })
    .filter((item) =>
      selectedRW ? item.rt.split("/")[1] === selectedRW : true
    );

  if (view === "list") {
    return (
      <div className="bg-white p-3 sm:p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
          <h2 className="md:text-2xl font-bold text-slate-800">Data Cargiever</h2>
          <div className="flex gap-3">
            {/* ✅ Dropdown filter RW */}
            <select
              value={selectedRW}
              onChange={(e) => setSelectedRW(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Semua RW</option>
              {uniqueRWs.map((rw) => (
                <option key={rw} value={rw}>
                  RW {rw}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddNew}
              className="text-xs md:text-md bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Tambah Data
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading.warga ? (
            <p>Memuat data cargiever...</p>
          ) : (
            <table className="w-full min-w-max text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-xs md:text-sm font-semibold">Nama</th>
                  <th className="p-3 text-xs md:text-sm font-semibold">
                    RT/RW
                  </th>
                  <th className="p-3 text-xs md:text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarga.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 text-xs md:text-sm">{item.nama}</td>
                    <td className="p-3 text-xs md:text-sm">{item.rt}</td>
                    <td className="p-3 text-xs md:text-sm flex gap-2">
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
          title="Detail Cargiever"
          data={detailItem || {}}
          fieldOrder={["nama", "gender", "rt", "yang_didampingi", "created_at"]}
          fieldLabels={{
            nama: "Nama Lengkap",
            gender: "Jenis Kelamin",
            rt: "RT/RW",
            yang_didampingi: "Data Yang Didampingi",
            created_at: "Waktu Input",
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-2xl font-bold text-slate-800">
          {editingId ? "Edit Data Cargiever" : "Tambah Data Cargiever"}
        </h2>
        <button
          type="button"
          onClick={() => setView("list")}
          className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200"
        >
          Kembali
        </button>
      </div>
      <hr className="my-6" />
      <form id="form-saraga" className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="saraga-nama"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="saraga-nama"
            onChange={handleChange}
            value={formData.nama}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="saraga-gender"
            className="block text-sm font-medium text-gray-700"
          >
            Jenis Kelamin
          </label>
          <select
            id="saraga-gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="saraga-rt"
            className="block text-sm font-medium text-gray-700"
          >
            RT/RW
          </label>
          <input
            type="text"
            id="saraga-rt"
            placeholder="001/002"
            onChange={handleChange}
            value={formData.rt}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          />
        </div>
                <div>
          <label
            htmlFor="saraga-yang_didampingi"
            className="block text-sm font-medium text-gray-700"
          >
            Data Yang Didampingi
          </label>
          <input
            type="text"
            id="saraga-yang_didampingi"
            onChange={handleChange}
            value={formData.yang_didampingi}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300"
          >
            {isSubmitting
              ? "Menyimpan..."
              : editingId
              ? "Update Data"
              : "Simpan Data"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaragaForm;
