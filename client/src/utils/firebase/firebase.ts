// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "",
    authDomain: "mapa-interactivo-cultural.firebaseapp.com",
    projectId: "mapa-interactivo-cultural",
    storageBucket: "mapa-interactivo-cultural.appspot.com",
    messagingSenderId: "943176442176",
    appId: "1:943176442176:web:08169fe3bb50a6c6645aa5",
    measurementId: "G-HYD88XE282"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

export default firebaseApp;
