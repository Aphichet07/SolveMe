import { db } from '../utils../firebase.js'
import { collection, Timestamp } from 'firebase/firestore'

export const matchesSchemas = {
    match_id : String,
    problem_id : String,
    requester_id : String,
    helper_id : String,

    status : "pending" | "active" | "completed" | "cancelled",
    chat_rooms_id : [String],
    created_at : Timestamp,
    updated_at : Timestamp,

    start_at : Timestamp,
    end_at : Timestamp  
};

const matchesCollection = collection(db,'matches');

export { matchesCollection };

export default matchesCollection;