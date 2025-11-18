import { db } from '../utils/firebase.js';
import { collection, Timestamp } from "firebase/firestore";

export const userSchema = {
  user_id : String,
  line_id : String,
  display_name : String,
  avatar_url : String,
  status : "active" | "banned" | "deleted",
  is_ready : Boolean,
  last_active_at : Timestamp,

  //location
  location : {
    lat : Number,
    lon : Number
  },
  last_active_at : Timestamp,
  create_at : Timestamp,
  update_at : Timestamp

  //
};

const usersCollection = collection(db, 'users');

export { usersCollection };

export default usersCollection;