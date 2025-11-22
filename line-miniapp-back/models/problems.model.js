import { db } from '../utils/firebase.js';
import { collection, Timestamp} from 'firebase/firestore';

export const problemsSchema = {
    problem_id : Number,
    requester_id : Number,

    title : String,
    description : String,
    status : "open" | "in_progress" | "completed" | "cancelled",
    reward : Number,

    location : {
        lat : Number,
        lon : Number
    },
    created_at : Timestamp,
    updated_at : Timestamp
};

const problemsCollection = collection(db, 'problems');


export { problemsCollection };

export default problemsCollection;

