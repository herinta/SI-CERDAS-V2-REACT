import React from 'react';

// --- Komponen Detail Modal (Reusable & Dinamis dengan urutan & label custom) ---
const DetailModal = ({ isOpen, onClose, title, data, fieldOrder = [], fieldLabels = {} }) => {
  if (!isOpen) return null;

  // Daftar properti yang tidak ingin ditampilkan di modal detail
  const hiddenProps = ['id'];

  // Filter dan urutkan field sesuai fieldOrder jika ada
  const orderedFields = fieldOrder.length > 0
    ? fieldOrder.filter(key => data.hasOwnProperty(key) && !hiddenProps.includes(key))
    : Object.keys(data).filter(key => !hiddenProps.includes(key));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-3 text-sm max-h-[60vh] overflow-y-auto pr-2">
          {/* Mapping dinamis dari data yang diterima sesuai urutan dan label */}
          {orderedFields.map((key) => {
            let value = data[key];
            let displayValue = value;
            if ((key === 'created_at' || key === 'ttl') && value) {
              try {
                displayValue = new Date(value).toLocaleString('id-ID', { 
                  dateStyle: 'long', 
                  timeStyle: key === 'created_at' ? 'short' : undefined 
                });
              } catch (e) {
                displayValue = value;
              }
            }
            return (
              <div key={key} className="grid grid-cols-3 gap-4 border-b border-gray-100 py-2">
                <span className="font-semibold text-gray-600 capitalize col-span-1">
                  {fieldLabels[key] || key.replace(/_/g, ' ')}
                </span>
                <span className="text-gray-800 col-span-2 break-words">{displayValue || '-'}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-right">
            <button onClick={onClose} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200">Tutup</button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default DetailModal;
