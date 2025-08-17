import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

// --- Komponen UI untuk Toast ---
const Toast = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Memicu animasi fade-in
    const fadeInTimer = setTimeout(() => setVisible(true), 10);

    // Memicu animasi fade-out sebelum komponen dihapus
    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
      // Beri waktu untuk animasi fade-out sebelum memanggil onClose
      setTimeout(onClose, 300);
    }, 3000); // Toast akan terlihat selama 3 detik

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [message, onClose]);

  const baseClasses = "fixed bottom-5 right-5 flex items-center p-4 rounded-lg text-white shadow-lg transition-all duration-300 ease-in-out z-[100]";
  const style = {
    success: { bg: 'bg-green-600', icon: <CheckCircle className="w-6 h-6 mr-3" /> },
    error: { bg: 'bg-red-600', icon: <XCircle className="w-6 h-6 mr-3" /> },
  };
  const visibilityClasses = visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <div className={`${baseClasses} ${style[type].bg} ${visibilityClasses}`}>
      {style[type].icon}
      <span className="flex-grow font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/20 transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// --- Konteks dan Provider untuk Mengelola Toast ---
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus digunakan di dalam ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    // Gunakan key unik untuk memastikan useEffect di Toast terpicu kembali
    setToast({ message, type, key: Date.now() });
  }, []);

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />}
    </ToastContext.Provider>
  );
};
