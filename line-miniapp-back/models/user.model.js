import { db } from '../utils/firebase.js';
import { collection } from "firebase/firestore";

export const userSchema = {
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
};

const usersCollection = collection(db, 'users');

export { usersCollection };

export default usersCollection;