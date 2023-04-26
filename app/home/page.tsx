"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../libs/firebase";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState();

	onAuthStateChanged(auth, (user: any) => {
		if (user) {
			setUser(user);
		} else {
			router.push("/");
		}
	});

	return (
		<main className="flex h-screen w-screen flex-col items-center justify-center bg-black">
			<Button onClick={() => signOut(auth)}>Sign out</Button>
		</main>
	);
}
