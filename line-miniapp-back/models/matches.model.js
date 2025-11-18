import { db } from '../utils../firebase.js'
import { collection, Timestamp } from 'firebase/firestore'

export const matchesSchemas = {
    problem_id : String,
    requester_id : String,
    
};

const matchesCollection = collection(db,'matches');

export { matchesCollection };

export default matchesCollection;