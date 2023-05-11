"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp({
	apiKey: process.env.apiKey as string,
	authDomain: process.env.authDomain as string,
	databaseURL: process.env.databaseURL as string,
	projectId: process.env.projectId as string,
	storageBucket: process.env.storageBucket as string,
	messagingSenderId: process.env.messagingSenderId as string,
	appId: process.env.appId as string,
	measurementId: process.env.measurementId as string,
});
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
