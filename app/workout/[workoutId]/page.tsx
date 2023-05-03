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
		console.log(exercise);
		toast.success("Exercise completed! " + exercise[1].name);
	};

	return initializing ? (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-[#141414]">
			<CircularProgress />
		</div>
	) : (
		<main className="flex h-screen w-screen flex-col items-center bg-[#141414]">
			<BackArrow />
			<div className="w-screen pl-7 pr-7 pt-24 pb-5">
				<h1 className="text-4xl text-white">{workout.name}</h1>
			</div>
			<div className="w-screen pl-7 pr-7 flex flex-col gap-3 overflow-y-scroll">
				{workout &&
					Object.entries(workout.exercises).map((exercise, i) =>
						active === exercise[0] ? (
							<div
								className={
									"w-full h-32 rounded-lg bg-[#4CAF50] flex flex-col"
								}
								key={i}
								onClick={() => handleExerciseClick(exercise)}
							>
								<div className="w-full flex flex-row h-5 items-center mt-2 mb-1">
									<div className="w-4/6">
										<p className="pl-5 font-extralight">
											Exercise
										</p>
									</div>
									<div className="w-2/12 font-extralight text-center">
										<p>Sets</p>
									</div>
									<div className="w-3/12 font-extralight text-center">
										<p>Reps</p>
									</div>
								</div>
								<div className="w-full flex flex-row h-5 items-center">
									<div className="w-4/6">
										<h1 className="text-xl w-full pl-5">
											{exercise[1].name}
										</h1>
									</div>
									<div className="w-2/12 text-xl text-center">
										<p>{exercise[1].sets}</p>
									</div>
									<div className="w-3/12 text-xl text-center">
										<p>{exercise[1].reps}</p>
									</div>
								</div>
								<div className="w-full flex flex-row h-5 items-center justify-center mt-3">
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
								<div className="w-full flex flex-row h-5 items-center justify-center text-xl">
									<div className="w-3/12 text-center">
										<p>20kg</p>
									</div>
									<div className="w-3/12 text-center">
										<p>22.5kg</p>
									</div>
									<div className="w-3/12 text-center">
										<p>25kg</p>
									</div>
								</div>
							</div>
						) : (
							<div
								className={
									"w-full h-20 rounded-lg bg-[#1E1E1E] flex flex-row items-center"
								}
								key={i}
								onClick={() => setActive(exercise[0])}
							>
								<div className="w-4/6">
									<h1 className="text-lg w-full p-5">
										{exercise[1].name}
									</h1>
								</div>
								<div className="w-2/12 text-center p-2">
									<p>{exercise[1].sets}</p>
								</div>
								<div className="w-3/12 text-center p-2">
									<p>{exercise[1].reps}</p>
								</div>
							</div>
						)
					)}
			</div>
		</main>
	);
}
