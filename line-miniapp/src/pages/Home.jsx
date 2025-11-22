
import "../App.css"
import React, { useState, useEffect } from "react";

import FooterNav from "../components/footer";
import Header from "../components/header";
import SearchBar from "../components/searchbar";
import BubbleList from "../components/bubblelist";
import CreateBubblePage from "./createBubble";
import ProfilePage from "./profile.jsx";
import WalletPage from "./wallet.jsx"
import WaitingForSolverPage from "./waiting.jsx"

function formatBubbleData(raw) {
  const maxTitleLen = 40;
  let title = raw.title || "";
  if (title.length > maxTitleLen) {
    title = title.slice(0, maxTitleLen - 1) + "…";
  }

  const maxDescLen = 80;
  let description = raw.description || "";
  if (description.length > maxDescLen) {
    description = description.slice(0, maxDescLen - 1) + "…";
  }

  const profile = raw.requesterName || "Anonymous";
  const distanceText =
    typeof raw.distanceMeters === "number"
      ? `${Math.round(raw.distanceMeters)} m`
      : null;

  return {
    id: raw.id,
    title,
    description,
    profile,
    distanceText,
    priority: raw.priority || "NORMAL",
  };
}

function HomePage({ profile }) {
  const [bubbles, setBubbles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("home");

  useEffect(() => {
    async function fetchBubbles() {
      setIsLoading(true);

      const mockFromDb = [
        {
          id: "1",
          title: "Need powerbank very urgent please",
          description: "hello im from brazil i want powerbank very very fast",
          requesterName: "Lucas",
          distanceMeters: 12,
          priority: "HIGH",
        },
        {
          id: "2",
          title: "ขอยืมสายชาร์จ Type-C",
          description: "แบตจะหมดแล้ว อยู่แถวโต๊ะยาวตรงกลางฮอลล์",
          requesterName: "Mint",
          distanceMeters: 18,
          priority: "NORMAL",
        },
      ];

      const formatted = mockFromDb.map(formatBubbleData);
      setBubbles(formatted);
      setIsLoading(false);
    }

    fetchBubbles();
  }, []);

  if (view === "profile") {
    return <ProfilePage profile={profile} onBack={() => setView("home")} />;
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

  if (view === "create") {
    return (
      <CreateBubblePage
        profile={profile}
        onBack={() => setView("home")}
        onCreated={(createdBubble) => {
          console.log(">>> onCreated in Home:", createdBubble);
          setCurrentBubble(createdBubble);
          setView("waiting");
        }}
      />
    );
  }

  if (view === "wallet") {
    return <WalletPage onBack={() => setView("home")} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <Header />

        <main className="flex-1 px-4 pt-2 pb-24">
          <SearchBar />
          <BubbleList items={bubbles} isLoading={isLoading} />
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