// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC8WYcM40gZWb7OSKv_IXO-z0g-9p75po",
  authDomain: "undercover-b8b4f.firebaseapp.com",
  projectId: "undercover-b8b4f",
  storageBucket: "undercover-b8b4f.appspot.com",
  messagingSenderId: "657020303413",
  appId: "1:657020303413:web:8768b4a802f3a716d1d97c",
  measurementId: "G-QNEWGRSRC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

var admin = require("firebase-admin");

var serviceAccount = require("undercover-b8b4f-firebase-adminsdk-rj5ia-f3f65742b9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});