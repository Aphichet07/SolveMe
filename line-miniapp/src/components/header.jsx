export default function Header({ title = "LINE Mini App", subtitle, onBack, profile }) {
    return (
        <header className="sticky top-0 z-20">
            <div className="backdrop-blur-xl bg-slate-900/70 border-b border-slate-800">
                <div className="max-w-md mx-auto flex items-center gap-3 px-4 py-3">
                    {/* ปุ่ม Back (ถ้ามี onBack ส่งมา) */}
                    {onBack && (
                        <button onClick={onBack}
                            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 hover:bg-slate-800 active:scale-95 transition">
                            <span className="text-slate-200 text-lg leading-none">←</span>
                        </button>
                    )}

                    {/* ชื่อแอป + subtitle */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-slate-50 text-base font-semibold truncate">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-[11px] text-slate-400 truncate">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* โปรไฟล์ขวาบน (ถ้ามี profile ส่งมา) */}
                    {profile && (
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-slate-400 max-w-[90px] truncate">
                                {profile.displayName}
                            </span>
                            <img src={profile.pictureUrl} alt="profile" className="w-9 h-9 rounded-full border border-slate-700" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}