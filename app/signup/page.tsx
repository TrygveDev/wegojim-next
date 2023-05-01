"use client";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress } from "@mui/material";
import wave from "@/public/images/wavedark.png";
import Image from "next/image";
import BackArrow from "../components/BackArrow";
import {
	createUserWithEmailAndPassword,
	signInWithRedirect,
	updateProfile,
	GoogleAuthProvider,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../libs/firebase";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/home");
			} else {
				setInitializing(false);
			}
		});
	}, [router]);

	return initializing ? (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-95 bg-[url('/images/lockbackground.jpg')] bg-cover bg-center bg-blend-multiply">
			<CircularProgress />
		</div>
	) : (
		<main className="flex h-screen w-screen flex-col items-center justify-end bg-black bg-opacity-90 bg-[url('/images/singupbackground.jpg')] bg-cover bg-center bg-blend-multiply overflow-hidden">
			<Image src={wave} alt="" className="w-100 absolute top-60" />
			<BackArrow />
			<div className="flex flex-col items-center justify-center h-56">
				<h1 className="text-2xl font-semibold">Create an account</h1>
				<p className="font-extralight">Ready to sweat? Sign up now</p>
			</div>

			<div className="w-2/3 flex flex-col gap-4 pt-5 pb-20 z-10">
				<div className="w-full flex items-center gap-3 bg-[#1E1E1E] p-5 rounded text-lg">
					<FontAwesomeIcon icon={faUser} size="lg" />
					<input
						className="bg-transparent w-full focus:outline-none"
						maxLength={16}
						placeholder="Username"
						id="username"
						disabled={loading}
						onChange={(e) => setUsername(e.target.value)}
					></input>
				</div>
				<div className="w-full flex items-center gap-3 bg-[#1E1E1E] p-5 rounded text-lg">
					<FontAwesomeIcon icon={faEnvelope} size="lg" />
					<input
						className="bg-transparent w-full focus:outline-none"
						maxLength={16}
						placeholder="Email"
						id="email"
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
						id="password"
						type="password"
						disabled={loading}
						onChange={(e) => setPassword(e.target.value)}
					></input>
				</div>
			</div>

			<div className="flex flex-col gap-3 w-2/3 pb-20">
				<Button
					disabled={loading}
					variant="contained"
					className="text-black bg-white h-16 text-lg"
					onClick={() => {
						setLoading(true);

						var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
						if (
							username.length > 16 ||
							username.length < 3 ||
							username.match(format)
						) {
							setLoading(false);
							return toast.error(
								"Username must be between 3-16 non special characters!"
							);
						}

						createUserWithEmailAndPassword(auth, email, password)
							.then((userCredential) => {
								const user = userCredential.user;
								updateProfile(user, {
									displayName: username,
								}).then(() => {
									setLoading(false);
								});
							})
							.catch((error) => {
								let message = error.message;
								message = message.split(":")[1];
								toast.error(message);
								setLoading(false);
							});
					}}
				>
					SIGN UP
				</Button>
				<Button
					disabled={loading}
					variant="outlined"
					className="h-16 text-lg flex gap-2 capitalize"
					onClick={() => {
						signInWithRedirect(auth, new GoogleAuthProvider());
					}}
				>
					<FontAwesomeIcon icon={faGoogle} />
					Sign up with Google
				</Button>
			</div>
		</main>
	);
}
