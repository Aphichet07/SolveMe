import db from "../models/user.js"

const bubbleService = {
    createBubble: async (title, description, expiresInMinutes, userId) => {
        const now = new Date();
        const expiresMs = Number(expiresInMinutes) * 60 * 1000;
        const expiresAt = new Date(now.getTime() + expiresMs);

        const doc = {
            title,
            description,
            requesterId: userId,
            expiresInMinutes: Number(expiresInMinutes),
            status: "OPEN",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt,
        };

        const docRef = await db.collection("bubbles").add(doc);

        return json({
            id: docRef.id,
            ...doc,
        }
        )
    }
    ,
    deleteBubble: async () => {
        console.log("Delete")
    },
    editBubble: async () => {
        console.log("Edit")
    }
}

export default bubbleService