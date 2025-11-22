import { admin, db } from "../firebase/admin.js";

const bubbleService = {

    async getBubbles(userId, location = null) {

        if (location == null) {
            location = "nearby";
        }


        let queryRef = db.collection("bubbles").where("status", "==", "OPEN");


        if (userId) {

        }

        const snap = await queryRef.limit(100).get();

        const nowMs = Date.now();

        const items = snap.docs.map((docSnap) => {
            const data = docSnap.data();
            const expiresAt = data.expiresAt || null;

            let timeRemainingMinutes = Number.POSITIVE_INFINITY;
            if (expiresAt && typeof expiresAt.toMillis === "function") {
                const diffMs = expiresAt.toMillis() - nowMs;
                timeRemainingMinutes = diffMs / 60000;
            }

            return {
                id: docSnap.id,
                ...data,
                _timeRemainingMinutes: timeRemainingMinutes,
            };
        });

        function priorityScore(p) {
            if (!p) return 0;
            const v = String(p).toUpperCase();
            if (v === "HIGH") return 3;
            if (v === "NORMAL") return 2;
            if (v === "LOW") return 1;
            return 0;
        }

        items.sort((a, b) => {
            const pa = priorityScore(a.priority);
            const pb = priorityScore(b.priority);

            if (pa !== pb) {
                return pb - pa;
            }

            const ta = a._timeRemainingMinutes;
            const tb = b._timeRemainingMinutes;

            return ta - tb;
        });

        const top20 = items.slice(0, 20);

        return top20.map(({ _timeRemainingMinutes, ...rest }) => rest);
    },


    async createBubble(title, description, expiresInMinutes, userId, location = null) {
        const nowMs = Date.now();
        const expMs = Number(expiresInMinutes || 0) * 60 * 1000;

        const createdAt = admin.firestore.FieldValue.serverTimestamp();
        const expiresAt =
            expMs > 0
                ? admin.firestore.Timestamp.fromMillis(nowMs + expMs)
                : null;

        const doc = {
            title,
            description,
            requesterId: userId,
            expiresInMinutes: Number(expiresInMinutes) || 0,
            status: "OPEN",             // OPEN | MATCHED | CLOSED
            priority: "NORMAL",
            createdAt,
            expiresAt,
            location: location || null,
        };

        const docRef = await db.collection("bubbles").add(doc);

        return {
            id: docRef.id,
            ...doc,
        };
    },
    async getNearbyBubbles(lat, lon, radiusMeters = 20) {
        const nowMs = Date.now();

        // ดึง OPEN bubbles มาก่อน สัก 200 อัน (แล้วค่อย filter ระยะในโค้ด)
        const snap = await db
            .collection("bubbles")
            .where("status", "==", "OPEN")
            .limit(200)
            .get();

        const items = [];

        snap.forEach((docSnap) => {
            const data = docSnap.data();
            const loc = data.location;
            if (!loc || typeof loc.lat !== "number" || typeof loc.lon !== "number") {
                return; // ไม่มี location ข้าม
            }

            const dist = distanceInMeters(lat, lon, loc.lat, loc.lon);
            if (dist > radiusMeters) return; // นอก 20m ก็ไม่เอา

            // เผื่อใช้ logic timeRemaining เหมือนเดิม
            let timeRemainingMinutes = Number.POSITIVE_INFINITY;
            if (data.expiresAt && typeof data.expiresAt.toMillis === "function") {
                const diffMs = data.expiresAt.toMillis() - nowMs;
                timeRemainingMinutes = diffMs / 60000;
            }

            items.push({
                id: docSnap.id,
                ...data,
                _distanceMeters: dist,
                _timeRemainingMinutes: timeRemainingMinutes,
            });
        });

        // จัดอันดับ: priority ก่อน, ถ้าเท่ากันดูเวลาใกล้หมด, ถ้าเท่ากันดูระยะ
        function priorityScore(p) {
            if (!p) return 0;
            const v = String(p).toUpperCase();
            if (v === "HIGH") return 3;
            if (v === "NORMAL") return 2;
            if (v === "LOW") return 1;
            return 0;
        }

        items.sort((a, b) => {
            const pa = priorityScore(a.priority);
            const pb = priorityScore(b.priority);
            if (pa !== pb) return pb - pa; // สูงกว่า มาก่อน

            const ta = a._timeRemainingMinutes;
            const tb = b._timeRemainingMinutes;
            if (ta !== tb) return ta - tb; // ใกล้หมดก่อน

            return a._distanceMeters - b._distanceMeters; // ใกล้กว่า มาก่อน
        });

        const top20 = items.slice(0, 20);

        return top20.map(({ _distanceMeters, _timeRemainingMinutes, ...rest }) => rest);
    },


    async deleteBubble() {
        console.log("Delete");
    },

    async editBubble() {
        console.log("Edit");
    },

    distanceInMeters(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const toRad = (deg) => (deg * Math.PI) / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // เมตร
    }
};

export default bubbleService;
