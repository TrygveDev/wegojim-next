"use client";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import wave from "@/public/images/wave.png";
import Image from "next/image";
import BackArrow from "../components/BackArrow";
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithRedirect,
} from "firebase/auth";
import { auth } from "../libs/firebase";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			router.push("/home");
		}
	});

	return (
		<main className="flex h-screen w-screen flex-col items-center justify-end bg-black bg-opacity-90 bg-[url('/images/singinbackground.jpg')] bg-cover bg-center bg-blend-multiply">
			<Image src={wave} alt="" className="w-100 absolute top-60" />
			<BackArrow path="/" />
			<div className="flex flex-col items-center justify-center h-72">
				<h1 className="text-2xl font-semibold">
					Sign in to your account
				</h1>
				<p className="font-extralight">Keep curshing those goals!</p>
			</div>

			<div className="w-2/3 flex flex-col gap-4 pt-5 pb-24 z-10">
				<div className="w-full flex items-center gap-3 bg-[#1E1E1E] p-5 rounded text-lg">
					<FontAwesomeIcon icon={faEnvelope} size="lg" />
					<input
						className="bg-transparent w-full focus:outline-none"
						maxLength={16}
						placeholder="Email"
						disabled={loading}
						onChange={(e) => setEmail(e.target.value)}
					></input>
				</div>
				<div className="w-full flex items-center gap-3 bg-[#1E1E1E] p-5 rounded text-lg">
					<FontAwesomeIcon icon={faLock} size="lg" />
					<input
						className="bg-transparent w-full focus:outline-none"
						maxLength={16}
						placeholder="Password"
						disabled={loading}
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					></input>
				</div>
				<p
					className="w-full text-center text-[#505050]"
					onClick={() => {
						if (email.length === 0) {
							return toast.error(
								"Please input an email in the email field and a reset mail will be sent."
							);
						}
						sendPasswordResetEmail(auth, email)
							.then(() => {
								toast.success(
									"A password reset email has been sendt to " +
										email
								);
							})
							.catch((error) => {
								let message = error.message;
								message = message.split(":")[1];
								toast.error(message);
								setLoading(false);
							});
					}}
				>
					I forgot my password
				</p>
			</div>

			<div className="flex flex-col gap-3 w-2/3 pb-20">
				<Button
					variant="contained"
					className="text-black bg-white h-16 text-lg"
					onClick={() => {
						setLoading(true);

						console.log(email, password);

						signInWithEmailAndPassword(auth, email, password)
							.then(() => {})
							.catch((error) => {
								let message = error.message;
								message = message.split(":")[1];
								toast.error(message);
								setLoading(false);
							});
					}}
					disabled={loading}
				>
					SIGN IN
				</Button>
				<Button
					variant="outlined"
					className="h-16 text-lg flex gap-2 capitalize"
					disabled={loading}
					onClick={() => {
						signInWithRedirect(auth, new GoogleAuthProvider());
					}}
				>
					<FontAwesomeIcon icon={faGoogle} />
					Sign in with Google
				</Button>
			</div>
		</main>
	);
}