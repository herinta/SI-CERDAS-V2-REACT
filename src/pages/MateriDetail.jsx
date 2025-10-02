import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const allArticles = {
  '1': {
    title: 'Pentingnya Pemahaman Penanganan Kejang pada Anak',
    summary: 'Dokumen ini menjelaskan secara rinci mengenai pentingnya pemahaman langkah-langkah penanganan kejang pada anak.',
    fileType: 'ppt',
    fileUrl: 'https://docs.google.com/presentation/d/1RgAcS1qQ-7XFWKuTYCO9GTHnDiz112sO/preview', // GANTI DENGAN URL EMBED PDF ANDA
  },
  '2': {
    title: 'Presentasi Pencegahan Anemia pada Remaja',
    summary: 'Fondasi Akupresur: Mengenal Aliran Energi (Qi) untuk Kesehatan Holistik.',
    fileType: 'ppt',
    fileUrl: 'https://docs.google.com/presentation/d/1YbrrxCQdws3vNcwkTRJ-uu07LUZvLh11/preview', // GANTI DENGAN URL EMBED PPT ANDA
  },
  '3': {
    title: 'Tips Menjaga Kebugaran dan Kesehatan di Usia Senja',
    summary: 'Dokumen ini berisi tips-tips praktis untuk menjaga kesehatan fisik dan mental para lansia agar tetap bugar.',
    fileType: 'pdf',
    fileUrl: 'https://docs.google.com/presentation/d/1U0XVhFCKlQ0Go0up7q5MDlGiQOMIDGoG/preview', // GANTI DENGAN URL EMBED PDF ANDA
  },
  '4': {
    title: 'Panduan Pertolongan Pertama untuk Keracunan, Gigitan Hewan, dan Perdarahan',
    summary: 'Dokumen ini membahas jenis racun, tanda keracunan, serta langkah-langkah pertolongan pertama untuk keracunan, gigitan hewan (termasuk rabies), dan berbagai jenis perdarahan.',
    fileType: 'pdf',
    fileUrl: 'https://drive.google.com/file/d/1gTv3zUNPi8wtjLQ9TFjLheH_gMogJbAi/preview', // GANTI DENGAN URL EMBED PDF ANDA
  },
  '5': {
    title: 'Optimalisasi Peran Keluarga sebagai Upaya Pencegahan Stunting pada Anak',
    summary: 'Dokumen ini menjelaskan definisi, penyebab, dan langkah-langkah pencegahan stunting dengan fokus pada 1000 Hari Pertama Kehidupan, serta tiga komponen utama penanggulangan stunting.',
    fileType: 'pdf',
    fileUrl: 'https://drive.google.com/file/d/1sT_ko0DcMFONI-nWgkrlyMHuXV4Z-0Gy/preview', // GANTI DENGAN URL EMBED PDF ANDA
  },
  '6': {
    title: 'Panduan Pengukuran Antropometri untuk Penilaian Pertumbuhan Anak',
    summary: 'File ini berisi definisi antropometri, parameter standar, peralatan, dan prosedur pengukuran berat badan, panjang/tinggi badan, lingkar kepala, lingkar dada, serta lingkar lengan atas pada anak.',
    fileType: 'pdf',
    fileUrl: 'https://drive.google.com/file/d/1o8jcuEXcynG84ZcVqLR_s3iCb01POrnB/preview', // GANTI DENGAN URL EMBED PDF ANDA
  },
};


// --- HALAMAN DETAIL ARTIKEL ---
const MateriDetail = () => {
  const { id } = useParams();
  const articleData = allArticles[id];


  if (!articleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        {/* <Navigation /> */}
        <h1 className="text-3xl font-bold text-gray-800">Artikel Tidak Ditemukan</h1>
        <p className="mt-2 text-gray-600">Maaf, materi yang Anda cari tidak ada atau telah dipindahkan.</p>
        <Link to="/edukasi" className="mt-6 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors">
          &larr; Kembali ke Daftar Materi
        </Link>
      </div>
    );
  }

  // Komponen untuk merender viewer file berdasarkan tipenya
  const FileViewer = () => {
    if (articleData.fileType === 'pdf') {
      return (
        <div className="relative border-4 border-gray-200 rounded-lg overflow-hidden" style={{ paddingTop: '141.42%' /* Rasio A4 */ }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={articleData.fileUrl}
            title="Materi Edukasi PDF"
          ></iframe>
        </div>
      );
    }

    if (articleData.fileType === 'ppt') {
      return (
        <div className="relative border-4 border-gray-200 rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' /* Rasio 16:9 */ }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={articleData.fileUrl}
            title="Materi Edukasi Presentasi"
            allowFullScreen={true}
          ></iframe>
        </div>
      );
    }
    
    return <p className="text-center text-red-500">Format file tidak didukung untuk ditampilkan.</p>;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation /> 
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">{articleData.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{articleData.summary}</p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <FileViewer />
          <div className="mt-6 text-center">
            <Link to="/edukasi" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              &larr; Kembali ke Semua Materi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MateriDetail;