"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.FIREBASE_apiKey,
	authDomain: process.env.FIREBASE_authDomain,
	databaseURL: process.env.FIREBASE_databaseURL,
	projectId: process.env.FIREBASE_projectId,
	storageBucket: process.env.FIREBASE_storageBucket,
	messagingSenderId: process.env.FIREBASE_messagingSenderId,
	appId: process.env.FIREBASE_appId,
	measurementId: process.env.FIREBASE_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
