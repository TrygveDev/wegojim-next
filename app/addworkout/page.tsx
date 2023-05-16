"use client";

import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../libs/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCloudDownload,
	faDeleteLeft,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import BackArrow from "../components/BackArrow";
import EmojiPicker from "emoji-picker-react";
import { child, get, push, ref, set } from "firebase/database";
import { toast } from "react-hot-toast";
import InputModal from "../components/InputModal";

type Exercise = {
	name: string;
	sets: string | number;
	reps: string | number;
};

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState(true);
	const [showEmoijiPicker, setShowEmojiPicker] = useState(false);
	const [emoji, setEmoji] = useState<any>("");
	const [title, setTitle] = useState("");
	const [openShare, setOpenShare] = useState(false);
	const [exercises, setExercises] = useState<Exercise[]>([
		{
			name: "",
			sets: "",
			reps: "",
		},
	]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				setInitializing(false);
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
			<BackArrow
				confirm
				confirmPrompt="Go back?"
				confirmSubPropmt="Changes will not be saved!"
			/>
			{showEmoijiPicker && (
				<div className="absolute w-screen h-screen flex justify-center items-center bg-black bg-opacity-75 z-40">
					<EmojiPicker
						searchDisabled={true}
						onEmojiClick={(e) => {
							setShowEmojiPicker(false);
							setEmoji(e.emoji);
						}}
					/>
				</div>
			)}
			<div className="absolute w-screen h-screen flex justify-end items-start pointer-events-none">
				<div className="p-7 pointer-events-auto flex gap-3">
					<FontAwesomeIcon
						icon={faCloudDownload}
						size="2xl"
						color="#FFFFFF"
						onClick={() => {
							setOpenShare(true);
						}}
					/>
				</div>
			</div>
			<InputModal
				open={openShare}
				setOpen={setOpenShare}
				prompt="Import a workout!"
				subPrompt="Enter a share id down below to copy a workout."
				onConfirm={(input) => {
					const shareId = input.split(":")[0];
					const sharedWorkoutId = input.split(":")[1];
					get(ref(db, `sharedWorkouts/${shareId}/${sharedWorkoutId}`))
						.then((snapshot) => {
							if (snapshot.exists()) {
								setExercises(snapshot.val().exercises);
								setTitle(snapshot.val().name);
								setEmoji(snapshot.val().icon);
								toast.success("Workout imported!");
								setInitializing(false);
							} else {
								toast.error("Whoops! Something went wrong.");
								setInitializing(false);
							}
						})
						.catch((error) => {
							toast.error("Whoops! Something went wrong.");
							console.error(error);
						})
						.finally(() => setLoading(false));
					setOpenShare(false);
				}}
				placeholder="Share ID"
				type="text"
			/>
			<div className="absolute w-screen h-screen flex items-end justify-center pointer-events-none">
				<div className="mb-7 w-32 h-14">
					<Button
						variant="contained"
						color="success"
						disabled={loading}
						sx={{
							width: "100%",
							height: "100%",
							fontSize: "1.1rem",
							pointerEvents: "auto",
						}}
						onClick={() => {
							setLoading(true);
							const filteredExercises = exercises.filter(
								(e) => e.name.length > 0
							);
							if (
								title.length == 0 ||
								emoji.length == 0 ||
								filteredExercises.length == 0
							) {
								setLoading(false);
								return toast.error(
									"Please give the workout a title, emoji, and at least one exercise."
								);
							}

							const uidkey = push(
								child(ref(db), `${user.uid}/workouts`)
							).key;
							set(ref(db, `${user.uid}/workouts/${uidkey}`), {
								name: title,
								icon: emoji,
								exercises: filteredExercises,
							})
								.then(() => {
									toast.success("Workout saved!");
									setLoading(false);
									router.back();
								})
								.catch((error) => {
									setLoading(false);
									toast.error(
										"Whoops! Something went wrong."
									);
									console.error(error);
								});
						}}
					>
						Save
					</Button>
				</div>
			</div>
			<div className="w-screen pl-7 pr-7 pt-24 pb-5 flex flex-col">
				<input
					type="text"
					className="h-12 text-4xl text-white bg-transparent min-w-28 focus:outline-none"
					placeholder="Name"
					defaultValue={title}
					maxLength={17}
					onChange={(e) => setTitle(e.target.value)}
				></input>
				<input
					type="text"
					className="text-xl text-white bg-transparent w-14 focus:outline-none"
					placeholder="Emoji"
					defaultValue={emoji}
					maxLength={0}
					onFocus={(e) => {
						e.preventDefault();
						setShowEmojiPicker(true);
					}}
					onClick={(e) => e.preventDefault()}
				></input>
			</div>

			<div className="w-screen pl-7 pr-7 flex flex-col gap-3 overflow-y-scroll">
				{exercises.length > 0
					? exercises.map((workout: any, i: number) => {
							return (
								<div key={i} className="flex items-center">
									<div
										className={
											"w-full h-20 rounded-lg bg-[#1E1E1E] flex flex-row items-center"
										}
									>
										<div className="w-7/12 pl-5">
											<input
												className="text-lg w-full bg-transparent focus:outline-none"
												maxLength={25}
												value={workout.name}
												placeholder="Exercise"
												onChange={(e: any) => {
													const newList = [
														...exercises,
													];
													newList[i].name =
														e.target.value;
													setExercises(newList);
												}}
											></input>
										</div>
										<div className="w-2/12 text-center">
											<input
												className="bg-transparent focus:outline-none w-full text-center"
												placeholder="Sets"
												value={workout.sets}
												maxLength={2}
												onChange={(e: any) => {
													const newList = [
														...exercises,
													];
													newList[i].sets =
														e.target.value;
													setExercises(newList);
												}}
											></input>
										</div>
										<div className="w-2/6 text-center">
											<input
												className="bg-transparent focus:outline-none w-full text-center"
												placeholder="Reps"
												value={workout.reps}
												maxLength={5}
												type="text"
												onChange={(e: any) => {
													const newList = [
														...exercises,
													];
													newList[i].reps =
														e.target.value;
													setExercises(newList);
												}}
											></input>
										</div>
									</div>
									<div
										className="pl-1"
										onClick={() => {
											setExercises((value) =>
												value.filter((_, index) => {
													return index !== i;
												})
											);
										}}
									>
										<FontAwesomeIcon
											icon={faDeleteLeft}
											color="#C73C3C"
											size="xl"
										/>
									</div>
								</div>
							);
					  })
					: null}
				<div
					className="flex gap-2 items-center mb-10 w-36"
					onClick={() => {
						setExercises((value) => [
							...value,
							{ name: "", sets: "", reps: "" },
						]);
					}}
				>
					<FontAwesomeIcon icon={faPlus} color="white" />
					<p>add exercise</p>
				</div>
			</div>
		</main>
	);
}
