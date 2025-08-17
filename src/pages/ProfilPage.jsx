import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../components/AuthContext';
import { callGemini } from '../api/gemini'; // Asumsi ini ada untuk fitur AI

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
  const { session, userProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar_url: '',
    // State untuk data kesehatan, bisa dikembangkan nanti
    bloodPressure: '',
    bloodSugar: '',
    complaints: '',
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    if (userProfile && session?.user) {
      setProfile({
        name: userProfile.full_name || '',
        email: session.user.email || '',
        avatar_url: userProfile.avatar_url || '',
        // Reset data kesehatan saat profil dimuat
        bloodPressure: '',
        bloodSugar: '',
        complaints: '',
      });
      setLoading(false);
    }
  }, [userProfile, session]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'profile-pic-upload') {
      const file = files[0];
      if (file) {
        setProfilePicFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile(prev => ({ ...prev, avatar_url: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setProfile(prev => ({ ...prev, [id.replace('profile-', '')]: value }));
    }
  };

  const saveProfileChanges = async (e) => {
    e.preventDefault();
    if (!session?.user) return;

    setLoading(true);
    let newAvatarUrl = profile.avatar_url;

    // 1. Upload foto profil baru jika ada
    if (profilePicFile) {
      const fileName = `${session.user.id}/${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars') // Pastikan bucket 'avatars' sudah ada
        .upload(fileName, profilePicFile);

      if (uploadError) {
        alert('Gagal mengunggah foto profil: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      newAvatarUrl = urlData.publicUrl;
    }

    // 2. Update data di tabel profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: profile.name,
        avatar_url: newAvatarUrl,
      })
      .eq('id', session.user.id);

    if (updateError) {
      alert('Gagal menyimpan profil: ' + updateError.message);
    } else {
      alert('Profil berhasil diperbarui!');
      // Reset file state setelah upload berhasil
      setProfilePicFile(null);
    }
    setLoading(false);
  };

  // Fitur AI tetap sama
  const getHealthPlan = async () => { /* ... kode AI Anda ... */ };

  if (loading) {
    return <p className="text-center p-4">Memuat profil...</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="relative w-32 h-32 mx-auto group">
            <img className="w-32 h-32 rounded-full object-cover mx-auto" src={profile.avatar_url || `https://placehold.co/150x150/E2E8F0/4A5568?text=${profile.name.charAt(0)}`} alt="Foto Profil" />
            <label htmlFor="profile-pic-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <i className="fas fa-camera text-2xl"></i>
            </label>
            <input type="file" id="profile-pic-upload" className="hidden" accept="image/*" onChange={handleChange} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mt-4">{profile.name}</h3>
          <p className="text-slate-500 text-sm">{profile.email}</p>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md min-h-screen">
          <form className="space-y-6" onSubmit={saveProfileChanges}>
            <h3 className="text-xl font-semibold text-slate-700 border-b pb-4">Informasi Pribadi</h3>
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">Nama</label>
              <div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-user text-gray-400"></i></span><input type="text" id="profile-name" value={profile.name} onChange={handleChange} disabled className="pl-10 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" /></div>
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-envelope text-gray-400"></i></span><input type="email" id="profile-email" value={profile.email} disabled className="pl-10 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" /></div>
            </div>
            
          </form>
        </div>
      </div>
      {isModalOpen && <Modal title={modalTitle} content={modalContent} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ProfilPage;
