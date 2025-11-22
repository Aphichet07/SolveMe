import { db } from '../utils/firebase.js'
import { collection,Timestamp } from 'firebase/firestore'

const paymentSchemas = {
    payment_id : String,
    match_id : String,

    requester_id : String,
    helper_id : String,

    amount : Number,
    status : String,
    transition_ref : String,
    
    create_at : Timestamp,
    paid_at : Timestamp,

};

const paymentCollection = collection(db,'payment');

export { paymentCollection};

export default {paymentCollection};

