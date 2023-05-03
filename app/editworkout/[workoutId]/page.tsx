"use client";

import BackArrow from "@/app/components/BackArrow";
import ConfirmModal from "@/app/components/ConfirmModal";
import { auth, db } from "@/app/libs/firebase";
import {
	faDeleteLeft,
	faPlus,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { User, onAuthStateChanged } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Exercise = {
	name: string;
	sets: string | number;
	reps: string | number;
};

export default function Workout({ params }: any) {
	const router = useRouter();
	const [initializing, setInitializing] = useState(true);
	const [exercises, setExercises] = useState<Exercise[]>();
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [emoji, setEmoji] = useState<any>("");
	const [title, setTitle] = useState("");
	const [user, setUser] = useState<User>();
	const [openDelete, setOpenDelete] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				get(ref(db, `${user.uid}/workouts/${params.workoutId}`))
					.then((snapshot) => {
						if (snapshot.exists()) {
							setExercises(snapshot.val().exercises);
							setTitle(snapshot.val().name);
							setEmoji(snapshot.val().icon);
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
			{showEmojiPicker && (
				<div className="absolute w-screen h-screen flex justify-center items-center bg-black bg-opacity-75 z-40">
					<EmojiPicker
						onEmojiClick={(e) => {
							setShowEmojiPicker(false);
							setEmoji(e.emoji);
						}}
					/>
				</div>
			)}
			<div className="absolute w-screen h-screen flex justify-end items-start pointer-events-none">
				<div className="p-10 pointer-events-auto">
					<FontAwesomeIcon
						icon={faTrashAlt}
						size="2xl"
						color="#C73C3C"
						onClick={() => {
							setOpenDelete(true);
						}}
					/>
				</div>
			</div>
			<ConfirmModal
				open={openDelete}
				setOpen={setOpenDelete}
				prompt="Are you sure you want to delete this workout?"
				subPrompt="This action cannot be undone!"
				onConfirm={() => {
					set(
						ref(db, `${user.uid}/workouts/${params.workoutId}`),
						null
					)
						.then(() => {
							toast.success("Workout deleted!");
							router.back();
						})
						.catch((error) => {
							toast.error("Whoops! Something went wrong.");
							console.error(error);
						});
				}}
			/>
			<div className="absolute w-screen h-screen flex items-end justify-center pointer-events-none">
				<div className="mb-7 w-32 h-14">
					<Button
						variant="contained"
						color="success"
						sx={{
							width: "100%",
							height: "100%",
							fontSize: "1.1rem",
							pointerEvents: "auto",
						}}
						onClick={() => {
							if (
								title.length == 0 ||
								emoji.length == 0 ||
								exercises.length == 0
							) {
								return toast.error(
									"Please fill out all fields!"
								);
							}

							set(
								ref(
									db,
									`${user.uid}/workouts/${params.workoutId}`
								),
								{
									name: title,
									icon: emoji,
									exercises: exercises,
								}
							)
								.then(() => {
									toast.success("Workout saved!");
									router.back();
								})
								.catch((error) => {
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
					maxLength={17}
					defaultValue={title}
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
										<div className="w-4/6">
											<input
												className="text-lg w-full p-5 bg-transparent focus:outline-none"
												maxLength={25}
												value={workout.name}
												placeholder="Exercise name"
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
										<div className="w-2/12 text-center p-2">
											<input
												className="bg-transparent focus:outline-none w-full text-center"
												placeholder="0"
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
										<div className="w-3/12 text-center p-2">
											<input
												className="bg-transparent focus:outline-none w-full text-center"
												placeholder="0"
												// defaultChecked={workout.reps}
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
										className="pl-4"
										onClick={() => {
											console.log(i);
											setExercises((value) =>
												value.filter((_, index) => {
													console.log(index, i);
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
					className="flex gap-2 items-center mb-28 w-36"
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
