// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyxzD1A8NhdEdExXLlZntKgDF4KeHDazo",
  authDomain: "book-market-a6c95.firebaseapp.com",
  projectId: "book-market-a6c95",
  storageBucket: "book-market-a6c95.appspot.com",
  messagingSenderId: "216159753995",
  appId: "1:216159753995:web:ae50f90e0ad1c7f701f40e"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp)
export {firebaseApp} 