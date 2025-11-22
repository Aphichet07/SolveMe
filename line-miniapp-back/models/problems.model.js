import { db } from '../utils/firebase.js';
import { collection, Timestamp} from 'firebase/firestore';

export const PROBLEM_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export function createProblemDoc(overrides = {}) {
  const now = Timestamp.now();
  return {
    requester_id: null,
    title: "",
    description: "",
    status: PROBLEM_STATUS.OPEN,
    reward: 0,
    location: null, 
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

export const problemsCollection = collection(db, "problems");
export default problemsCollection;


