import React, { createContext, useState, useContext, useCallback } from 'react';
import { ShieldAlert } from 'lucide-react';

// --- Komponen UI untuk Modal ---
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  // Jangan render apapun jika tidak terbuka
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4" aria-modal="true" role="dialog">
      {/* Kontainer Modal dengan animasi */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
        <div className="p-6">
          <div className="flex items-start">
            {/* Ikon Peringatan */}
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="ml-4 text-left">
              {/* Judul dan Pesan */}
              <h3 className="text-lg leading-6 font-bold text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Tombol Aksi */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Hapus
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onCancel}
          >
            Batal
          </button>
        </div>
      </div>
      {/* Tambahkan style untuk animasi sederhana */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// --- Konteks dan Provider untuk mengelola state modal ---
const ConfirmationContext = createContext(null);

// Hook kustom untuk mempermudah penggunaan
export const useConfirmation = () => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirmation harus digunakan di dalam ConfirmationProvider');
    }
    return context;
};

// Provider yang akan membungkus aplikasi
export const ConfirmationProvider = ({ children }) => {
    const [options, setOptions] = useState(null);

    // Fungsi untuk meminta konfirmasi, mengembalikan sebuah Promise
    const askForConfirmation = useCallback((options) => {
        return new Promise((resolve) => {
            setOptions({ ...options, resolve });
        });
    }, []);

    // Fungsi yang dipanggil saat tombol "Hapus" diklik
    const handleConfirm = () => {
        if (options && options.resolve) {
            options.resolve(true); // Mengirim 'true' ke Promise
        }
        setOptions(null); // Menutup modal
    };

    // Fungsi yang dipanggil saat tombol "Batal" diklik
    const handleCancel = () => {
        if (options && options.resolve) {
            options.resolve(false); // Mengirim 'false' ke Promise
        }
        setOptions(null); // Menutup modal
    };

    return (
        <ConfirmationContext.Provider value={{ askForConfirmation }}>
            {children}
            <ConfirmationModal
                isOpen={!!options}
                title={options?.title || 'Konfirmasi'}
                message={options?.message || 'Apakah Anda yakin?'}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmationContext.Provider>
    );
};
