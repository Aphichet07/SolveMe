import "../App.css";
import React, { useState, useEffect } from "react";

import FooterNav from "../components/footer";
import Header from "../components/header";
import SearchBar from "../components/searchbar";
import BubbleList from "../components/bubblelist";
import CreateBubblePage from "./createBubble";
import ProfilePage from "./profile.jsx";
import WalletPage from "./wallet.jsx";
import WaitingForSolverPage from "./waiting.jsx";

function formatBubbleData(raw) {
  const maxTitleLen = 40;
  const maxDescLen = 80;

  let title = raw.title || "";
  if (title.length > maxTitleLen) {
    title = title.slice(0, maxTitleLen - 1) + "…";
  }

  let description = raw.description || "";
  if (description.length > maxDescLen) {
    description = description.slice(0, maxDescLen - 1) + "…";
  }

  return {
    id: raw.id,
    title,
    description,
    profile: raw.requesterId || "Anonymous",
    distanceText: null,
    priority: raw.status || "OPEN",
  };
}

function HomePage({ profile, idToken, role }) {
  const [bubbles, setBubbles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchText, setSearchText] = useState("");

  const [view, setView] = useState("home"); // "home" | "profile" | "wallet" | "create" | "waiting"
  const [currentBubble, setCurrentBubble] = useState(null);

  // พิกัดของ user (ใช้ตอนเป็น solver)
  const [geo, setGeo] = useState(null);

  // ขอ location เฉพาะตอนเป็น solver
  useEffect(() => {
    if (role !== "solver") return;
    if (!navigator.geolocation) {
      setErrorMsg("อุปกรณ์นี้ไม่รองรับการใช้ตำแหน่งที่ตั้ง");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geo error:", err);
        setErrorMsg("ไม่สามารถดึงตำแหน่งจากอุปกรณ์ได้");
      }
    );
  }, [role]);

  // ดึง bubble ตาม role
  useEffect(() => {
    async function fetchBubblesForRequester() {
      try {
        setIsLoading(true);
        setErrorMsg("");

        const params = new URLSearchParams();
        if (profile?.userId) {
          params.set("userId", profile.userId);
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/bubbles/list?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "โหลด bubble ไม่สำเร็จ");
        }

        const data = await res.json();
        const formatted = (data || []).map(formatBubbleData);
        setBubbles(formatted);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || "เกิดข้อผิดพลาดในการโหลด bubble");
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchBubblesForSolver() {
      if (!geo) return; // ยังไม่มีพิกัด → รอ useEffect ด้านบน setGeo ก่อน

      try {
        setIsLoading(true);
        setErrorMsg("");

        const params = new URLSearchParams({
          lat: String(geo.lat),
          lon: String(geo.lon),
          radiusMeters: "20",
        });

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/bubbles/nearby?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "โหลด bubble ใกล้คุณไม่สำเร็จ");
        }

        const data = await res.json();
        const formatted = (data || []).map(formatBubbleData);
        setBubbles(formatted);
      } catch (err) {
     
        setErrorMsg(err.message || "เกิดข้อผิดพลาดในการโหลด bubble ใกล้คุณ");
      } finally {
        setIsLoading(false);
      }
    }

    if (role === "solver") {

      if (geo) {
        fetchBubblesForSolver();
      }
    } else {

      fetchBubblesForRequester();
    }
  }, [role, profile?.userId, geo]);

  const filteredBubbles = bubbles.filter((b) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    );
  });


  if (view === "profile") {
    return (
      <ProfilePage
        profile={profile}
        onBack={() => setView("home")}
      />
    );
  }

  if (view === "wallet") {
    return <WalletPage onBack={() => setView("home")} />;
  }

  if (view === "create") {
    return (
      <CreateBubblePage
        profile={profile}
        onBack={() => setView("home")}
        onCreated={(createdBubble) => {
          setCurrentBubble(createdBubble);
          setView("waiting");
        }}
      />
    );
  }

  if (view === "waiting") {
    return (
      <WaitingForSolverPage
        bubble={currentBubble}
        onBack={() => {
          setCurrentBubble(null);
          setView("home");
        }}
      />
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <Header />

        <main className="flex-1 px-4 pt-2 pb-24">
          <SearchBar value={searchText} onChange={setSearchText} />

          {errorMsg && (
            <div className="mt-2 text-[11px] text-red-500">{errorMsg}</div>
          )}


          <p className="mt-1 text-[11px] text-slate-500">
            {role === "solver"
              ? "กำลังแสดงปัญหาที่อยู่ใกล้คุณ (ประมาณ 20 เมตร)"
              : "กำลังแสดงปัญหาที่ถูกสร้างในระบบ"}
          </p>

          <BubbleList items={filteredBubbles} isLoading={isLoading} />
        </main>

        <FooterNav
          onPlusClick={() => setView("create")}
          onProfileClick={() => setView("profile")}
          onWalletClick={() => setView("wallet")}
        />
      </div>
    </div>
  );
}

export default HomePage;
