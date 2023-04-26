"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDVd69DKjf9XOo6-BAyFqy2nM3R4GXljes",
	authDomain: "wegojim-next.firebaseapp.com",
	projectId: "wegojim-next",
	storageBucket: "wegojim-next.appspot.com",
	messagingSenderId: "855262152106",
	appId: "1:855262152106:web:cba42f1e9739a5ac4a17d3",
	measurementId: "G-GY38MH96D8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
