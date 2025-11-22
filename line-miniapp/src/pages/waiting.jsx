import React, { useEffect, useState } from "react";

export default function WaitingForSolverPage({ bubble, onBack, onMatched }) {
    const [status, setStatus] = useState("searching"); // "searching" | "matched" | "timeout" | "error"
    const [matchedSolver, setMatchedSolver] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!bubble?.id) return;

        let intervalId;

        async function pollMatchStatus() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/bubbles/${bubble.id}/match-status`
                );

                if (!res.ok) {
                    throw new Error("เช็คสถานะ matching ไม่สำเร็จ");
                }

                const data = await res.json();
            

                if (data.status === "MATCHED") {
                    setStatus("matched");
                    setMatchedSolver(data.solver || null);
                    clearInterval(intervalId);

                    
                    if (onMatched && data.matchId) {
                        onMatched({
                            bubble,
                            matchId: data.matchId,
                            solver: data.solver || null,
                        });
                    }
                } else if (data.status === "TIMEOUT") {
                    setStatus("timeout");
                    clearInterval(intervalId);
                } else {
                    setStatus("searching");
                }
            } catch (err) {
                console.error(err);
                setErrorMsg(err.message);
                setStatus("error");
                clearInterval(intervalId);
            }
        }

        intervalId = setInterval(pollMatchStatus, 3000);
        pollMatchStatus(); 

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [bubble?.id, onMatched]);

    const title = bubble?.title || "ปัญหาของคุณ";
    const description = bubble?.description || "";

    const renderStatusText = () => {
        switch (status) {
            case "searching":
                return "กำลังหา solver ที่เหมาะสมที่สุดให้คุณ…";
            case "matched":
                return matchedSolver
                    ? `พบ solver: ${matchedSolver.name || "Solver"} แล้ว! กำลังพาเข้าสู่ห้องแชท…`
                    : "พบ solver แล้ว! กำลังพาเข้าสู่ห้องแชท…";
            case "timeout":
                return "ยังไม่พบ solver ที่พร้อมช่วยในเวลานี้";
            case "error":
                return "เกิดข้อผิดพลาดในการเช็คสถานะ matching";
            default:
                return "";
        }
    };

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
                            กำลังหา Solver
                        </span>
                    </div>
                </header>

                <main className="flex-1 px-4 pt-6 pb-24 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-4" />

                    <p className="text-sm text-slate-800 text-center mb-1">
                        {renderStatusText()}
                    </p>

                    {errorMsg && (
                        <p className="text-[11px] text-red-500 mt-1">{errorMsg}</p>
                    )}

                    <div className="mt-5 w-full bg-white rounded-2xl shadow-sm p-4">
                        <p className="text-[11px] text-slate-500 mb-1">
                            ปัญหาที่คุณต้องการความช่วยเหลือ
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                            {title}
                        </p>
                        {description && (
                            <p className="mt-1 text-[12px] text-slate-700">
                                {description}
                            </p>
                        )}
                    </div>

                    {(status === "timeout" || status === "error") && (
                        <button
                            onClick={onBack}
                            className="mt-4 w-full h-9 rounded-xl bg-slate-200 text-xs text-slate-700"
                        >
                            กลับหน้าหลัก
                        </button>
                    )}
                </main>
            </div>
        </div>
    );
}
