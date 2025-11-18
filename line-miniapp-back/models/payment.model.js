import { db } from '../utils/firebase.js'
import { collection,Timestamp } from 'firebase/firestore'

const paymentSchemas = {

};

const paymentCollection = collection(db,'payment');

export { paymentCollection};

export default {paymentCollection};

