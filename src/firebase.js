// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtY7zv5GmeGbl4HlzBwjfBjR0sV73HDOc",
  authDomain: "autronc-f1a06.firebaseapp.com",
  projectId: "autronc-f1a06",
  storageBucket: "autronc-f1a06.firebasestorage.app",
  messagingSenderId: "801730716861",
  appId: "1:801730716861:web:1a2b29db0aedd2b8e3c3d4",
  measurementId: "G-C9YCM0YEJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);