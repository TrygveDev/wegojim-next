"use client";

import BackArrow from "@/app/components/BackArrow";
import { auth, db } from "@/app/libs/firebase";
import Loading from "@/app/loading";
import { User, onAuthStateChanged } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import WorkoutCard from "../WorkoutCard";
import ActiveWorkoutCard from "./ActiveWorkoutCard";
import WeightInputModal from "@/app/workout/[workoutId]/WeightInputModal";
import Cookies from "js-cookie";
import CheckedWorkoutCard from "./ChekedWorkoutCard";
import ConfirmModal from "@/app/components/ConfirmModal";

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
	const [checked, setChecked] = useState([]);
	const [weightSubmit, setWeightSubmit] = useState<boolean>(false);
	const [uncheckModalOpen, setUncheckModalOpen] = useState<boolean>(false);

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

			{/* Modals */}
			<ConfirmModal
				onConfirm={() => {
					setUncheckModalOpen(false);
					let checkedList = checked;
					checkedList = checkedList.filter(
						(item) => item !== parseInt(active)
					);
					setChecked(checkedList);
					console.log(checkedList);
				}}
				open={uncheckModalOpen}
				setOpen={setUncheckModalOpen}
				prompt="Uncheck this exercise?"
				subPrompt="This will remove the tracked progress for this exercise."
			/>
			<WeightInputModal
				open={weightSubmit}
				setOpen={setWeightSubmit}
				active={active}
				workout={workout}
				onSubmit={(weights) => {
					if (!Cookies.get("tempProgress")) {
						const data = {
							date: Date.now(),
							workoutId: params.workoutId,
							progress: {},
						};
						Cookies.set("tempProgress", JSON.stringify(data), {
							expires: 1,
						});
					}

					let tempProgress = JSON.parse(Cookies.get("tempProgress"));
					tempProgress.progress[active] = weights;
					Cookies.set("tempProgress", JSON.stringify(tempProgress), {
						expires: 1,
					});

					// set(
					// 	ref(
					// 		db,
					// 		`userProgress/${user.uid}/${
					// 			params.workoutId
					// 		}/progress/${Date.now()}/${active}/`
					// 	),
					// 	{
					// 		name: workout.exercises[active].name,
					// 		weight: weights,
					// 	}
					// )
					// 	.then(() => {
					// 		toast.success("Progress tracked!");
					// 	})
					// 	.catch((error) => {
					// 		toast.error("Whoops! Something went wrong.");
					// 		console.error(error);
					// 	});
					console.log(weights);
				}}
			/>

			{/* Title */}
			<div className="w-screen pl-7 pr-7 pt-20 pb-5">
				<h1 className="text-3xl">{workout.name}</h1>
			</div>

			{/* Workout list */}
			<div className="w-screen pl-7 pr-7 flex flex-col gap-3 overflow-y-scroll">
				{workout &&
					Object.entries(workout.exercises).map((exercise, i) =>
						checked.includes(i, 0) ? (
							<CheckedWorkoutCard
								key={i}
								exercise={exercise}
								setUncheckModalOpen={setUncheckModalOpen}
							/>
						) : active === exercise[0] ? (
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
