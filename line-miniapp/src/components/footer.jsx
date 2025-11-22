
import React from "react";

export default function FooterNav({ onPlusClick, onProfileClick, onWalletClick }) {
  return (
    <div className="fixed bottom-0 inset-x-0 flex justify-center pointer-events-none z-40">
      <div className="relative w-full max-w-md h-20">

        <div
          className="
            absolute bottom-0 inset-x-0 h-16
            bg-linear-to-r from-[#06c755] to-[#04a846]
            rounded-t-3xl
            shadow-[0_-6px_18px_rgba(0,0,0,0.25)]
            z-10
          "
        />

        <div
          className="
            absolute -top-7 left-1/2 -translate-x-1/2
            w-24 h-24
            bg-white
            rounded-full
            border border-slate-200
            shadow-[0_10px_25px_rgba(15,23,42,0.25)]
            z-10
          "
        />

        <button
          onClick={onPlusClick}
          className="
            absolute -top-4 left-1/2 -translate-x-1/2
            w-16 h-16
            rounded-full
            bg-slate-900
            flex items-center justify-center
            text-white text-3xl
            z-20
            pointer-events-auto
            shadow-[0_10px_25px_rgba(15,23,42,0.45)]
            border-4 border-white
            active:scale-95
            transition-transform duration-150
          "
        >
          +
        </button>


        <div
          className="
            absolute bottom-0 inset-x-0 h-16
            flex items-center justify-between
            px-10
            text-white
            z-20
            pointer-events-auto
          "
        >
          <button
            onClick={onWalletClick}
            className="flex flex-col items-center gap-0.5 text-[11px]">
            <span className="text-2xl leading-none drop-shadow-sm">💼</span>
            <span className="font-medium tracking-tight">Wallet</span>
          </button>

          <button
            onClick={onProfileClick}
            className="flex flex-col items-center gap-0.5 text-[11px]"
          >
            <span className="text-2xl leading-none drop-shadow-sm">👤</span>
            <span className="font-medium tracking-tight">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}




