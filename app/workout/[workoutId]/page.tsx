"use client";

import BackArrow from "@/app/components/BackArrow";
import { auth, db } from "@/app/libs/firebase";
import Loading from "@/app/loading";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import WorkoutCard from "../WorkoutCard";
import ActiveWorkoutCard from "./ActiveWorkoutCard";
import WeightInputModal from "@/app/components/WeightInputModal";

interface Workout {
	name: string;
	icon: string;
	exercises: {
		[key: string]: {
			name: string;
			sets: string | number;
			reps: string | number;
		};
	};
}

export default function Workout({ params }: any) {
	const router = useRouter();
	const [initializing, setInitializing] = useState<boolean>(true);
	const [workout, setWorkout] = useState<Workout>();
	const [active, setActive] = useState<string>();
	const [weightSubmit, setWeightSubmit] = useState<boolean>(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				get(ref(db, `userWorkouts/${user.uid}/${params.workoutId}`))
					.then((snapshot) => {
						if (snapshot.exists()) {
							setWorkout(snapshot.val());
							setActive(Object.keys(snapshot.val().exercises)[0]);
							setInitializing(false);
						} else {
							toast.error("Whoops! Something went wrong.");
							setInitializing(false);
						}
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
		<Loading />
	) : (
		<main className="min-h-screen max-h-fit w-screen flex flex-col items-center bg-[var(--secondary)] pb-7">
			<BackArrow />

			{/* Weight input modal */}
			<WeightInputModal
				open={weightSubmit}
				setOpen={setWeightSubmit}
				active={active}
				workout={workout}
			/>

			{/* Title */}
			<div className="w-screen pl-7 pr-7 pt-20 pb-5">
				<h1 className="text-3xl">{workout.name}</h1>
			</div>

			{/* Workout list */}
			<div className="w-screen pl-7 pr-7 flex flex-col gap-3 overflow-y-scroll">
				{workout &&
					Object.entries(workout.exercises).map((exercise, i) =>
						active === exercise[0] ? (
							<ActiveWorkoutCard
								key={i}
								exercise={exercise}
								setWeightSubmit={setWeightSubmit}
							/>
						) : (
							<WorkoutCard
								key={i}
								setActive={setActive}
								exercise={exercise}
							/>
						)
					)}
			</div>
		</main>
	);
}
