// components/FooterNav.jsx
import React from "react";

export default function FooterNav() {
  return (
    <div className="fixed bottom-0 inset-x-0 flex justify-center pointer-events-none">
      <div className="relative w-full max-w-md h-20">

        <div className="absolute bottom-0 inset-x-0 h-16 bg-[#06c755] rounded-t-3xl z-10" />

  
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full z-10" />

    
        <button
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl z-20 pointer-events-auto shadow-lg"
        >
          +
         
        </button>

 
        <div className="absolute bottom-0 inset-x-0 h-16 flex items-center justify-between px-10 text-white z-20 pointer-events-auto">
          <button className="flex flex-col items-center gap-1 text-xs">
            <span className="text-2xl">💼</span>
            <span>Wallet</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-xs">
            <span className="text-2xl">👤</span>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
