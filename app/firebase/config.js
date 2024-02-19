// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey : "AIzaSyBKtfJMLAPxqUFkq7dckE2qGwnVltOce1w" , 
  authDomain : "scholar-sync-68a93.firebaseapp.com" , 
  projectId : "scholar-sync-68a93" , 
  storageBucket : "scholar-sync-68a93.appspot.com" , 
  messagingSenderId : "183898177768" , 
  appId : "1:183898177768:web:fef757bb90d5a50b1d495d" , 
  measurementId : "G-ND72SH5V71" 
};
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export { app, auth, db};