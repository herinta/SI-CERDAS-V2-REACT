
import React, { useState } from 'react';
import { callGemini } from '../api/gemini';

const PengumumanPage = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateAnnouncement = async () => {
    if (!topic.trim()) {
      alert("Harap masukkan isu utama pengumuman.");
      return;
    }
    setIsLoading(true);
    const prompt = `Anda adalah seorang Kader Kesehatan Posyandu yang komunikatif. Buat sebuah draf pengumuman yang singkat, jelas, dan ramah untuk grup WhatsApp warga berdasarkan informasi berikut: "${topic}". Gunakan sapaan yang sesuai dan ajakan bertindak yang positif. Gunakan emoji secukupnya.`;
    const response = await callGemini(prompt);
    if (response) {
      setResult(response.text);
    } else {
      setResult('Gagal membuat pengumuman.');
    }
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert('Teks berhasil disalin!');
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div className="text-center">
        <i className="fas fa-bullhorn text-4xl text-indigo-500"></i>
        <h3 className="text-2xl font-bold text-slate-800 mt-3">Buat Pengumuman Kesehatan</h3>
        <p className="text-slate-500 mt-1">Tuliskan isu utama, dan biarkan AI membuat draf pengumuman yang siap disebar.</p>
      </div>
      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="announcement-topic" className="block text-sm font-medium text-gray-700">Isu Utama</label>
          <textarea id="announcement-topic" rows="3" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Contoh: Ada 2 kasus demam berdarah di RT 05. Ajak warga untuk PSN hari Minggu." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={generateAnnouncement} disabled={isLoading} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center gap-2 disabled:bg-indigo-400">
            {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Memproses...</> : <><i className="fas fa-wand-magic-sparkles"></i> Buat Teks Pengumuman</>}
          </button>
        </div>
        {result && (
          <div className="pt-4">
            <hr className="my-4" />
            <h4 className="text-lg font-semibold text-slate-700 mb-2">Hasil Draf Pengumuman:</h4>
            <div className="p-4 bg-slate-50 rounded-md border text-slate-700 whitespace-pre-wrap">{result}</div>
            <button onClick={copyToClipboard} className="mt-2 bg-slate-200 text-slate-700 px-4 py-1 rounded-lg hover:bg-slate-300 text-sm flex items-center gap-2"><i className="fas fa-copy"></i> Salin Teks</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PengumumanPage;
