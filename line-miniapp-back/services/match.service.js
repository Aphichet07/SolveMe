// services/matchService.js
import { admin, db } from "../firebase/admin.js";

const matchService = {
  /**
   * พยายามหา solver สำหรับ bubble นี้
   * - ถ้ามี match อยู่แล้ว → คืน match เดิม
   * - ถ้ายังไม่มี → หา user active แล้วสร้าง match ใหม่
   */
  async findOrCreateMatchForBubble(bubbleId) {
    const bubbleRef = db.collection("bubbles").doc(bubbleId);
    const bubbleSnap = await bubbleRef.get();

    if (!bubbleSnap.exists) {
      throw new Error("bubble not found");
    }

    const bubbleData = bubbleSnap.data();
    const requesterId = bubbleData.requesterId;

    // ถ้า bubble นี้ถูก match ไปแล้ว
    if (bubbleData.matchId && bubbleData.solverId) {
      const matchRef = db.collection("matches").doc(bubbleData.matchId);
      const matchSnap = await matchRef.get();
      const matchData = matchSnap.exists ? matchSnap.data() : null;

      return {
        status: "MATCHED",
        requesterId,
        solverId: bubbleData.solverId,
        match: matchData,
      };
    }

    // ดึง user ที่ active อยู่
    let usersQuery = db
      .collection("users")
      .where("status", "==", "active")
      .where("active", "==", true)
      .limit(50);

    const usersSnap = await usersQuery.get();

    const candidates = [];
    usersSnap.forEach((docSnap) => {
      const user = docSnap.data();

      // กันไม่ให้ requester match กับตัวเอง
      if (user.line_id === requesterId) return;

      candidates.push({
        id: docSnap.id,
        ...user,
      });
    });

    if (candidates.length === 0) {
      // ยังไม่พบ solver ที่พร้อม
      return {
        status: "SEARCHING",
        requesterId,
        solverId: null,
        match: null,
      };
    }

    // เลือก solver สักคน (ตอนนี้ random ง่าย ๆ ก่อน)
    const idx = Math.floor(Math.random() * candidates.length);
    const solver = candidates[idx];

    // สร้าง match document
    const now = admin.firestore.FieldValue.serverTimestamp();
    const matchDoc = {
      bubbleId,
      requesterId,
      solverId: solver.line_id || solver.id,
      status: "ACTIVE", // ACTIVE | COMPLETED | CANCELLED
      createdAt: now,
      updatedAt: now,
    };

    const matchRef = await db.collection("matches").add(matchDoc);

    // อัปเดต bubble ให้รู้ว่า match แล้ว
    await bubbleRef.update({
      status: "MATCHED",
      matchId: matchRef.id,
      solverId: matchDoc.solverId,
      updatedAt: now,
    });

    return {
      status: "MATCHED",
      requesterId,
      solverId: matchDoc.solverId,
      match: {
        id: matchRef.id,
        ...matchDoc,
      },
      solver, // เผื่อ front อยากโชว์ชื่อ/รูป solver
    };
  },
};

export default matchService;
