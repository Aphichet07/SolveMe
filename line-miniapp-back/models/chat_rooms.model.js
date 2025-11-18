import { db } from '../utils/firebase.js'
import { collection,Timestamp } from 'firebase/firestore'

export const chat_roomsSchemas = {

};

const chat_roomsCollection = collection(db,'chat_rooms');


export { chat_roomsCollection };

export default chat_roomsCollection; 