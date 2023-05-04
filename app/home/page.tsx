"use client";

// const uidkey = push(child(ref(db), `${user.uid}/workouts`)).key;
// set(ref(db, `${user.uid}/workouts/${uidkey}`), {})
// 	.then(() => {
// 		// Data saved successfully!
// 	})
// 	.catch((error) => {
// 		// The write failed...
// 	});

import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../libs/firebase";
import Navbar from "../components/Navbar";
import { get, ref } from "firebase/database";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faFileEdit,
	faMagnifyingGlass,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState(true);
	const [workouts, setWorkouts] = useState<Workout>();
	const [editMode, setEditMode] = useState(false);

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

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);

				get(ref(db, `${user.uid}/workouts`))
					.then((snapshot) => {
						if (snapshot.exists()) {
							setWorkouts(snapshot.val());
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
	}, [router]);

	return initializing ? (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-[#141414]">
			<CircularProgress />
		</div>
	) : (
		<main className="flex h-screen w-screen flex-col items-center bg-[#141414]">
			<div className="w-screen pl-7 pr-7 pt-24">
				<h1 className="text-4xl text-white">Start a workout</h1>
			</div>
			<div className="w-screen pl-7 pr-7 pt-5 pb-3 flex gap-1">
				<div className="flex items-center gap-2 bg-[#1E1E1E] p-3 rounded-2xl text-lg w-full">
					<FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
					<input
						className="bg-transparent w-full focus:outline-none"
						placeholder="Search workouts"
						onChange={(e) => {}}
					></input>
				</div>
				<div
					className={`w-1/6 h-14 flex items-center justify-center bg-[#1E1E1E] p-3 rounded-2xl text-lg ${
						editMode && "bg-[#252525]"
					}`}
					onClick={() => setEditMode((value) => !value)}
				>
					<FontAwesomeIcon icon={faEdit} size="xl" />
				</div>
			</div>
			<div className="w-screen pl-7 pr-7 flex flex-wrap gap-3 overflow-y-scroll pb-36">
				{(editMode || !workouts) && (
					<div
						className="w-40 h-40 rounded-lg bg-[#1E1E1E] flex flex-col items-center justify-center"
						onClick={() => {
							router.push(`/addworkout`);
						}}
					>
						<FontAwesomeIcon icon={faPlus} size="2x" />
					</div>
				)}
				{workouts &&
					Object.entries(workouts).map((workout, i) => (
						<div
							className={`w-[calc(50%-0.375rem)] h-40 rounded-lg bg-[#1E1E1E] flex flex-col items-center justify-center ${
								editMode && "wegojim-edit"
							}`}
							key={i}
							onClick={() => {
								editMode
									? router.push(`/editworkout/${workout[0]}`)
									: router.push(`/workout/${workout[0]}`);
							}}
						>
							<p className="text-5xl pb-5">{workout[1].icon}</p>
							<h1 className="text-lg text-center">
								{workout[1].name}
							</h1>
						</div>
					))}
			</div>
			<Navbar />
		</main>
	);
}
