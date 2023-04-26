"use client";

import { Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "./libs/firebase";

export default function Home() {
	const router = useRouter();

	onAuthStateChanged(auth, (user) => {
		if (user) {
			router.push("/home");
		}
	});
	return (
		<main className="flex h-screen w-screen flex-col items-center justify-end bg-black bg-opacity-90 bg-[url('/images/lockbackground.jpg')] bg-cover bg-center bg-blend-multiply">
			<div className="flex flex-col items-center h-24 pb-72">
				<h1 className="text-6xl font-extrabold">wegojim</h1>
				<p className="pt-2 font-extralight">
					Track your gains, smash your goals
				</p>
			</div>

			<div className="flex flex-col gap-3 w-2/3 pb-20">
				<Button
					variant="outlined"
					className="text-white border-white h-16 text-lg"
					onClick={() => router.push("/signin")}
				>
					SIGN IN
				</Button>
				<Button
					variant="contained"
					className="text-black bg-white h-16 text-lg"
					onClick={() => router.push("/signup")}
				>
					SIGN UP
				</Button>
			</div>
		</main>
	);
}
