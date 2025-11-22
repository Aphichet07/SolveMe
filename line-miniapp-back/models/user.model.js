import { db } from "../utils/firebase.js";
import { collection, Timestamp } from "firebase/firestore";

export const usersCollection = collection(db, "users");

export const USER_STATUS = {
  ACTIVE: "active",
  BANNED: "banned",
  DELETED: "deleted",
};

export function createUserDoc(overrides = {}) {
  const now = Timestamp.now();

  return {
    user_id: null,       
    line_id: null,       
    display_name: "",
    avatar_url: "",
    status: USER_STATUS.ACTIVE,
    is_ready: false,

    location: null,       
    last_active_at: now,
    created_at: now,
    updated_at: now,

    ...overrides,         
  };
}
