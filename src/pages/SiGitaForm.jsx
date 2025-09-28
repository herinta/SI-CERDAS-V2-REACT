import React, { useState, useEffect } from "react";
import { callGemini } from "../api/gemini";
import { supabase } from "../supabaseClient";
import { useData } from "../contexts/DataContext";
import { useConfirmation } from "../contexts/ConfirmationContext";
import { useToast } from "../contexts/ToastContext";
import DetailModal from "../components/DetailModal/DetailSaraga";

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

const SiGitaForm = () => {
  const { balitaList, loading, addBalita, updateBalita, deleteBalita } =
    useData();
  const initialFormState = {
    id: null,
    nama: "",
    ttl: "",
    pj: "",
    rt: "",
    usia: "",
    bb: "",
    tb: "",
    lila: "",
    lk: "",
    lp: "",
    gender: "", // Tambahkan gender
    foodPic: null,
  };

  const { showToast } = useToast();
  const { askForConfirmation } = useConfirmation();

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [foodPreview, setFoodPreview] = useState(
    "https://placehold.co/100x100/e0e0e0/757575?text=Foto+Makanan"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const handleShowDetail = (item) => setDetailItem(item);
  const handleCloseDetail = () => setDetailItem(null);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "sigita-food-pic") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, foodPic: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setFoodPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [id.replace("sigita-", "")]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = formData.food_pic_url || null;

    // Logika upload gambar (sudah benar)
    if (formData.foodPic && typeof formData.foodPic !== "string") {
      const file = formData.foodPic;
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("food-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        showToast("Gagal mengunggah gambar.", "error");
        setIsSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("food-images")
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const dataToSubmit = {
      nama: formData.nama,
      ttl: formData.ttl,
      pj: formData.pj,
      rt: formData.rt,
      usia_bulan: formData.usia ? parseInt(formData.usia) : null,
      bb_kg: formData.bb ? parseFloat(formData.bb) : null,
      tb_cm: formData.tb ? parseFloat(formData.tb) : null,
      lila_cm: formData.lila ? parseFloat(formData.lila) : null,
      lk_cm: formData.lk ? parseFloat(formData.lk) : null,
      lp_cm: formData.lp ? parseFloat(formData.lp) : null,
      gender: formData.gender, // Tambahkan gender
      food_pic_url: imageUrl,
    };

    let result;
    if (editingId !== null) {
     
      result = await supabase
        .from("sigita")
        .update(dataToSubmit)
        .eq("id", editingId)
        .select()
        .single();
    } else {
      
      result = await supabase
        .from("sigita")
        .insert([dataToSubmit])
        .select()
        .single();
    }

    const { data: newOrUpdatedData, error } = result;
    // -------------------------

    if (error) {
      console.error("Error saving data:", error);
      showToast("Gagal menyimpan data.", "error");
    } else {
      showToast(
        `Data balita berhasil ${editingId ? "diperbarui" : "disimpan"}!`
      );

      // Panggil fungsi context dengan data yang valid
      if (editingId) {
        updateBalita(newOrUpdatedData);
      } else {
        addBalita(newOrUpdatedData);
      }

      setEditingId(null);
      setFormData(initialFormState);
      setFoodPreview(
        "https://placehold.co/100x100/e0e0e0/757575?text=Foto+Makanan"
      );
      setView("list");
    }
    setIsSubmitting(false);
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
      gender: item.gender || "", // Tambahkan gender
      foodPic: null,
      food_pic_url: item.food_pic_url,
    });
    setFoodPreview(
      item.food_pic_url ||
        "https://placehold.co/100x100/e0e0e0/757575?text=Foto+Makanan"
    );
    setEditingId(item.id);
    setView("form");
  };

  const handleDelete = async (id) => {
    const confirmed = await askForConfirmation({
      title: "Hapus Data Balita",
      message:
        "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
    });

    if (confirmed) {
      const { error } = await supabase.from("sigita").delete().eq("id", id);

      if (error) {
        console.error("Error deleting data:", error);
        showToast("Gagal menghapus data.");
      } else {
        showToast("Data berhasil dihapus.");
        deleteBalita(id);
      }
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setView("form");
  };

  const getFoodNutritionAnalysis = async () => {
    /* ... kode AI Anda ... */
  };
  const getBalitaNutritionAdvice = async () => {
    /* ... kode AI Anda ... */
  };

  if (view === "list") {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-2xl font-bold text-slate-800">Data Balita</h2>
          <button
            onClick={handleAddNew}
            className="text-xs md:text-md bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Tambah Data
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading.balita ? (
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
                {balitaList.map((item) => (
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
          title="Detail Data Balita"
          data={detailItem || {}}
          fieldOrder={[
            "nama",
            "gender",
            "ttl",
            "pj",
            "rt",
            "usia_bulan",
            "bb_kg",
            "tb_cm",
            "lila_cm",
            "lk_cm",
            "lp_cm",
            "food_pic_url",
            "created_at",
          ]}
          fieldLabels={{
            nama: "Nama",
            gender: "Jenis Kelamin",
            ttl: "Tanggal Lahir",
            pj: "Penanggung Jawab",
            rt: "RT/RW",
            usia_bulan: "Usia (bulan)",
            bb_kg: "Berat Badan (kg)",
            tb_cm: "Tinggi/Panjang Badan (cm)",
            lila_cm: "LILA (cm)",
            lk_cm: "Lingkar Kepala (cm)",
            lp_cm: "Lingkar Perut (cm)",
            food_pic_url: "Foto Makanan",
            created_at: "Waktu Input",
          }}
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
      <form id="form-sigita" className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="md:text-2xl font-bold text-slate-800">
            {editingId ? "Edit Data Balita" : "Tambah Data Balita"}
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
            Informasi Dasar Balita
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="sigita-nama"
                className="block text-sm font-medium text-gray-700"
              >
                Nama
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-child text-gray-400"></i>
                </span>
                <input
                  type="text"
                  id="sigita-nama"
                  onChange={handleChange}
                  value={formData.nama}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="sigita-gender"
                className="block text-sm font-medium text-gray-700"
              >
                Jenis Kelamin
              </label>
              <select
                id="sigita-gender"
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
                htmlFor="sigita-ttl"
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
                  id="sigita-ttl"
                  onChange={handleChange}
                  value={formData.ttl}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="sigita-pj"
                className="block text-sm font-medium text-gray-700"
              >
                Penanggung Jawab
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-user-shield text-gray-400"></i>
                </span>
                <input
                  type="text"
                  id="sigita-pj"
                  onChange={handleChange}
                  value={formData.pj}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="sigita-rt"
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
                  id="sigita-rt"
                  placeholder="001/002"
                  onChange={handleChange}
                  value={formData.rt}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="sigita-usia"
                className="block text-sm font-medium text-gray-700"
              >
                Usia (bulan)
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-baby-carriage text-gray-400"></i>
                </span>
                <input
                  type="number"
                  id="sigita-usia"
                  onChange={handleChange}
                  value={formData.usia}
                  className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xl font-semibold text-slate-700 border-b pb-4 w-full mb-6">
            Data Pengukuran
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Berat (kg)
              </label>
              <input
                type="number"
                id="sigita-bb"
                step="0.1"
                onChange={handleChange}
                value={formData.bb}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Panjang Badan(cm)
              </label>
              <input
                type="number"
                id="sigita-tb"
                step="0.1"
                onChange={handleChange}
                value={formData.tb}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LILA (cm)
              </label>
              <input
                type="number"
                id="sigita-lila"
                step="0.1"
                onChange={handleChange}
                value={formData.lila}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                L. Kepala (cm)
              </label>
              <input
                type="number"
                id="sigita-lk"
                step="0.1"
                onChange={handleChange}
                value={formData.lk}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </fieldset>

       

        <div className="flex flex-col sm:flex-row justify-end items-center pt-4 gap-4">
          
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

export default SiGitaForm;
