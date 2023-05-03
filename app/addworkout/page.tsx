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
	faMagnifyingGlass,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import BackArrow from "../components/BackArrow";
import EmojiPicker from "emoji-picker-react";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState(true);
	const [showEmoijiPicker, setShowEmojiPicker] = useState(false);
	const [emoji, setEmoji] = useState<any>();

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
			<BackArrow />
			{showEmoijiPicker && (
				<div className="absolute w-screen h-screen flex justify-center items-center bg-black bg-opacity-75">
					<EmojiPicker
						onEmojiClick={(e) => {
							setShowEmojiPicker(false);
							setEmoji(e.emoji);
						}}
					/>
				</div>
			)}
			<div className="w-screen pl-7 pr-7 pt-24 pb-5 flex flex-col">
				<input
					type="text"
					className="text-4xl text-white bg-transparent min-w-28 focus:outline-none"
					placeholder="Name"
					maxLength={17}
				></input>
				<input
					type="text"
					className="text-xl text-white bg-transparent w-14 focus:outline-none"
					placeholder="Emoji"
					value={emoji}
					onFocus={(e) => {
						e.preventDefault();
						setShowEmojiPicker(true);
					}}
					onClick={(e) => e.preventDefault()}
				></input>
			</div>
		</main>
	);
}
