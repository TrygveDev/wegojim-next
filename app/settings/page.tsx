"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	User,
	onAuthStateChanged,
	sendEmailVerification,
	sendPasswordResetEmail,
	signOut,
} from "firebase/auth";
import { auth } from "../libs/firebase";
import BackArrow from "../components/BackArrow";
import Image from "next/image";
import wave from "@/public/images/wavelight.png";
import { Avatar, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngleRight,
	faComments,
	faEdit,
	faEnvelope,
	faLock,
	faSignOutAlt,
	faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

export default function Settings() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [signOutModal, setSignOutModal] = useState(false);
	const [resetPasswordModal, setResetPasswordModal] = useState(false);
	const [initializing, setInitializing] = useState(true);

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
			<ConfirmModal
				prompt="Sign out?"
				open={signOutModal}
				setOpen={setSignOutModal}
				onConfirm={() => {
					signOut(auth).then(() => {
						toast.success("Signed out!");
						router.push("/");
					});
				}}
			/>
			<ConfirmModal
				prompt="Do you wannt to send a password reset mail?"
				open={resetPasswordModal}
				setOpen={setResetPasswordModal}
				onConfirm={() => {
					sendPasswordResetEmail(auth, user.email)
						.then(() => toast.success("Password reset email sent!"))
						.catch(() => toast.error("Something went wrong!"));
				}}
			/>
			<BackArrow />
			<Image src={wave} alt="" className="w-screen absolute top-80" />

			{/* Avatar */}
			<div className="pt-28 z-10 flex justify-end items-end">
				<Avatar
					src={user ? (user.photoURL ? user.photoURL : "") : ""}
					sx={{
						width: 108,
						height: 108,
						border: "3px solid #1E1E1E",
					}}
				/>
				<div className="bg-[#1E1E1E] w-7 h-7 rounded-full flex items-center justify-center absolute">
					<FontAwesomeIcon
						icon={faEdit}
						onClick={() => {
							const provider = user.providerData[0].providerId;
							if (provider != "password") {
								toast.error(
									`Your profile picture is your ${provider} profile picture. You can change it there.`
								);
							} else {
								toast.error(
									"This feature is not available yet!"
								);
							}
						}}
					/>
				</div>
			</div>
			{/* Userinfo */}
			<div className="z-10">
				<h1 className="text-center text-2xl pt-2 pb-1">
					{user && user.displayName}
				</h1>
				<p className="text-center font-thin">
					Joined{" "}
					{user && (
						<>
							{new Date(
								user.metadata.creationTime
							).toLocaleDateString()}
						</>
					)}
				</p>
			</div>

			<div className="z-10 w-screen flex flex-col items-center gap-2 pt-24">
				{!user.emailVerified && (
					<div
						className="flex flex-row justify-between w-5/6 h-16"
						onClick={() => {
							sendEmailVerification(user);
							toast.success("Verification email sent!");
						}}
					>
						<div className="h-full w-16 bg-[#141414] rounded-md flex items-center justify-center">
							<FontAwesomeIcon
								icon={faEnvelope}
								size="xl"
								color="#505050"
							/>
						</div>
						<div className="h-full w-52 flex items-center font-light pl-3">
							<p>Verify Email</p>
						</div>

						<div className="h-full flex items-center justify-center">
							<FontAwesomeIcon icon={faAngleRight} size="2xl" />
						</div>
					</div>
				)}

				<div
					className="flex flex-row justify-between w-5/6 h-16"
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
				>
					<div className="h-full w-16 bg-[#141414] rounded-md flex items-center justify-center">
						<FontAwesomeIcon
							icon={faEnvelope}
							size="xl"
							color="#505050"
						/>
					</div>
					<div className="h-full w-52 flex items-center font-light pl-3">
						<p>Change Email</p>
					</div>

					<div className="h-full flex items-center justify-center">
						<FontAwesomeIcon icon={faAngleRight} size="2xl" />
					</div>
				</div>

				<div
					className="flex flex-row justify-between w-5/6 h-16"
					onClick={() => setResetPasswordModal(true)}
				>
					<div className="h-full w-16 bg-[#141414] rounded-md flex items-center justify-center">
						<FontAwesomeIcon
							icon={faLock}
							size="xl"
							color="#505050"
						/>
					</div>
					<div className="h-full w-52 flex items-center font-light pl-3">
						<p>Change Password</p>
					</div>

					<div className="h-full flex items-center justify-center">
						<FontAwesomeIcon icon={faAngleRight} size="2xl" />
					</div>
				</div>
			</div>

			<div className="z-10 w-screen flex flex-col items-center pt-16 gap-2">
				<div
					className="flex flex-row justify-between w-5/6 h-16"
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
				>
					<div className="h-full w-16 bg-[#505050] rounded-md flex items-center justify-center">
						<FontAwesomeIcon
							icon={faUserPlus}
							size="xl"
							color="#141414"
						/>
					</div>
					<div className="h-full w-52 flex items-center font-light pl-3">
						<p>Invite a friend</p>
					</div>

					<div className="h-full flex items-center justify-center">
						<FontAwesomeIcon icon={faAngleRight} size="2xl" />
					</div>
				</div>

				<div
					className="flex flex-row justify-between w-5/6 h-16"
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
				>
					<div className="h-full w-16 bg-[#505050] rounded-md flex items-center justify-center">
						<FontAwesomeIcon
							icon={faComments}
							size="xl"
							color="#141414"
						/>
					</div>
					<div className="h-full w-52 flex items-center font-light pl-3">
						<p>Help</p>
					</div>

					<div className="h-full flex items-center justify-center">
						<FontAwesomeIcon icon={faAngleRight} size="2xl" />
					</div>
				</div>

				<div
					className="flex flex-row justify-between w-5/6 h-16"
					onClick={() => setSignOutModal(true)}
				>
					<div className="h-full w-16 bg-[#505050] rounded-md flex items-center justify-center">
						<FontAwesomeIcon
							icon={faSignOutAlt}
							size="xl"
							color="#141414"
						/>
					</div>
					<div className="h-full w-52 flex items-center font-light pl-3">
						<p>Sign Out</p>
					</div>

					<div className="h-full flex items-center justify-center">
						<FontAwesomeIcon icon={faAngleRight} size="2xl" />
					</div>
				</div>
			</div>
		</main>
	);
}
