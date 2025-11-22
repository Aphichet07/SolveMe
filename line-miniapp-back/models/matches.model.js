import { db } from '../utils../firebase.js'
import { collection, Timestamp } from 'firebase/firestore'

export const MATCH_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export function createMatchDoc(overrides = {}) {
  const now = Timestamp.now();
  return {
    problem_id: null,
    requester_id: null,
    helper_id: null,
    status: MATCH_STATUS.PENDING,
    chat_rooms_id: [],  
    created_at: now,
    updated_at: now,
    start_at: null,
    end_at: null,
    ...overrides,
  };
}

export const matchesCollection = collection(db, "matches");
