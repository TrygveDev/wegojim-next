"use client";

import BackArrow from "@/app/components/BackArrow";
import { auth, db } from "@/app/libs/firebase";
import { CircularProgress } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Workout({ params }: any) {
	const router = useRouter();
	const [initializing, setInitializing] = useState(true);
	const [workout, setWorkout] = useState();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				get(ref(db, `${user.uid}/workouts/${params.workoutId}`))
					.then((snapshot) => {
						if (snapshot.exists()) {
							console.log(snapshot.val());
							setWorkout(snapshot.val());
						}
						setInitializing(false);
					})
					.catch((error) => {
						toast.error("Whoops! Something went wrong.");
						console.error(error);
					});
			} else {
				router.push("/");
			}
		});
	}, [params.workoutId, router]);

	return initializing ? (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-[#141414]">
			<CircularProgress />
		</div>
	) : (
		<main className="flex h-screen w-screen flex-col items-center bg-[#141414]">
			<BackArrow />
			<div className="w-screen pl-7 pr-7 pt-24">
				<h1 className="text-4xl text-white">{workout.name}</h1>
			</div>
		</main>
	);
}
