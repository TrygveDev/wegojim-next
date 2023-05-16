"use client";

import BackArrow from "@/app/components/BackArrow";
import { auth, db } from "@/app/libs/firebase";
import { CircularProgress } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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
	const [initializing, setInitializing] = useState(true);
	const [workout, setWorkout] = useState<Workout>();
	const [active, setActive] = useState<string>();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				get(ref(db, `${user.uid}/workouts/${params.workoutId}`))
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

	const handleExerciseClick = (exercise: any) => {
		toast.error("This feature is not available yet!");
	};

	return initializing ? (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-[var(--secondary)]">
			<CircularProgress />
		</div>
	) : (
		<main className="flex h-screen w-screen flex-col items-center bg-[var(--secondary)]">
			<BackArrow />
			<div className="w-screen pl-7 pr-7 pt-20 pb-5">
				<h1 className="text-3xl">{workout.name}</h1>
			</div>
			<div className="w-screen pl-7 pr-7 flex flex-col gap-3 overflow-y-scroll">
				{workout &&
					Object.entries(workout.exercises).map((exercise, i) =>
						active === exercise[0] ? (
							<div
								className={
									"w-full min-h-32 rounded-lg bg-[var(--accent)] flex flex-col"
								}
								key={i}
								onClick={() => handleExerciseClick(exercise)}
							>
								<div className="w-full flex flex-row items-center mt-1">
									<div className="w-7/12">
										<p className="pl-5 font-extralight">
											Exercise
										</p>
									</div>
									<div className="w-2/12 font-extralight text-center">
										<p>Sets</p>
									</div>
									<div className="pr-5 w-3/12 font-extralight text-center">
										<p>Reps</p>
									</div>
								</div>
								<div className="w-full flex flex-row items-center mb-2">
									<div className="w-7/12">
										<p className="w-full pl-5">
											{exercise[1].name}
										</p>
									</div>
									<div className="w-2/12 h- full text-center">
										<p>{exercise[1].sets}</p>
									</div>
									<div className="w-3/12 text-center pr-5">
										<p>{exercise[1].reps}</p>
									</div>
								</div>
								{/* <div className="w-full flex flex-row items-center justify-center mt-1">
									<div className="w-3/12 font-extralight text-center">
										<p>Set 1</p>
									</div>
									<div className="w-3/12 font-extralight text-center">
										<p>Set 2</p>
									</div>
									<div className="w-3/12 font-extralight text-center">
										<p>Set 3</p>
									</div>
								</div>
								<div className="w-full flex flex-row items-center justify-center text-xl pb-2">
									<div className="w-3/12 text-center">
										<p>20kg</p>
									</div>
									<div className="w-3/12 text-center">
										<p>22.5kg</p>
									</div>
									<div className="w-3/12 text-center">
										<p>25kg</p>
									</div>
								</div> */}
							</div>
						) : (
							<div
								className={
									"w-full h-20 rounded-lg bg-[var(--secondary-button)] flex flex-row items-center"
								}
								key={i}
								onClick={() => setActive(exercise[0])}
							>
								<div className="w-4/6">
									<p className="w-full pl-5">
										{exercise[1].name}
									</p>
								</div>
								<div className="w-2/12 text-center">
									<p>{exercise[1].sets}</p>
								</div>
								<div className="w-3/12 text-center pr-5">
									<p>{exercise[1].reps}</p>
								</div>
							</div>
						)
					)}
			</div>
		</main>
	);
}
