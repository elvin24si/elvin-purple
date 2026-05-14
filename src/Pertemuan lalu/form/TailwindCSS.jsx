import React, { useState } from "react";
import LoginForm from "./LoginForm";

export default function WhiteFrameLabs() {
  const [submittedData, setSubmittedData] = useState(null);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#dee2e6_100%)] z-0"></div>

      <main className="relative z-10 w-full max-w-lg px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-sm font-light tracking-[0.6em] uppercase text-gray-400 mb-2">
            WhiteFrame Labs
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Form Pengajuan Request Konsultasi PC Custom</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {!submittedData ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Konfigurasi</h2>
                <LoginForm onDeploy={(data) => setSubmittedData(data)} />
              </>
            ) : (
              
              <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg text-center">
                  <p className="text-green-700 font-bold text-xs uppercase tracking-widest">Pesanan Diterima!</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4">Summary Pesanan:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(submittedData).map(([key, val]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded border border-gray-100">
                        <p className="text-[9px] uppercase text-gray-400 font-bold">{key}</p>
                        <p className="text-sm font-mono text-gray-800">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setSubmittedData(null)}
                  className="w-full text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase"
                >
                  Buat Request Baru
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}