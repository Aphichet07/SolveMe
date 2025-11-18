import { db } from '../utils/firebase.js';
import { collection, Timestamp} from 'firebase/firestore';

export const problemsSchema = {
    
};

const problemsCollection = collection(db, 'problems');


export { problemsCollection };

export default problemsCollection;

