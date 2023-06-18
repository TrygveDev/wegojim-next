"use client";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BackArrow from "../../components/BackArrow";
import {
	createUserWithEmailAndPassword,
	signInWithRedirect,
	updateProfile,
	GoogleAuthProvider,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../libs/firebase";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function Signup() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) return setLoading(false);
			router.push("/");
		});
	}, [router]);

	return loading ? (
		<Loading />
	) : (
		<>
			<BackArrow path="/auth" />
			<main className=" h-screen w-screen flex flex-col items-center justify-evenly bg-[var(--secondary)]">
				{/* Title */}
				<div className="flex flex-col items-center justify-center">
					<h1 className="text-2xl font-semibold">
						Create your account
					</h1>
					<p className="font-extralight">
						Ready to sweat? Sign up now
					</p>
				</div>
				{/* Input */}
				<div className="w-2/3 flex flex-col gap-4">
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
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
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faEnvelope} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={50}
							placeholder="Email"
							disabled={loading}
							onChange={(e) => setEmail(e.target.value)}
						></input>
					</div>
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faLock} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={32}
							placeholder="Password"
							disabled={loading}
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						></input>
					</div>
				</div>

				{/* Buttons */}
				<div className="flex flex-col gap-3 w-2/3">
					<button
						className="bg-[var(--primary-button)] h-16 text-lg w-full flex items-center justify-center rounded"
						disabled={loading}
						onClick={() => {
							setLoading(true);

							var format =
								/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
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

							createUserWithEmailAndPassword(
								auth,
								email,
								password
							)
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
						Sign up
					</button>

					<button
						className="bg-[var(--secondary-button)] h-16 text-lg w-full flex items-center justify-evenly rounded"
						disabled={loading}
						onClick={() => {
							signInWithRedirect(auth, new GoogleAuthProvider());
						}}
					>
						<FontAwesomeIcon icon={faGoogle} />
						<p>Google Login</p>
					</button>
				</div>
			</main>
		</>
	);
}
