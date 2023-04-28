"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../libs/firebase";
import Navbar from "../components/Navbar";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState();

	useEffect(() => {
		onAuthStateChanged(auth, (user: any) => {
			if (user) {
				setUser(user);
			} else {
				router.push("/");
			}
		});
	}, [router]);

	return (
		<main className="flex h-screen w-screen flex-col items-center justify-center bg-[#141414]">
			<Navbar />
		</main>
	);
}
