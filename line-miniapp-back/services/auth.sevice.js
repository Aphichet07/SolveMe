
import { admin, db } from "../firebase/admin.js";

const userService = {
    async upsertUserOnEnter({ line_id, display_name, avatar_url }) {
        const usersRef = db.collection("users");

        const snap = await usersRef.where("line_id", "==", line_id).limit(1).get();

        const now = admin.firestore.FieldValue.serverTimestamp();

        if (snap.empty) {

            const doc = {
                line_id,
                display_name: display_name || "",
                avatar_url: avatar_url || "",
                status: "active",
                is_ready: false,
                active: true,
                last_active_at: now,
                created_at: now,
                updated_at: now,
            };
            const ref = await usersRef.add(doc);
            return { id: ref.id, ...doc };
        } else {
            const docSnap = snap.docs[0];
            const ref = docSnap.ref;
            const data = docSnap.data();

            const update = {
                display_name: display_name || data.display_name,
                avatar_url: avatar_url || data.avatar_url,
                status: "active",
                active: true,
                last_active_at: now,
                updated_at: now,
            };

            await ref.update(update);
            return { id: ref.id, ...data, ...update };
        }
    },

    async updateHeartbeat(line_id) {
        const usersRef = db.collection("users");
        const snap = await usersRef.where("line_id", "==", line_id).limit(1).get();
        if (snap.empty) return;

        const now = admin.firestore.FieldValue.serverTimestamp();
        const ref = snap.docs[0].ref;

        await ref.update({
            last_active_at: now,
            active: true,
            updated_at: now,
        });
    },
    async setUserReady(line_id, is_ready) {
        const usersRef = db.collection("users");
        const snap = await usersRef.where("line_id", "==", line_id).limit(1).get();

        if (snap.empty) {
            throw new Error("user not found");
        }

        const docSnap = snap.docs[0];
        const ref = docSnap.ref;
        const now = admin.firestore.FieldValue.serverTimestamp();

        const update = {
            is_ready: is_ready,
            active: is_ready ? true : false, 
            last_active_at: now,
            updated_at: now,
        };

        await ref.update(update);

        return { id: ref.id, ...docSnap.data(), ...update };
    },

};

export default userService;
