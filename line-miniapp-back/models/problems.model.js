import { db } from '../utils/firebase.js';
import { collection } from 'firebase/firestore';

export const problemsSchema = {
    
};

const problemsCollection = collection(db, 'problem');


export { problemsCollection };

export default problemsCollection;

