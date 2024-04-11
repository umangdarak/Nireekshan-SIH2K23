import * as firebase from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCEkMUZ4-0zKlCC7WtpQcZgJKB_L6BlZ28",
  authDomain: "nireekshan-4e67b.firebaseapp.com",
  projectId: "nireekshan-4e67b",
  storageBucket: "nireekshan-4e67b.appspot.com",
  messagingSenderId: "604771869243",
  appId: "1:604771869243:web:28bef7a1f41f181ca8321e",
  measurementId: "G-H84BD7QJJ6"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };