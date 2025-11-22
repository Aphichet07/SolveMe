import { db } from '../utils/firebase.js'
import { collection,Timestamp } from 'firebase/firestore'

export const paymentsCollection = collection(db, "payments");

export function createPaymentDoc(overrides = {}) {
  const now = Timestamp.now();
  return {
    payment_id: null,
    match_id: null,
    requester_id: null,
    helper_id: null,
    amount: 0,
    status: "pending",
    transaction_ref: "",
    created_at: now,
    paid_at: null,
    ...overrides,
  };
}

export default paymentsCollection;


