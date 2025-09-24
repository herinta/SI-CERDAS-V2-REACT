import React from 'react';
import Navigation from '../components/Navigation';

// Data contoh untuk artikel. Nantinya, ini bisa diganti dengan data dari API.
const articleData = [
  // --- Artikel dari Landing Page ---
  {
    id: 1,
    imageUrl: 'images/grand.jpeg', // Pastikan path ini benar
    category: 'Info Program',
    title: 'Grand Launching PPK Ormawa Himapersa',
    summary: 'Program PPK Ormawa HIMAPERSA 2025 dengan tajuk Mawas Warga Plus & SARAGA (Satu Rumah Satu Caregiver) resmi diluncurkan di Balai Kelurahan Plamongansari...',
    link: 'https://unimus.ac.id/grand-launching-program-ppk-ormawa-himapersa-2025-resmi-digelar-di-plamongansari', 
  },
  {
    id: 2,
    imageUrl: 'images/sentuh.JPG', // Pastikan path ini benar
    category: 'Workshop Kader',
    title: 'Workshop Sentuh untuk Calon Kader Caregiver',
    summary: 'Dalam rangka mendukung program "Satu Rumah Satu Caregiver" (SARAGA), tim PPK Ormawa Himapersa menggelar "Workshop Sentuh" untuk membekali masyarakat dengan keterampilan terapi holistik.',
    link: 'https://www.netralnews.com/menginisiasi-program-satu-rumah-satu-caregiver-ppk-ormawa-himapersa-gelar-workshop-sentuh/MTFFQnRLcGthS1BFWHMxeTdOVUFoZz09',
  },
  {
    id: 3,
    imageUrl: 'images/remaja.jpg', // Pastikan path ini benar
    category: 'Kesehatan Remaja',
    title: 'Kelas Remaja: Edukasi, Gizi, dan Pencegahan Anemia',
    summary: 'Program Kelas Remaja memberikan edukasi gizi seimbang, pencegahan anemia, serta pemeriksaan kesehatan gratis yang meliputi cek Hb dan pengukuran antropometri.',
    link: 'https://www.kompasiana.com/rindangmayda4840/68b676c3c925c42026321862/ppk-ormawa-himapersa-gelar-kelas-remaja-cegah-anemia-menuju-kelurahan-zero-stunting',
  },
  {
    id: 4,
    imageUrl: 'images/sigap.png', // Pastikan path ini benar
    category: 'Kesehatan Remaja',
    title: 'SIGAP : Siap Tanggap Pertolongan Pertama',
    summary: 'Pelatihan Siap Tanggap Pertolongan Pertama (SIGAP), untuk Meningkatkan Kapasitas kader dalam Menghadapi Kondisi Kegawatdaruratan.',
    link: 'https://www.netralnews.com/tim-ppk-ormawa-himapersa-unimus-gelar-pelatihan-siap-tanggap-pertolongan-pertama/TlFHWlg4TWh6cE1TQjJ1OFRSb0Z2QT09',
  },
];

const ArticleCard = ({ imageUrl, category, title, summary, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      <div className="p-6">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
          {category}
        </span>
        <h3 className="mt-4 font-bold text-xl text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">
          {summary}
        </p>
        <a 
          href={link} 
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
        >
          Baca Selengkapnya &rarr;
        </a>
      </div>
    </div>
  );
};

/**
 * Halaman utama yang berisi kumpulan artikel.
 */
const Artikel = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 md:py-28 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Kegiatan dan Program Kerja</h1>
          <p className="mt-2 text-lg text-gray-600">Kumpulan Informasi Seputar Kegiatan PPK ORMAWA HIMAPERSA di Desa Plamongansari.</p>
        </div>

        {/* Grid untuk menampilkan kartu-kartu artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articleData.map(article => (
            <ArticleCard
              key={article.id}
              imageUrl={article.imageUrl}
              category={article.category}
              title={article.title}
              summary={article.summary}
              link={article.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artikel;