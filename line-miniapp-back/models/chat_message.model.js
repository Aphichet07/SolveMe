import { db } from '../utils/firebase.js'
import { collection, Timestamp } from 'firebase/firestore'

const chat_messageSchemas = {

};

const chat_messageCollection = collection(db,'chat_message');

export { chat_messageCollection };

export default chat_messageCollection;