import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAhTm8LmboAv1HNIJb-RmvWWMHLH5BrmUc",
  authDomain: "movieguesser-4997e.firebaseapp.com",
  databaseURL: "https://movieguesser-4997e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movieguesser-4997e",
  storageBucket: "movieguesser-4997e.appspot.com",
  messagingSenderId: "554505933058",
  appId: "1:554505933058:web:6a8750820dba98fcf0721b",
  measurementId: "G-4Q7YM88VLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default app
export { database }