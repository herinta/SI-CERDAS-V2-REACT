import React from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

// Data contoh untuk artikel. Nantinya, ini bisa diganti dengan data dari API.
const edukasiData = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/600x400/3498db/ffffff?text=Gizi+Balita',
    category: 'Gizi Balita',
    title: 'Pentingnya Gizi Seimbang untuk Tumbuh Kembang Optimal',
    summary: 'Asupan gizi yang tepat pada periode emas anak adalah kunci untuk perkembangan fisik dan kognitif yang maksimal. edukasiData ini membahas...',
    link: '#', // Tautan ke halaman detail artikel
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/600x400/e74c3c/ffffff?text=Anemia+Remaja',
    category: 'Kesehatan Remaja',
    title: 'Kenali dan Cegah Anemia pada Remaja Putri',
    summary: 'Anemia seringkali tidak disadari namun berdampak besar pada prestasi dan aktivitas remaja. Pelajari gejala dan cara pencegahannya di sini.',
    link: '#',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/600x400/2ecc71/ffffff?text=Kesehatan+Lansia',
    category: 'Kesehatan Lansia',
    title: 'Tips Menjaga Kebugaran dan Kesehatan di Usia Senja',
    summary: 'Tetap aktif dan sehat di usia lanjut bukanlah hal yang mustahil. Temukan tips praktis untuk menjaga kesehatan fisik dan mental para lansia.',
    link: '#',
  },
  {
    id: 4,
    imageUrl: 'https://placehold.co/600x400/f1c40f/ffffff?text=Imunisasi',
    category: 'Imunisasi',
    title: 'Jadwal Imunisasi Lengkap untuk Anak Sesuai Anjuran IDAI',
    summary: 'Jangan lewatkan jadwal imunisasi penting untuk melindungi buah hati Anda dari berbagai penyakit berbahaya. Cek jadwal lengkapnya.',
    link: '#',
  },
  {
    id: 5,
    imageUrl: 'https://placehold.co/600x400/9b59b6/ffffff?text=Pola+Hidup+Sehat',
    category: 'Pola Hidup Sehat',
    title: 'Langkah Awal Memulai Pola Hidup Sehat untuk Keluarga',
    summary: 'Mengubah kebiasaan menjadi lebih sehat lebih mudah jika dilakukan bersama keluarga. Mulai dari langkah-langkah kecil yang berdampak besar.',
    link: '#',
  },
   {
    id: 6,
    imageUrl: 'https://placehold.co/600x400/1abc9c/ffffff?text=Info+Posyandu',
    category: 'Info Posyandu',
    title: 'Apa Saja Layanan yang Tersedia di Posyandu?',
    summary: 'Posyandu tidak hanya untuk menimbang balita. Kenali berbagai layanan kesehatan penting lainnya yang bisa Anda dapatkan di Posyandu terdekat.',
    link: '#',
  },
];

const EdukasiCard = ({ imageUrl, category, title, summary, id }) => {
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
        <Link 
          to={`/edukasi/${id}`}
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 self-start"
        >
          Baca Selengkapnya &rarr;
        </Link>
      </div>
    </div>
  );
};

/**
 * Halaman utama yang berisi kumpulan artikel.
 */
const Edukasi = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 md:py-28 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Materi & Informasi Kesehatan</h1>
          <p className="mt-2 text-lg text-gray-600">Kumpulan Materi Seputar Kegiatan PPK ORMAWA HIMAPERSA di Desa Plamongansari.</p>
        </div>

        {/* Grid untuk menampilkan kartu-kartu artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {edukasiData.map(article => (
            <EdukasiCard
              key={article.id}
              id={article.id}
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

export default Edukasi;