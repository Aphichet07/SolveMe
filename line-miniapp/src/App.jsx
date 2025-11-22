// src/App.jsx
import React, { useEffect, useState } from "react";
import { initLiff } from "./liff/init.js";
import HomePage from "./pages/Home.jsx";

function App() {
  const [profile, setProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setErrorMsg("");

        const liff = await initLiff();


        if (!liff.isLoggedIn()) {
          liff.login(); 
          return;
        }


        const prof = await liff.getProfile();
        const token = liff.getIDToken();

        console.log("LIFF profile:", prof);
        console.log("LIFF ID token:", token);

        setProfile({
          displayName: prof.displayName,
          userId: prof.userId,
          pictureUrl: prof.pictureUrl,
          statusMessage: prof.statusMessage,
        });
        setIdToken(token);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || "init LIFF ล้มเหลว");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-700">กำลังเชื่อมต่อกับ LINE…</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-xs text-center">
          <p className="text-sm text-red-600 mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-xs text-slate-600 mb-4">{errorMsg}</p>
          <button
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs"
            onClick={() => window.location.reload()}
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }


  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-700">
          ไม่สามารถดึงข้อมูลโปรไฟล์จาก LINE ได้
        </p>
      </div>
    );
  }


  return <HomePage profile={profile} idToken={idToken} />;
}

export default App;
