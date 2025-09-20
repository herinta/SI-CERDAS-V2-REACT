import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  BarChart3,
  Shield,
  Baby,
  User,
  UserCheck,
  Database,
  TrendingUp,
  FileText,
  CheckCircle,
} from "lucide-react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "SiGita",
    subtitle: "Balita",
    description:
      "Pemantauan pertumbuhan dan status gizi balita untuk pencegahan stunting sejak dini",
    icon: Baby,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "SiGirema",
    subtitle: "Remaja",
    description:
      "Monitoring kesehatan dan gizi remaja untuk mendukung tumbuh kembang optimal",
    icon: User,
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    title: "SiGilansa",
    subtitle: "Lansia",
    description:
      "Perawatan dan pemantauan kesehatan lansia untuk kualitas hidup yang lebih baik",
    icon: UserCheck,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Saraga",
    subtitle: "Cargiever",
    description: "Pengelolaan data Cargiever terpusat untuk pemantauan kader mawas warga plus",
    icon: Database,
    gradient: "from-green-500 to-teal-500",
  },
];

const benefits = [
  {
    title: "Data Terpusat",
    description:
      "Semua informasi kesehatan tersimpan dalam satu platform terintegrasi, memudahkan akses dan analisis data komprehensif",
    icon: BarChart3,
  },
  {
    title: "Deteksi Dini Cerdas",
    description:
      "Sistem analisis untuk mengidentifikasi risiko stunting dan masalah kesehatan lainnya sejak tahap awal",
    icon: TrendingUp,
  },
  {
    title: "Laporan Mudah",
    description:
      "Generate laporan kesehatan yang detail dan mudah dipahami untuk mendukung pengambilan keputusan yang tepat",
    icon: FileText,
  },
];

const programs = [
  {
    title: "Grand Launching PPK Ormawa Himapersa",
    description:
      "Program PPK Ormawa HIMAPERSA 2025 dengan tajuk Mawas Warga Plus & SARAGA (Satu Rumah Satu Caregiver) resmi diluncurkan melalui kegiatan Grand Launching di Balai Kelurahan Plamongansari, Kecamatan Pedurungan, Kota Semarang, Minggu (10/8/2025). Acara ini menjadi penanda dimulainya program kesehatan berbasis keluarga yang menyasar seluruh warga Plamongansari.",
    img: "images/grand.jpeg",
    reverse: false,
  },
  {
    title: "Workshop sentuh",
    description:
      'Dalam rangka mendukung program inisiatif "Satu Rumah Satu Caregiver" (SARAGA), tim PPK Ormawa Himapersa menggelar "Workshop Sentuh" bagi calon kader caregiver. Acara ini bertujuan untuk membekali masyarakat dengan keterampilan dasar terapi holistik non-farmakologis yang sederhana dan mudah dipraktikkan di rumah.',
    img: "images/sentuh.JPG",
    reverse: true,
  },
  {
    title: "Kelas remaja",
    description:
      "Program kerja Kelas remaja merupakan kegiatan pemberian edukasi mengenai pengertian, pencegahan dan penangan anemia serta pentinganya gizi seimbang, juga ada pemeriksaan kesehatan gratis yang ditujukan untuk remaja. Kegiatan ini meliputi pemeriksaan hemoglobin (Hb), pengukuran antropometri (berat badan, tinggi badan, serta indeks massa tubuh), pembagian tablet tambah darah (TTD) gratis.",
    img: "images/remaja.jpg",
    reverse: false,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    transition: { type: "spring", stiffness: 300 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-50">
      <Navigation />
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden md:pt-24 pt-10">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Main Headline */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Kesehatan Terpantau
              </span>
              <br />
              <span className="text-gray-700">di Segala Usia</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-md md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              <strong>SiCerdas</strong> (Sistem Informasi Cermat dan Cerdas)
              adalah platform digital inovatif yang dirancang khusus untuk kader
              kesehatan, petugas puskesmas, dan masyarakat Plamongansari,
              Semarang. Memantau gizi dan kesehatan dari balita hingga lansia,
              mendukung deteksi dini stunting, dan meningkatkan kapasitas
              digital para kader kesehatan.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={fadeInUp}>
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  Masuk ke Dashboard
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fitur Unggulan{" "}
              <span className="text-blue-600">SiCerdas Plamongansari</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modul-modul terintegrasi untuk pemantauan kesehatan menyeluruh di
              setiap tahap kehidupan
            </p>
          </motion.div>

          {/* Mapping Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                variants={fadeInUp}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full"
                  {...scaleOnHover}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-lg font-semibold text-gray-600 mb-4">
                    {feature.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why SiCerdas Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Mengapa SiCerdas?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Keunggulan yang membuat SiCerdas menjadi solusi terdepan dalam
              pemantauan kesehatan masyarakat
            </p>
          </motion.div>

          {/* Mapping Benefits */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                className="text-center group"
                variants={fadeInUp}
              >
                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
                  {...scaleOnHover}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Program Kerja Section */}
      <section id="program-kerja" className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Program <span className="text-green-600">Kerja</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Inovasi dan aksi nyata untuk mendukung kesehatan masyarakat
        Plamongansari
      </p>
    </div>

    <motion.div
      className="space-y-16"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      {programs.map((program, idx) => {
        // Maksimal 50 kata
        const maxWords = 30;
        const words = program.description.split(" ");
        const desc =
          words.length > maxWords
            ? words.slice(0, maxWords).join(" ") + "..."
            : program.description;

        return (
          <motion.div
            key={idx}
            className="flex flex-col md:flex-row justify-between items-center"

            variants={fadeInUp}
          >
            {/* Deskripsi */}
            <div
              className={
                program.reverse
                  ? "order-1 md:order-2 md:w-1/2 w-full my-6 md:my-0"
                  : "order-2 md:order-1 md:w-1/2 w-full my-6 md:my-0"
              }
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {program.title}
              </h3>
              <p className="text-lg text-gray-600 mb-6 text-justify">
                {desc}
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-200">
                Lihat Selengkapnya
              </button>
            </div>

            {/* Gambar */}
            <motion.div
              className={
                program.reverse
                  ? "order-2 md:order-1"
                  : "order-1 md:order-2"
              }
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img
                src={program.img}
                alt={program.title}
                className="w-[500px] h-[300px] object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>

    <div className="flex justify-center md:mt-28 mt-6">
      <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-green-700 transition duration-200 text-lg">
        Lihat Lainnya
      </button>
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Tentang <span className="text-green-600">Program</span>
            </h2>

            <motion.div
              className="bg-white rounded-3xl p-12 shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                SiCerdas lahir dari komitmen{" "}
                <strong>
                  Program Penguatan Kapasitas Organisasi Kemahasiswaan (PPK
                  Ormawa) Himapersa{" "}
                </strong>
                sebagai wujud nyata pengabdian kepada masyarakat. Aplikasi ini
                dikembangkan khusus untuk mendukung kesehatan masyarakat
                Plamongansari, Semarang, dengan memanfaatkan teknologi digital
                terdepan.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Target Lokasi", value: "Plamongansari, Semarang" },
                  { label: "Inisiator", value: "PPK Ormawa Himapersa" },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">SiCerdas</h3>
            </div>

            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Sistem Informasi Cermat dan Cerdas untuk kesehatan masyarakat yang
              lebih baik di Plamongansari, Semarang.
            </p>

            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500 text-sm">
                © 2024 SiCerdas - Program Penguatan Kapasitas Organisasi
                Kemahasiswaan (PPK Ormawa) Himapersa. Seluruh hak cipta
                dilindungi undang-undang.
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
