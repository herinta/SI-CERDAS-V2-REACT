
import React, { useState } from 'react';
import { callGemini } from '../api/gemini';

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

const LaporanPage = () => {
  const [laporanData] = useState([
    { id: 1, nama: 'Ananda Putri', kategori: 'Balita', tgl: '2025-07-15', status: 'Sehat' },
    { id: 2, nama: 'Budi Santoso', kategori: 'Lansia', tgl: '2025-07-14', status: 'Perlu Perhatian' },
    { id: 3, nama: 'Citra Lestari', kategori: 'Remaja', tgl: '2025-07-12', status: 'Anemia' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const getLaporanSummary = async () => {
    if (laporanData.length === 0) { alert("Tidak ada data di laporan."); return; }
    let dataLaporan = "Data laporan kesehatan:\n";
    laporanData.forEach(row => {
        dataLaporan += `- Nama: ${row.nama}, Kategori: ${row.kategori}, Status: ${row.status}\n`;
    });

    setModalTitle('✨ Ringkasan Laporan Kesehatan');
    setModalContent('Membuat ringkasan...');
    setIsModalOpen(true);

    const prompt = `Anda adalah analis data kesehatan. Berdasarkan data ini:\n${dataLaporan}\nBuat ringkasan eksekutif, sorot tren, dan berikan rekomendasi tindak lanjut untuk kader. Gunakan Bahasa Indonesia. Format dengan heading markdown **Ringkasan Utama**, **Tren & Sorotan**, dan **Rekomendasi Tindak Lanjut**.`;
    const result = await callGemini(prompt);
    if (result) {
      setModalContent(result.text);
    } else {
      setModalContent('Gagal membuat ringkasan.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sehat':
        return <span className="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{status}</span>;
      case 'Perlu Perhatian':
        return <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{status}</span>;
      case 'Anemia':
        return <span className="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{status}</span>;
      default:
        return <span className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-80">
          <input type="text" placeholder="Cari nama..." className="pl-10 pr-4 py-2 border rounded-lg w-full" />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <button onClick={getLaporanSummary} className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"><i className="fas fa-wand-magic-sparkles"></i> ✨ Buat Ringkasan</button>
          <button className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center"><i className="fas fa-file-export mr-2"></i> Export</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left" id="laporan-table">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-sm font-semibold">Nama</th>
              <th className="p-3 text-sm font-semibold">Kategori</th>
              <th className="p-3 text-sm font-semibold">Tgl Periksa</th>
              <th className="p-3 text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody id="laporan-table-body">
            {laporanData.map(row => (
              <tr key={row.id} className="border-b">
                <td className="p-3">{row.nama}</td>
                <td className="p-3">{row.kategori}</td>
                <td className="p-3">{row.tgl}</td>
                <td className="p-3">{getStatusBadge(row.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <Modal title={modalTitle} content={modalContent} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LaporanPage;
