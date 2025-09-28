import React, { useState, useCallback, useMemo, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useData } from "../contexts/DataContext";
import { useToast } from "../contexts/ToastContext";
import { useConfirmation } from "../contexts/ConfirmationContext";
import DetailSaraga from "../components/DetailModal/DetailSaraga";
import { Search } from "lucide-react";

const INITIAL_FORM_STATE = {
  id: null,
  nama: "",
  rt: "",
  rw: "",
  gender: "",
  nohp: "",
  // Kolom lama 'penyakit_warga' diganti dengan struktur baru
  keluarga_didampingi: [{ tahap: "", penyakit: "", intervensi: "" }],
};

const rwOptions = [
  "001",
  "002",
  "003",
  "004",
  "005",
  "006",
  "007",
  "008",
  "009",
  "010",
  "011",
  "012",
  "013",
];
const tahapOptions = ["Balita", "Remaja", "Dewasa", "Lansia"];

const SaragaForm = () => {
  // Hooks dari Context (struktur asli Anda dipertahankan)
  const { wargaList, loading, addWarga, updateWarga, deleteWarga } = useData();
  const { showToast } = useToast();
  const { askForConfirmation } = useConfirmation();

  // State lokal komponen
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [selectedRW, setSelectedRW] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWarga = useMemo(() => {
    let filtered = wargaList.map((item) => ({
      ...item,
      rt_rw_display: `RT ${item.rt} / RW ${item.rw}`,
    }));
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.nama?.toLowerCase().includes(query)
      );
    }
    if (selectedRW) {
      filtered = filtered.filter((item) => item.rw === selectedRW);
    }
    return filtered.sort((a, b) => {
      const rwCompare = (a.rw || "").localeCompare(b.rw || "", undefined, {
        numeric: true,
      });
      if (rwCompare !== 0) return rwCompare;
      const rtA = parseInt(a.rt || 0, 10);
      const rtB = parseInt(b.rt || 0, 10);
      return rtA - rtB;
    });
  }, [wargaList, selectedRW, searchQuery]);

  const isEditing = editingId !== null;

  // Event handlers
  const handleShowDetail = useCallback((item) => setDetailItem(item), []);
  const handleCloseDetail = useCallback(() => setDetailItem(null), []);
  const handleSearchChange = useCallback(
    (e) => setSearchQuery(e.target.value),
    []
  );
  const handleChange = useCallback((e) => {
    const { name, value, id } = e.target;
    const fieldName = name || id.replace("saraga-", "");
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  // REVISI: Handler baru untuk mengubah data di dalam list keluarga
  const handleKeluargaChange = useCallback((index, event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const newList = [...prev.keluarga_didampingi];
      newList[index] = { ...newList[index], [name]: value };
      return { ...prev, keluarga_didampingi: newList };
    });
  }, []);

  // REVISI: Handler untuk menambah baris baru untuk data keluarga
  const handleAddKeluarga = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      keluarga_didampingi: [
        ...prev.keluarga_didampingi,
        { tahap: "", penyakit: "", intervensi: "" },
      ],
    }));
  }, []);

  // REVISI: Handler untuk menghapus baris data keluarga
  const handleRemoveKeluarga = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      keluarga_didampingi: prev.keluarga_didampingi.filter(
        (_, i) => i !== index
      ),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
  }, []);
  const handleAddNew = useCallback(() => {
    resetForm();
    setView("form");
  }, [resetForm]);
  const handleBackToList = useCallback(() => {
    setView("list");
    resetForm();
  }, [resetForm]);

  const saveData = async (dataToSubmit) => {
    if (isEditing) {
      return await supabase
        .from("saraga")
        .update(dataToSubmit)
        .eq("id", editingId)
        .select()
        .single();
    } else {
      return await supabase
        .from("saraga")
        .insert([dataToSubmit])
        .select()
        .single();
    }
  };

  // REVISI: Disesuaikan untuk mengirim struktur data baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanedKeluargaDidampingi = formData.keluarga_didampingi.filter(
        (k) => k.tahap?.trim() || k.penyakit?.trim() || k.intervensi?.trim()
      );
      const dataToSubmit = {
        nama: formData.nama.trim(),
        rt: formData.rt.trim(),
        rw: formData.rw,
        gender: formData.gender,
        nohp: formData.nohp.trim(),
        keluarga_didampingi: cleanedKeluargaDidampingi,
      };
      const { data: newOrUpdatedData, error } = await saveData(dataToSubmit);
      if (error) throw new Error(error.message);
      const successMessage = isEditing ? "diperbarui" : "disimpan";
      showToast(`Data berhasil ${successMessage}!`);
      if (isEditing) {
        updateWarga(newOrUpdatedData);
      } else {
        addWarga(newOrUpdatedData);
      }
      resetForm();
      setView("list");
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("Gagal menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // REVISI: Disesuaikan untuk memuat struktur data baru ke dalam form
  const handleEdit = useCallback((item) => {
    setFormData({
      id: item.id,
      nama: item.nama || "",
      rt: item.rt || "",
      rw: item.rw || "",
      gender: item.gender || "",
      nohp: item.nohp || "",
      keluarga_didampingi:
        item.keluarga_didampingi?.length > 0
          ? item.keluarga_didampingi
          : [{ tahap: "", penyakit: "", intervensi: "" }],
    });
    setEditingId(item.id);
    setView("form");
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmed = await askForConfirmation({
        title: "Hapus Caregiver",
        message: "Anda yakin ingin menghapus data ini?",
      });
      if (!confirmed) return;
      const { error } = await supabase.from("saraga").delete().eq("id", id);
      if (error) throw new Error(error.message);
      showToast("Data berhasil dihapus.");
      deleteWarga(id);
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Gagal menghapus data.");
    }
  };

  const renderFormField = (id, label, type = "text", options = {}) => {
    const fieldId = `saraga-${id}`;
    const value = formData[id] || "";
    return (
      <div key={id}>
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        {type === "select" ? (
          <select
            id={fieldId}
            name={id}
            value={value}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...options}
          >
            {" "}
            <option value="">Pilih {label}</option>{" "}
            {options.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {" "}
                {option.label}{" "}
              </option>
            ))}{" "}
          </select>
        ) : (
          <input
            type={type}
            id={fieldId}
            name={id}
            onChange={handleChange}
            value={value}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...options}
          />
        )}
      </div>
    );
  };

  const renderTableRow = (item) => (
    <tr key={item.id} className="border-b hover:bg-gray-50">
      <td className="p-3 text-xs md:text-sm">{item.nama}</td>
      <td className="p-3 text-xs md:text-sm">{item.rt_rw_display}</td>
      <td className="p-3 text-xs md:text-sm">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleShowDetail(item)}
            className="text-white bg-blue-400 hover:bg-blue-500 py-1 px-2 md:py-1.5 md:px-3 rounded transition duration-200 text-xs md:text-sm"
            title="Lihat Detail"
          >
            Detail
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="text-blue-500 hover:text-blue-700 transition duration-200"
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-500 hover:text-red-700 transition duration-200"
            title="Hapus"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );

  if (view === "list") {
    return (
      <div className="bg-white p-3 sm:p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
          <h2 className="md:text-2xl font-bold text-slate-800">
            Data Caregiver
          </h2>
          <button
            onClick={handleAddNew}
            className="text-xs md:text-md bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 self-end md:self-auto"
          >
            Tambah Data
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedRW}
            onChange={(e) => setSelectedRW(e.target.value)}
            className="text-sm border rounded px-3 py-2 min-w-[120px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Semua RW</option>
            {rwOptions.map((rw) => (
              <option key={rw} value={rw}>
                RW {rw}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          {loading.warga ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : filteredWarga.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">
                {searchQuery ? `Tidak ada data cocok` : "Tidak ada data"}
              </p>
            </div>
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
              <tbody>{filteredWarga.map(renderTableRow)}</tbody>
            </table>
          )}
        </div>
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Menampilkan {filteredWarga.length} hasil
          </div>
        )}
        <DetailSaraga
          isOpen={!!detailItem}
          onClose={handleCloseDetail}
          title="Detail Caregiver"
          data={detailItem || {}}
        />
      </div>
    );
  }

  // REVISI TOTAL: Tampilan Form
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-2xl font-bold text-slate-800">
          {isEditing ? "Edit Data " : "Tambah Datar"}
        </h2>
        <button
          type="button"
          onClick={handleBackToList}
          className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300"
        >
          Kembali
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Bagian 1: Data Diri Caregiver --- */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">
            Data Diri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFormField("nama", "Nama Lengkap", "text", {
              required: true,
            })}
            {renderFormField("gender", "Jenis Kelamin", "select", {
              options: [
                { value: "Laki-laki", label: "Laki-laki" },
                { value: "Perempuan", label: "Perempuan" },
              ],
            })}
            {renderFormField("nohp", "No. HP", "tel", {
              placeholder: "628xxxxxxxxxx",
            })}
            {renderFormField("rt", "RT", "text", { placeholder: "Contoh: 01" })}
            <div>
              <label
                htmlFor="saraga-rw"
                className="block text-sm font-medium text-gray-700"
              >
                RW
              </label>
              <select
                id="saraga-rw"
                name="rw"
                value={formData.rw}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Pilih RW</option>
                {rwOptions.map((rw) => (
                  <option key={rw} value={rw}>
                    RW {rw}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- Bagian 2: Data Keluarga Didampingi --- */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">
            Data Keluarga yang Didampingi
          </h3>
          <div className="space-y-4">
            {formData.keluarga_didampingi.map((keluarga, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end p-4 border rounded-lg bg-slate-50"
              >
                {/* Kolom Tahap Tumbuh Kembang */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tahap Tumbuh Kembang
                  </label>
                  <select
                    name="tahap"
                    value={keluarga.tahap}
                    onChange={(e) => handleKeluargaChange(index, e)}
                    className="block w-full text-sm px-3 py-2 bg-white border border-gray-300 rounded-md"
                  >
                    <option value="">Pilih Tahap</option>
                    {tahapOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Kolom Penyakit */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Penyakit
                  </label>
                  <input
                    type="text"
                    name="penyakit"
                    placeholder="Cth: Diabetes"
                    value={keluarga.penyakit}
                    onChange={(e) => handleKeluargaChange(index, e)}
                    className="block w-full text-sm px-3 py-2 bg-white border border-gray-300 rounded-md"
                  />
                </div>
                {/* Kolom Intervensi */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Intervensi
                  </label>
                  <input
                    type="text"
                    name="intervensi"
                    placeholder="Cth: Minum obat rutin"
                    value={keluarga.intervensi}
                    onChange={(e) => handleKeluargaChange(index, e)}
                    className="block w-full text-sm px-3 py-2 bg-white border border-gray-300 rounded-md"
                  />
                </div>
                {/* Tombol Hapus */}
                <div className="md:col-span-1">
                  {formData.keluarga_didampingi.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKeluarga(index)}
                      className="w-full bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200 text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
            {/* Tombol Tambah */}
            <button
              type="button"
              onClick={handleAddKeluarga}
              className="mt-2 text-sm bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-lg hover:bg-indigo-200"
            >
              + Tambah Keluarga
            </button>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-200"
          >
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
              ? "Update Data"
              : "Simpan Data"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaragaForm;
