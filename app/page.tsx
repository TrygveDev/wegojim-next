"use client";

import { Button, CircularProgress } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "./libs/firebase";
import { useEffect, useState } from "react";
import Loading from "./loading";
import Link from "next/link";

export default function Home() {
	const router = useRouter();
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
		<Loading />
	) : (
		<main className="flex h-screen w-screen flex-col items-center justify-end bg-black bg-opacity-75 bg-[url('/images/lockbackground.jpg')] bg-cover bg-center bg-blend-multiply">
			<div className="flex flex-col items-center h-24 pb-72">
				<h1 className="text-6xl font-extrabold">wegojim</h1>
				<p className="pt-2 font-extralight">
					Track your gains, smash your goals
				</p>
			</div>

			<div className="flex flex-col gap-3 w-2/3 pb-20">
				<Link className="w-full" href="/signin">
					<Button
						variant="outlined"
						className="text-white border-white h-16 text-lg w-full"
						sx={{
							backgroundColor: "transparent",
							color: "white",
							fontSize: "1.25rem",
							border: "1px solid white",
							":focus": { border: "1px solid white" },
						}}
					>
						SIGN IN
					</Button>
				</Link>

				<Link className="w-full" href="/signup">
					<Button
						variant="contained"
						className="text-black bg-white h-16 text-lg w-full"
						sx={{
							backgroundColor: "white",
							color: "black",
							fontSize: "1.25rem",
							":focus": { backgroundColor: "white" },
						}}
					>
						SIGN UP
					</Button>
				</Link>
			</div>
		</main>
	);
}
