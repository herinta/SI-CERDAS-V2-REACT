const DetailModal = ({ isOpen, onClose, title, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div 
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Bagian 1: Data Diri Caregiver (Statis) */}
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-slate-700 border-b pb-2 mb-4"></h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Lengkap</p>
                            <p className="text-gray-800 text-base">{data.nama || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Kelamin</p>
                            <p className="text-gray-800 text-base">{data.gender || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RT/RW</p>
                            <p className="text-gray-800 text-base">{`RT ${data.rt || '-'} / RW ${data.rw || '-'}`}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">No. HP</p>
                            <p className="text-gray-800 text-base">{data.nohp || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu Input</p>
                            <p className="text-gray-800 text-base">{data.created_at ? new Date(data.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Bagian 2: Data Keluarga yang Didampingi (Statis) */}
                {data.keluarga_didampingi && data.keluarga_didampingi.length > 0 && (
                    <div>
                        <h4 className="text-md font-semibold text-slate-700 border-b pb-2 mb-4">Data Keluarga yang Didampingi</h4>
                        <div className="space-y-3 mt-2">
                            {data.keluarga_didampingi.map((keluarga, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center">
                                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full mr-3">{keluarga.tahap || 'Lainnya'}</span>
                                        <p className="text-gray-800 font-medium">{keluarga.penyakit || 'Tidak ada penyakit'}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 pl-1"><span className="font-semibold">Intervensi:</span> {keluarga.intervensi || 'Tidak ada intervensi'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Tombol */}
                <div className="mt-8 text-right border-t pt-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200">Tutup</button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default DetailModal;