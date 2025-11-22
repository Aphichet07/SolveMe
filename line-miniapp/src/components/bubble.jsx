
import React from "react"

export default function Bubble({ title, description, profile }) {
    return (
        <div
            className="
        relative
        w-40 h-40              
        rounded-full
        bg-linear-to-br from-sky-100 via-rose-50 to-emerald-100
        border border-white/70
        shadow-[0_10px_25px_rgba(15,23,42,0.18)]
        overflow-hidden        /* กัน text ทะลุนอกวงกลม */
        hover:scale-105 active:scale-95
        transition-transform duration-150
      "
        >

            <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-br from-white/60 via-transparent to-transparent opacity-80" />

 
            <div className="relative flex flex-col items-center justify-center h-full px-3 py-2 text-center">
            
                <p
                    className="
            font-semibold
            text-[11px] text-slate-800
            leading-snug
            line-clamp-2
            break-wrap-break-words
          "
                >
                    {title}
                </p>

                <p
                    className="
            mt-1
            text-[10px] text-slate-700
            leading-snug
            line-clamp-3
            wrap-break-words
          "
                >
                    {description}
                </p>

                {profile && (
                    <p
                        className="
              mt-1
              text-[9px] text-slate-500
              leading-none
              truncate
              max-w-[90%]
            "
                    >
                        by {profile}
                    </p>
                )}
            </div>
        </div>
    );
}
