"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../libs/firebase";
import Navbar from "../components/Navbar";
import { get, ref } from "firebase/database";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Loading from "../loading";
import Pr from "../interfaces/Pr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Workout from "../interfaces/Workout";
export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState(true);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [pr, setPr] = useState<Pr>();
	const [workout, setWorkout] = useState<Workout>();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) return router.push("/auth");

			setUser(user);

			setInitializing(false);

			get(ref(db, `userPr/${user.uid}`))
				.then((snapshot) => {
					if (snapshot.exists()) {
						setPr(snapshot.val());
					}
				})
				.catch((error) => {
					toast.error("Whoops! Something went wrong.");
					console.error(error);
				});

			get(ref(db, `userWorkouts/${user.uid}`))
				.then((snapshot) => {
					if (snapshot.exists()) {
						setWorkout(snapshot.val());
					}
				})
				.catch((error) => {
					toast.error("Whoops! Something went wrong.");
					console.error(error);
				});

			setInitializing(false);
		});
	}, [router]);

	return initializing ? (
		<Loading />
	) : (
		<main className="flex h-screen w-screen flex-col items-center bg-[var(--secondary)]">
			{/* Header */}
			<div className="w-screen pl-7 pr-7 pt-20">
				<h1 className="text-3xl">Your Progress</h1>
			</div>

			{/* PRs */}
			<div className="w-screen pl-7 pr-7 pt-5 pb-3">
				<h1 className="text-xl">PR&apos;s</h1>
				<div className="w-full h-[calc(50vw-2.125rem)] max-h-[calc(((50vw-2.125rem)*2)+0.75rem)] flex content-start flex-wrap gap-3 overflow-y-scroll pb-36">
					{(editMode || !pr) && (
						<Link
							className="w-[calc(50%-0.375rem)] h-[calc(50vw-2.125rem)]"
							href={"/progress/addpr"}
						>
							<div
								className="w-full h-full rounded-lg bg-[var(--secondary-button)] flex flex-col items-center justify-evenly"
								onContextMenu={(e) => {
									e.preventDefault();
									setEditMode((value) => !value);
								}}
							>
								<FontAwesomeIcon icon={faPlus} size="2x" />
							</div>
						</Link>
					)}
					{pr &&
						Object.entries(pr).map((pr, i) => (
							<Link
								key={i}
								className="w-[calc(50%-0.375rem)] h-[calc(50vw-2.125rem)]"
								href={""}
							>
								<div
									className={
										"w-full h-full rounded-lg bg-[var(--secondary-button)] flex flex-col items-center justify-evenly"
									}
									onContextMenu={(e) => {
										e.preventDefault();
										setEditMode((value) => !value);
									}}
								>
									<p className="text-5xl">{pr[1].icon}</p>
									<h1 className="text-lg text-center">
										{pr[1].name}
									</h1>
								</div>
							</Link>
						))}
				</div>
			</div>

			{/* Workouts */}
			<div className="w-screen pl-7 pb-3">
				<h1 className="text-xl">Workouts</h1>
				<div className="w-full h-[calc(50vw-2.125rem)] flex gap-3 overflow-x-auto pb-36">
					{!workout && (
						<p className="text-sm text-[var(--secondary-button)]">
							You have no workouts. Create one from your home
							screen!
						</p>
					)}
					{workout &&
						Object.entries(workout).map((workout, i) => (
							<Link
								key={i}
								className="w-[calc(50%-1.25rem)] h-[calc(50vw-2.125rem)] shrink-0"
								href={""}
							>
								<div
									className={
										"w-full h-full rounded-lg bg-[var(--secondary-button)] flex flex-col items-center justify-evenly"
									}
									onContextMenu={(e) => {
										e.preventDefault();
										setEditMode((value) => !value);
									}}
								>
									<p className="text-5xl">
										{workout[1].icon}
									</p>
									<h1 className="text-lg text-center">
										{workout[1].name}
									</h1>
								</div>
							</Link>
						))}
				</div>
			</div>

			<Navbar user={user} />
		</main>
	);
}
