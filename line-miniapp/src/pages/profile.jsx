import React from "react";

export default function ProfilePage({ profile, onBack }) {
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center">
        <div className="w-full max-w-md flex flex-col">
          <header className="bg-white border-b border-slate-100">
            <div className="h-12 px-4 flex items-center gap-3">
              <button
                onClick={onBack}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-sm"
              >
                ←
              </button>
              <span className="text-sm font-semibold text-slate-800">
                โปรไฟล์
              </span>
            </div>
          </header>

          <main className="flex-1 px-4 pt-4 pb-24 flex items-center justify-center">
            <p className="text-xs text-slate-500">
              ยังไม่มีข้อมูลโปรไฟล์ที่ส่งเข้ามา
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md flex flex-col">

        <header className="bg-white border-b border-slate-100">
          <div className="h-12 px-4 flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-sm"
            >
              ←
            </button>
            <span className="text-sm font-semibold text-slate-800">
              โปรไฟล์ของคุณ
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 pt-4 pb-24">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-3 items-center">
            {profile.pictureUrl && (
              <img
                src={profile.pictureUrl}
                alt="avatar"
                className="w-14 h-14 rounded-full border border-slate-200"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {profile.displayName || "ไม่ทราบชื่อ"}
              </p>
              {profile.userId && (
                <p className="text-[11px] text-slate-500 break-all mt-1">
                  userId: {profile.userId}
                </p>
              )}
            </div>
          </div>

          {profile.statusMessage && (
            <div className="mt-3 bg-white rounded-2xl shadow-sm p-3">
              <p className="text-[11px] text-slate-500 mb-1">สเตตัส</p>
              <p className="text-sm text-slate-800">
                {profile.statusMessage}
              </p>
            </div>
          )}

          <div className="mt-4 text-[11px] text-slate-500">
            โปรไฟล์นี้มาจากข้อมูลที่ LINE ส่งให้ผ่าน LIFF
          </div>
        </main>
      </div>
    </div>
  );
}
