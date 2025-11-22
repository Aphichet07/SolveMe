import {
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    doc
} from "firebase/firestore";
import {db} from "../../utils/firebase.js";
import usersCollection from "../../models/user.model.js";

export const loginUser = async (req, res) => {
    try{
        const { line_id, display_name, picture_url } = req.body;
        if(!line_id){
            return res.status(400).json({ message: "line_id is required" });
        }

        // Check if user exists
        const q =  query(usersCollection, where("line_id", "==", line_id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            // User exists, update their info
            const userDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'users', userDoc.id), {
                display_name: display_name,
                avatar_url: picture_url,
                status: "active"
                
            });
            return res.status(200).json({ message: "User logged in successfully", user_id: userDoc.id }); //save user_id in response
        } else {
            // User does not exist, create new user
            const newUser = {
                line_id: line_id,
                display_name: display_name,
                avatar_url: picture_url,
                status: "active",
                is_ready: false,
                last_active_at: new Date(),
                create_at: new Date(),
                update_at: new Date()
            };
            const docRef = await addDoc(usersCollection, newUser);
            return res.status(201).json({ message: "User created and logged in successfully", user_id: docRef.id }); //save user_id in response
        }
    }
    catch (error) { 
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
