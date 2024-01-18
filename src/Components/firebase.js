import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCH2lg6z8TiMpc1NfXONngYyDbPh3pjwrM",
  authDomain: "fish-feeder-9341e.firebaseapp.com",
  projectId: "fish-feeder-9341e",
  storageBucket: "fish-feeder-9341e.appspot.com",
  messagingSenderId: "789500190026",
  appId: "1:789500190026:web:99697cfafdc7282fcdf5b3"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
