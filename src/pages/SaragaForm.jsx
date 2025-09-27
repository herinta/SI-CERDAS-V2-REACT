import React, { useState, useCallback, useMemo, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useData } from "../contexts/DataContext";
import { useToast } from "../contexts/ToastContext";
import { useConfirmation } from "../contexts/ConfirmationContext";
import DetailModal from "../components/DetailModal";

// Constants
const INITIAL_FORM_STATE = {
  id: null,
  nama: "",
  rt: "",
  rw_id: "",
  gender: "",
  nohp: "",
  penyakit_warga: [""],
};

const FIELD_LABELS = {
  nama: "Nama Lengkap",
  gender: "Jenis Kelamin",
  rt_rw_display: "RT/RW",
  nohp: "No HP",
  penyakit_warga: "Penyakit yang Didampingi",
  created_at: "Waktu Input",
};

const FIELD_ORDER = ["nama", "gender", "rt_rw_display", "nohp", "penyakit_warga", "created_at"];

const SaragaForm = () => {
  // Hooks
  const { wargaList, loading, addWarga, updateWarga, deleteWarga } = useData();
  const { showToast } = useToast();
  const { askForConfirmation } = useConfirmation();

  // State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [selectedRW, setSelectedRW] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // New state for RW data
  const [rwList, setRwList] = useState([]);
  const [rwLoading, setRwLoading] = useState(true);

  // Fetch RW data
  const fetchRwData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('rw')
        .select('*')
        .order('nomor_rw');
      
      if (error) throw error;
      setRwList(data || []);
    } catch (error) {
      console.error('Error fetching RW data:', error);
      showToast('Gagal memuat data RW');
    } finally {
      setRwLoading(false);
    }
  }, [showToast]);

  // Load RW data on mount
  useEffect(() => {
    fetchRwData();
  }, [fetchRwData]);

  // Computed values
  const uniqueRWs = useMemo(() => {
    return rwList.map(rw => rw.nomor_rw);
  }, [rwList]);

  const filteredWarga = useMemo(() => {
    let filtered = [...wargaList];

    // Filter by search query (nama)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.nama?.toLowerCase().includes(query)
      );
    }

    // Filter by RW
    if (selectedRW) {
      filtered = filtered.filter(item =>
        item.nomor_rw === selectedRW
      );
    }

    // Sort by RW then RT
    return filtered.sort((a, b) => {
      const rwA = parseInt(a.nomor_rw || 0, 10);
      const rwB = parseInt(b.nomor_rw || 0, 10);
      if (rwA !== rwB) return rwA - rwB;
      
      const rtA = parseInt(a.rt || 0, 10);
      const rtB = parseInt(b.rt || 0, 10);
      return rtA - rtB;
    });
  }, [wargaList, selectedRW, searchQuery]);

  const isEditing = editingId !== null;

  // Event handlers
  const handleShowDetail = useCallback((item) => setDetailItem(item), []);
  const handleCloseDetail = useCallback(() => setDetailItem(null), []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    const fieldName = id.replace("saraga-", "");
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const handlePenyakitWargaChange = useCallback((index, event) => {
    const { value } = event.target;
    setFormData((prev) => {
      const newPenyakitList = [...prev.penyakit_warga];
      newPenyakitList[index] = value;
      return { ...prev, penyakit_warga: newPenyakitList };
    });
  }, []);

  const handleAddPenyakitWarga = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      penyakit_warga: [...prev.penyakit_warga, ""],
    }));
  }, []);

  const handleRemovePenyakitWarga = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      penyakit_warga: prev.penyakit_warga.filter((_, i) => i !== index),
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

  // API operations - Updated to use view for getting data with RW info
  const saveData = async (dataToSubmit) => {
    if (isEditing) {
      return await supabase
        .from("saraga")
        .update(dataToSubmit)
        .eq("id", editingId)
        .select(`
          *,
          rw:rw_id (
            id,
            nomor_rw,
            keterangan
          )
        `)
        .single();
    } else {
      return await supabase
        .from('v_saraga_detail')
        .insert([dataToSubmit])
        .select(`
          *,
          rw:rw_id (
            id,
            nomor_rw,
            keterangan
          )
        `)
        .single();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const cleanedPenyakitWargaList = formData.penyakit_warga.filter(
        (p) => p.trim() !== ""
      );

      const dataToSubmit = {
        nama: formData.nama.trim(),
        rt: formData.rt.trim(),
        rw_id: parseInt(formData.rw_id) || null,
        gender: formData.gender,
        nohp: formData.nohp.trim(),
        penyakit_warga: cleanedPenyakitWargaList,
      };

      const { data: newOrUpdatedData, error } = await saveData(dataToSubmit);

      if (error) {
        throw new Error(error.message);
      }

      // Transform data to include rt_rw_display
      const transformedData = {
        ...newOrUpdatedData,
        nomor_rw: newOrUpdatedData.rw?.nomor_rw,
        rt_rw_display: `RT ${newOrUpdatedData.rt} / RW ${newOrUpdatedData.rw?.nomor_rw}`,
        rw_keterangan: newOrUpdatedData.rw?.keterangan,
      };

      const successMessage = isEditing ? "diperbarui" : "disimpan";
      showToast(`Data berhasil ${successMessage}!`);

      if (isEditing) {
        updateWarga(transformedData);
      } else {
        addWarga(transformedData);
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

  const handleEdit = useCallback((item) => {
    setFormData({
      id: item.id,
      nama: item.nama || "",
      rt: item.rt || "",
      rw_id: item.rw_id || "",
      gender: item.gender || "",
      nohp: item.nohp || "",
      penyakit_warga:
        item.penyakit_warga && item.penyakit_warga.length > 0
          ? item.penyakit_warga
          : [""],
    });
    setEditingId(item.id);
    setView("form");
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmed = await askForConfirmation({
        title: "Hapus Caregiver",
        message:
          "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
      });

      if (!confirmed) return;

      const { error } = await supabase.from("saraga").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      showToast("Data berhasil dihapus.");
      deleteWarga(id);
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Gagal menghapus data.");
    }
  };

  // Render methods
  const renderFormField = (id, label, type = "text", options = {}) => {
    const fieldId = `saraga-${id}`;
    const value = formData[id] || "";

    return (
      <div key={id}>
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {type === "select" ? (
          <select
            id={fieldId}
            value={value}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...options}
          >
            <option value="">Pilih {label}</option>
            {options.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={fieldId}
            onChange={handleChange}
            value={value}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...options}
          />
        )}
      </div>
    );
  };

  const renderPenyakitWargaFields = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Penyakit Warga yang Didampingi
      </label>
      {formData.penyakit_warga.map((penyakit, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder={`Penyakit ${index + 1}`}
            value={penyakit}
            onChange={(e) => handlePenyakitWargaChange(index, e)}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formData.penyakit_warga.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemovePenyakitWarga(index)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
              title="Hapus penyakit"
            >
              &minus;
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddPenyakitWarga}
        className="mt-2 text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
      >
        + Tambah Penyakit
      </button>
    </div>
  );

  const renderTableRow = (item) => (
    <tr key={item.id} className="border-b hover:bg-gray-50">
      <td className="p-3 text-xs md:text-sm">{item.nama}</td>
      <td className="p-3 text-xs md:text-sm">{item.rt_rw_display || `RT ${item.rt} / RW ${item.nomor_rw}`}</td>
      <td className="p-3 text-xs md:text-sm">
        <div className="flex gap-2">
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

  // Main render
  if (view === "list") {
    return (
      <div className="bg-white p-3 sm:p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
          <h2 className="md:text-2xl font-bold text-slate-800">Data Caregiver</h2>
          <button
            onClick={handleAddNew}
            className="text-xs md:text-md bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 self-end md:self-auto"
          >
            Tambah Data
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedRW}
            onChange={(e) => setSelectedRW(e.target.value)}
            className="border rounded px-3 py-2 min-w-[120px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={rwLoading}
          >
            <option value="">Semua RW</option>
            {rwList.map((rw) => (
              <option key={rw.id} value={rw.nomor_rw}>
                RW {rw.nomor_rw}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading.warga ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Memuat data caregiver...</p>
            </div>
          ) : filteredWarga.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">
                {searchQuery ? `Tidak ada data yang cocok dengan "${searchQuery}"` : "Tidak ada data caregiver"}
              </p>
            </div>
          ) : (
            <table className="w-full min-w-max text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-xs md:text-sm font-semibold">Nama</th>
                  <th className="p-3 text-xs md:text-sm font-semibold">RT/RW</th>
                  <th className="p-3 text-xs md:text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarga.map(renderTableRow)}
              </tbody>
            </table>
          )}
        </div>

        {/* Search result info */}
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Menampilkan {filteredWarga.length} hasil untuk "{searchQuery}"
          </div>
        )}

        {/* Detail Modal */}
        <DetailModal
          isOpen={!!detailItem}
          onClose={handleCloseDetail}
          title="Detail Caregiver"
          data={detailItem || {}}
          fieldOrder={FIELD_ORDER}
          fieldLabels={FIELD_LABELS}
        />
      </div>
    );
  }

  // Form View
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      {/* Form Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-2xl font-bold text-slate-800">
          {isEditing ? "Edit Data Caregiver" : "Tambah Data Caregiver"}
        </h2>
        <button
          type="button"
          onClick={handleBackToList}
          className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200"
        >
          Kembali
        </button>
      </div>

      <hr className="my-6" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFormField("nama", "Nama Lengkap", "text", { required: true })}
        
        {renderFormField("gender", "Jenis Kelamin", "select", {
          options: [
            { value: "Laki-laki", label: "Laki-laki" },
            { value: "Perempuan", label: "Perempuan" },
          ],
        })}
        
        {renderFormField("nohp", "No. HP", "tel", {
          placeholder: "628xxxxxxxxxx",
        })}
        
        {renderFormField("rt", "RT", "text", {
          placeholder: "1",
        })}

        {/* RW Select */}
        <div>
          <label htmlFor="saraga-rw_id" className="block text-sm font-medium text-gray-700">
            RW
          </label>
          <select
            id="saraga-rw_id"
            value={formData.rw_id}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={rwLoading}
            required
          >
            <option value="">Pilih RW</option>
            {rwList.map((rw) => (
              <option key={rw.id} value={rw.id}>
                RW {rw.nomor_rw}
              </option>
            ))}
          </select>
          {rwLoading && (
            <p className="text-sm text-gray-500 mt-1">Memuat data RW...</p>
          )}
        </div>

        {renderPenyakitWargaFields()}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
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