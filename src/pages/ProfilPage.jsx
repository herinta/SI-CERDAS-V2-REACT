
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

const ProfilPage = () => {
  const [profile, setProfile] = useState({
    name: 'Admin Plamongansari',
    email: 'admin.plamongan@email.com',
    bloodPressure: '',
    bloodSugar: '',
    complaints: '',
    profilePic: 'https://placehold.co/150x150/E2E8F0/4A5568?text=A',
  });
  const [status, setStatus] = useState('-');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'profile-pic-upload') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile(prev => ({ ...prev, profilePic: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setProfile(prev => ({ ...prev, [id.replace('profile-', '')]: value }));
    }
  };

  const saveProfileChanges = () => {
    let newStatus = '-';
    if (profile.complaints.trim() !== '') {
        newStatus = 'Sakit';
    } else if ((profile.bloodPressure && profile.bloodPressure.split('/')[0] > 130) || (profile.bloodSugar && profile.bloodSugar > 125)) {
        newStatus = 'Kurang Sehat';
    } else if (profile.bloodPressure || profile.bloodSugar) {
        newStatus = 'Sehat';
    }
    setStatus(newStatus);
    alert('Profil berhasil disimpan!');
  };

  const getHealthPlan = async () => {
    if (!profile.bloodPressure && !profile.bloodSugar && !profile.complaints) {
        alert("Harap isi setidaknya satu data kesehatan Anda untuk membuat rencana.");
        return;
    }
    setModalTitle('✨ Rencana Sehat Mingguan');
    setModalContent('Membuat rencana...');
    setIsModalOpen(true);
    const prompt = `Anda adalah seorang konsultan kesehatan personal. Berdasarkan data kesehatan berikut: Tekanan Darah: ${profile.bloodPressure || 'N/A'}, Gula Darah: ${profile.bloodSugar || 'N/A'} mg/dL, Keluhan: ${profile.complaints || 'Tidak ada'}. Buatkan rencana sehat mingguan yang sederhana, praktis, dan mudah diikuti untuk orang awam di Indonesia. Format jawaban dengan heading markdown **Fokus Utama Minggu Ini**, **Saran Pola Makan Harian**, dan **Saran Aktivitas Fisik Ringan**.`;
    const result = await callGemini(prompt);
    if (result) {
      setModalContent(result.text);
    } else {
      setModalContent('Gagal membuat rencana sehat.');
    }
  };

  const getStatusBadge = () => {
    let badgeColor, dotColor;
    switch(status) {
        case 'Sehat': badgeColor = 'bg-green-100 text-green-800'; dotColor = 'bg-green-500'; break;
        case 'Kurang Sehat': badgeColor = 'bg-yellow-100 text-yellow-800'; dotColor = 'bg-yellow-500'; break;
        case 'Sakit': badgeColor = 'bg-red-100 text-red-800'; dotColor = 'bg-red-500'; break;
        default: badgeColor = 'bg-gray-100 text-gray-800'; dotColor = 'bg-gray-500';
    }
    return (
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeColor}`}>
            <span className={`w-2 h-2 mr-1.5 rounded-full ${dotColor}`}></span>
            {status}
        </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="relative w-32 h-32 mx-auto group">
            <img id="profile-pic-preview" className="w-32 h-32 rounded-full object-cover mx-auto" src={profile.profilePic} alt="Admin" />
            <label htmlFor="profile-pic-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <i className="fas fa-camera text-2xl"></i>
            </label>
            <input type="file" id="profile-pic-upload" className="hidden" accept="image/*" onChange={handleChange} />
          </div>
          <h3 id="profile-card-name" className="text-xl font-bold text-slate-800 mt-4">{profile.name}</h3>
          <p id="profile-card-email" className="text-slate-500 text-sm">{profile.email}</p>
          <div className="mt-4">{getStatusBadge()}</div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); saveProfileChanges(); }}>
            <h3 className="text-xl font-semibold text-slate-700 border-b pb-4">Informasi Pribadi</h3>
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">Nama</label>
              <div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-user text-gray-400"></i></span><input type="text" id="profile-name" value={profile.name} onChange={handleChange} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-envelope text-gray-400"></i></span><input type="email" id="profile-email" value={profile.email} onChange={handleChange} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
            </div>
            
            <hr />
            <h3 className="text-xl font-semibold text-slate-700 border-b pb-4">Update Kondisi Kesehatan</h3>
            <div>
              <label htmlFor="profile-bloodPressure" className="block text-sm font-medium text-gray-700">Tekanan Darah</label>
              <div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-heart-pulse text-gray-400"></i></span><input type="text" id="profile-bloodPressure" placeholder="Contoh: 120/80" value={profile.bloodPressure} onChange={handleChange} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
            </div>
            <div>
              <label htmlFor="profile-bloodSugar" className="block text-sm font-medium text-gray-700">Gula Darah (mg/dL)</label>
              <div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-tint text-gray-400"></i></span><input type="number" id="profile-bloodSugar" placeholder="Contoh: 90" value={profile.bloodSugar} onChange={handleChange} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
            </div>
             <div>
                <label htmlFor="profile-complaints" className="block text-sm font-medium text-gray-700">Keluhan Saat Ini</label>
                <div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3 pt-2"><i className="fas fa-head-side-cough text-gray-400"></i></span><textarea id="profile-complaints" rows="2" placeholder="Kosongkan jika tidak ada keluhan" value={profile.complaints} onChange={handleChange} className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea></div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
                <button type="button" onClick={getHealthPlan} className="w-full sm:w-auto bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition duration-200 flex items-center justify-center gap-2">✨ Buat Rencana Sehat</button>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button type="button" className="w-full bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 transition duration-200">Batal</button>
                    <button type="submit" id="save-profile-button" className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200">Simpan</button>
                </div>
            </div>
          </form>
        </div>
      </div>
      {isModalOpen && <Modal title={modalTitle} content={modalContent} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ProfilPage;
