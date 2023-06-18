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
import Workout from "@/app/interfaces/Workout";

export default function Workout({ params }: any) {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState<boolean>(true);
	const [workout, setWorkout] = useState<Workout>();
	const [active, setActive] = useState<string>();
	const [checked, setChecked] = useState([]);
	const [progress, setProgress] = useState(null);
	const [weightSubmit, setWeightSubmit] = useState<boolean>(false);
	const [timer, setTimer] = useState(null);
	const [uncheckModalOpen, setUncheckModalOpen] = useState<boolean>(false);
	const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);
	const [stopModalOpen, setStopModalOpen] = useState<boolean>(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) return router.push("/");
			setUser(user);
			get(ref(db, `userWorkouts/${user.uid}/${params.workoutId}`))
				.then((snapshot) => {
					if (!snapshot.exists())
						return toast.error("Whoops! Something went wrong.");

					setWorkout(snapshot.val());
					setActive(Object.keys(snapshot.val().exercises)[0]);

					// If there is no tempProgress cookie, return
					if (!Cookies.get("tempProgress")) {
						setProgress(null);
					} else {
						// Get the tempProgress cookie, parse to JSON
						let tempProgress = JSON.parse(
							Cookies.get("tempProgress")
						);

						if (tempProgress.workoutId === params.workoutId) {
							setProgress(tempProgress);
							Object.entries(tempProgress.progress).forEach(
								(item: any) => {
									// Check the exercise visually
									let checkedList = checked;
									checkedList.push(parseInt(item[0]));
									setChecked(checkedList);
								}
							);
						}
					}

					setInitializing(false);
				})
				.catch((error) => {
					toast.error("Whoops! Something went wrong.");
					console.error(error);
				});
		});
	}, [params.workoutId, router, checked]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!progress) return;
			setTimer(
				new Date((progress.startDate - Date.now()) * -1)
					.toISOString()
					.substring(12, 19)
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [progress]);

	return initializing ? (
		<Loading />
	) : (
		<main className="min-h-screen max-h-fit w-screen flex flex-col items-center bg-[var(--secondary)] pb-24">
			<BackArrow />

			{/* Modals */}
			<ConfirmModal
				onConfirm={() => {
					setUncheckModalOpen(false);

					// Uncheck the exercise visually
					let checkedList = checked;
					checkedList = checkedList.filter(
						(item) => item !== parseInt(active)
					);
					setChecked(checkedList);

					// If there is no tempProgress cookie, return
					if (!Cookies.get("tempProgress")) return;

					// Get the tempProgress cookie, parse to JSON
					let tempProgress = JSON.parse(Cookies.get("tempProgress"));

					// Delete the obj path
					delete tempProgress.progress[active];

					// If there is no progress left for this workout, remove the cookie
					if (Object.keys(tempProgress.progress).length === 0) {
						Cookies.remove("tempProgress");
						return setProgress(null);
					}

					Cookies.set("tempProgress", JSON.stringify(tempProgress), {
						expires: 1,
					});
				}}
				open={uncheckModalOpen}
				setOpen={setUncheckModalOpen}
				prompt="Uncheck this exercise?"
				subPrompt="This will remove the tracked progress for this exercise."
			/>
			<ConfirmModal
				onConfirm={() => {
					setInitializing(true);
					setCompleteModalOpen(false);
					// set endDate to current
					let saveProgress = progress;
					saveProgress.endDate = Date.now();

					// remove unnecessary data
					delete saveProgress.workoutId;

					// save progress to db
					set(
						ref(
							db,
							`userProgress/${user.uid}/${params.workoutId}/progress/${progress.startDate}`
						),
						saveProgress
					).then(() => {
						toast.success("Workout completed, well done!");
					});

					// delete cookie
					Cookies.remove("tempProgress");
					router.push("/");
				}}
				open={completeModalOpen}
				setOpen={setCompleteModalOpen}
				prompt="Complete the workout?"
				subPrompt="This will save your progress, weights and time used."
			/>
			<ConfirmModal
				onConfirm={() => {
					setStopModalOpen(false);
					Cookies.remove("tempProgress");
					router.push("/");
				}}
				open={stopModalOpen}
				setOpen={setStopModalOpen}
				prompt="Stop and discard the workout?"
				subPrompt="This will NOT save your progress. Progress will be removed and it can't be recovered!"
			/>
			<WeightInputModal
				open={weightSubmit}
				setOpen={setWeightSubmit}
				active={active}
				workout={workout}
				onSubmit={(weights) => {
					// if there is no tempProgress cookie, create one
					if (!Cookies.get("tempProgress")) {
						const data = {
							startDate: Date.now(),
							workoutId: params.workoutId,
							progress: {},
						};
						Cookies.set("tempProgress", JSON.stringify(data), {
							expires: 1,
						});
					}

					// Get the tempProgress cookie, parse to JSON
					let tempProgress = JSON.parse(Cookies.get("tempProgress"));

					// Set the progress for the active exercise to cookie
					tempProgress.progress[active] = weights;
					Cookies.set("tempProgress", JSON.stringify(tempProgress), {
						expires: 1,
					});
					setProgress(tempProgress);

					// Check the exercise visually
					let checkedList = checked;
					checkedList.push(parseInt(active));
					setChecked(checkedList);

					// Set the next exercise as active
					let activeInt = parseInt(active) + 1;
					setActive(activeInt.toString());
				}}
			/>

			{/* Title */}
			<div className="w-screen pl-7 pr-7 pt-20 pb-5">
				<h1 className="text-3xl">{workout.name}</h1>
				{progress != null && <h1 className="text-xl">{timer}</h1>}
			</div>

			{/* Workout list */}
			<div className="w-screen pl-7 pr-7 flex flex-col gap-3 overflow-y-scroll">
				{workout &&
					Object.entries(workout.exercises).map((exercise, i) =>
						checked.includes(i, 0) ? (
							<CheckedWorkoutCard
								key={i}
								setActive={setActive}
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
			<div className="w-screen pl-7 pr-7 flex row gap-3 fixed bottom-3">
				{progress != null && (
					<>
						<button
							className="bg-[var(--warning)] h-16 text-lg w-full flex items-center justify-evenly rounded drop-shadow-2xl"
							onClick={() => setStopModalOpen(true)}
						>
							Stop
						</button>
						<button
							className="bg-[var(--primary-button)] h-16 text-lg w-full flex items-center justify-evenly rounded drop-shadow-2xl"
							onClick={() => setCompleteModalOpen(true)}
						>
							Complete
						</button>
					</>
				)}
			</div>
		</main>
	);
}
