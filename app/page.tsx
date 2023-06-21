"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./libs/firebase";
import Navbar from "./components/Navbar";
import { get, ref } from "firebase/database";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircle,
	faEllipsisV,
	faMagnifyingGlass,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Loading from "./loading";
import Cookies from "js-cookie";
import Workout from "./interfaces/Workout";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState(true);
	const [workouts, setWorkouts] = useState<Workout>();
	const [editMode, setEditMode] = useState(false);
	const [workingOut, setWorkingOut] = useState(null);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) return router.push("/auth");

			setUser(user);

			if (!user.emailVerified) {
				toast.error(
					"Please verify your email address! Send a verfication email from the settings."
				);
			}

			get(ref(db, `userWorkouts/${user.uid}`))
				.then((snapshot) => {
					if (snapshot.exists()) {
						setWorkouts(snapshot.val());
					}

					if (Cookies.get("tempProgress")) {
						let tempProgress = JSON.parse(
							Cookies.get("tempProgress")
						);
						setWorkingOut(tempProgress.workoutId);
					}

					setInitializing(false);
				})
				.catch((error) => {
					toast.error("Whoops! Something went wrong.");
					console.error(error);
				});
		});
	}, [router]);

	return initializing ? (
		<Loading />
	) : (
		<main className="flex h-screen w-screen flex-col items-center bg-[var(--secondary)]">
			{/* Header */}
			<div className="w-screen pl-7 pr-7 pt-20">
				<h1 className="text-3xl">Start a workout</h1>
			</div>

			{/* Search */}
			<div className="w-screen pl-7 pr-7 pt-5 pb-3 flex gap-1">
				<div className="flex items-center gap-2 bg-[var(--secondary-button)] p-3 rounded-2xl text-lg w-full">
					<FontAwesomeIcon icon={faMagnifyingGlass} size="1x" />
					<input
						className="bg-transparent w-full focus:outline-none"
						placeholder="Search workouts"
						onChange={(e) => {}}
					></input>
				</div>
				<div
					className="flex items-center justify-center p-2"
					onClick={() => {
						if (workingOut)
							return toast.error(
								"Finish your active workout before editing your workouts!",
								{ duration: 4000 }
							);
						setEditMode((value) => !value);
					}}
				>
					<FontAwesomeIcon icon={faEllipsisV} size="xl" />
				</div>
			</div>

			{/* Workouts */}
			<div className="w-screen h-screen pl-7 pr-7 flex content-start flex-wrap gap-3 overflow-y-scroll pb-36">
				{(editMode || !workouts) && (
					<div
						className="w-[calc(50%-0.375rem)] h-[calc(50vw-2.125rem)] rounded-lg flex flex-col items-center justify-center"
						onClick={() => {
							router.push(`/addworkout`);
						}}
						onContextMenu={() => {
							if (workingOut)
								return toast.error(
									"Finish your active workout before editing your workouts!",
									{ duration: 4000 }
								);
							setEditMode((value) => !value);
						}}
					>
						<FontAwesomeIcon icon={faPlus} size="2x" />
					</div>
				)}
				{workouts &&
					Object.entries(workouts).map((workout, i) => (
						<Link
							key={i}
							className="w-[calc(50%-0.375rem)] h-[calc(50vw-2.125rem)]"
							onClick={() => {
								if (workingOut !== workout[0] && workingOut) {
									toast.error(
										"Finish your active workout before starting a new one!",
										{ duration: 4000 }
									);
								}
							}}
							href={
								workingOut !== workout[0] && workingOut
									? `/`
									: editMode
									? `/editworkout/${workout[0]}`
									: `/workout/${workout[0]}`
							}
						>
							<div
								className={`w-full h-full rounded-lg bg-[var(--secondary-button)] flex flex-col items-center justify-evenly ${
									editMode && "wegojim-edit"
								}
							`}
								onContextMenu={(e) => {
									e.preventDefault();
									if (workingOut)
										return toast.error(
											"Finish your active workout before editing your workouts!",
											{ duration: 4000 }
										);

									setEditMode((value) => !value);
								}}
							>
								{workingOut === workout[0] && (
									<div className="flex items-center gap-1 h-4 w-full pl-2">
										<FontAwesomeIcon
											icon={faCircle}
											size="xs"
											color="var(--primary-button)"
										/>
										<p className="text-xs">Active</p>
									</div>
								)}
								<p className="text-5xl">{workout[1].icon}</p>
								<h1 className="text-lg text-center">
									{workout[1].name}
								</h1>
							</div>
						</Link>
					))}
			</div>
			<Navbar user={user} />
		</main>
	);
}
