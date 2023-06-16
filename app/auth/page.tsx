"use client";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../libs/firebase";
import Loading from "../loading";
import Link from "next/link";

export default function Auth() {
	const router = useRouter();
	const [initializing, setInitializing] = useState<boolean>(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) return setInitializing(false);
			router.push("/");
		});
	}, [router]);

	return initializing ? (
		<Loading />
	) : (
		<main className="h-screen w-screen flex flex-col items-center justify-evenly bg-[var(--secondary)] p-7">
			<div className="w-full text-center">
				<h1 className="text-5xl font-extrabold">wegojim</h1>
				<p>Track your gains, smash your goals</p>
			</div>
			<div className="w-full flex flex-col gap-4">
				<Link href="/auth/login">
					<button className="bg-[var(--primary-button)] h-16 text-lg w-full flex items-center justify-center rounded">
						Login
					</button>
				</Link>
				<Link href="/auth/signup">
					<button className="bg-[var(--secondary-button)] h-16 text-lg w-full flex items-center justify-center rounded">
						Signup
					</button>
				</Link>
			</div>
		</main>
	);
}
