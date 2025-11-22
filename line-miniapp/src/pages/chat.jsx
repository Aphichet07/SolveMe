// import React, { useEffect, useState, useRef } from "react";
// import {
//     onSnapshot,
//     query,
//     orderBy,
//     addDoc,
//     serverTimestamp,
// } from "firebase/firestore";
// import { getMessagesCollection } from "../models/chat_message.model.js";

// export default function ChatPage({ profile, matchId, bubble, otherUser, onBack }) {
//     const [messages, setMessages] = useState([]);
//     const [text, setText] = useState("");
//     const [sending, setSending] = useState(false);

//     const listRef = useRef(null);
//     const userId = profile?.userId;

//     // subscribe ข้อความ realtime
//     useEffect(() => {
//         if (!matchId) return;

//         const colRef = getMessagesCollection(matchId);
//         const q = query(colRef, orderBy("create_at", "asc"));

//         const unsub = onSnapshot(q, (snap) => {
//             const items = [];
//             snap.forEach((doc) => {
//                 items.push({ id: doc.id, ...doc.data() });
//             });
//             setMessages(items);

//             // scroll ลงล่างสุด
//             if (listRef.current) {
//                 setTimeout(() => {
//                     listRef.current.scrollTop = listRef.current.scrollHeight;
//                 }, 0);
//             }
//         });

//         return () => unsub();
//     }, [matchId]);

//     const handleSend = async (e) => {
//         e?.preventDefault();

//         if (!matchId || !userId) return;
//         const trimmed = text.trim();
//         if (!trimmed) return;

//         try {
//             setSending(true);
//             const colRef = getMessagesCollection(matchId);

//             await addDoc(colRef, {
//                 chat_room_id: matchId,
//                 sender_id: userId,
//                 message: trimmed,
//                 create_at: serverTimestamp(),
//             });

//             setText("");
//         } catch (err) {
//             console.error("send message error:", err);
//             // TODO: alert error ถ้าต้องการ
//         } finally {
//             setSending(false);
//         }
//     };

//     const renderTitle = () => {
//         if (otherUser?.name) {
//             return otherUser.name;
//         }
//         return "ห้องแชท";
//     };

//     return (
//         <div className="min-h-screen bg-slate-50 flex justify-center">
//             <div className="w-full max-w-md flex flex-col">
//                 {/* Header */}
//                 <header className="bg-white border-b border-slate-100">
//                     <div className="h-12 px-4 flex items-center justify-between gap-3">
//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={onBack}
//                                 className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-sm"
//                             >
//                                 ←
//                             </button>
//                             <div className="flex flex-col">
//                                 <span className="text-sm font-semibold text-slate-800">
//                                     {renderTitle()}
//                                 </span>
//                                 {bubble?.title && (
//                                     <span className="text-[10px] text-slate-500 truncate max-w-[180px]">
//                                         {bubble.title}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Message list */}
//                 <main className="flex-1 flex flex-col">
//                     <div
//                         ref={listRef}
//                         className="flex-1 px-3 py-3 overflow-y-auto bg-slate-50"
//                     >
//                         {messages.length === 0 && (
//                             <p className="text-[11px] text-center text-slate-400 mt-4">
//                                 ยังไม่มีข้อความ เริ่มพิมพ์เพื่อคุยกันได้เลย
//                             </p>
//                         )}

//                         <div className="flex flex-col gap-2">
//                             {messages.map((m) => {
//                                 const isMe = m.sender_id === userId;
//                                 return (
//                                     <div
//                                         key={m.id}
//                                         className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//                                     >
//                                         <div
//                                             className={`
//                         max-w-[75%] rounded-2xl px-3 py-2 text-[12px]
//                         ${isMe
//                                                     ? "bg-emerald-500 text-white rounded-br-sm"
//                                                     : "bg-white text-slate-800 rounded-bl-sm border border-slate-100"}
//                       `}
//                                         >
//                                             <p className="whitespace-pre-wrap wrap-break-word">
//                                                 {m.message}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* Input */}
//                     <form
//                         onSubmit={handleSend}
//                         className="h-14 px-3 pb-3 pt-2 bg-white border-t border-slate-200 flex items-center gap-2"
//                     >
//                         <input
//                             type="text"
//                             value={text}
//                             onChange={(e) => setText(e.target.value)}
//                             placeholder="พิมพ์ข้อความ…"
//                             className="flex-1 h-9 rounded-full bg-slate-100 px-3 text-[13px] outline-none"
//                         />
//                         <button
//                             type="submit"
//                             disabled={sending || !text.trim()}
//                             className={`
//                 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold
//                 ${sending || !text.trim()
//                                     ? "bg-slate-200 text-slate-400"
//                                     : "bg-emerald-500 text-white active:scale-95"}
//               `}
//                         >
//                             ➤
//                         </button>
//                     </form>
//                 </main>
//             </div>
//         </div>
//     );
// }
