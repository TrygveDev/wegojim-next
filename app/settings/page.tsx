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
import { Avatar } from "@mui/material";
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
import Loading from "../loading";

export default function Settings() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [signOutModal, setSignOutModal] = useState(false);
	const [resetPasswordModal, setResetPasswordModal] = useState(false);
	const [verifyModal, setVerifyModal] = useState(false);
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) return router.push("/");
			setUser(user);
			setInitializing(false);
		});
	}, [router]);

	return initializing ? (
		<Loading />
	) : (
		<main className="min-h-screen max-h-fit w-screen flex flex-col items-center bg-[var(--secondary)] pl-7 pr-7 pb-7">
			<ConfirmModal
				prompt="Send a email verification mail?"
				open={verifyModal}
				setOpen={setVerifyModal}
				onConfirm={() => {
					sendEmailVerification(user)
						.then(() => toast.success("Verification email sent!"))
						.catch(() => toast.error("Something went wrong!"));
				}}
			/>
			<ConfirmModal
				prompt="Sign out?"
				open={signOutModal}
				setOpen={setSignOutModal}
				onConfirm={() => {
					signOut(auth).then(() => {
						toast.success("Signed out!");
						router.push("/auth");
					});
				}}
			/>
			<ConfirmModal
				prompt="Send a password reset mail?"
				open={resetPasswordModal}
				setOpen={setResetPasswordModal}
				onConfirm={() => {
					sendPasswordResetEmail(auth, user.email)
						.then(() => toast.success("Password reset email sent!"))
						.catch(() => toast.error("Something went wrong!"));
				}}
			/>
			<BackArrow />

			{/* Avatar */}
			<div className="pt-28 flex justify-end items-end">
				<Avatar
					src={user ? (user.photoURL ? user.photoURL : "") : ""}
					sx={{
						width: 108,
						height: 108,
						border: "3px solid var(--primary)",
					}}
				/>
				<div className="bg-[var(--primary)] w-7 h-7 rounded-full flex items-center justify-center absolute">
					<FontAwesomeIcon
						icon={faEdit}
						color="var(--secondary)"
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
			<div>
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

			<div className="w-screen flex flex-col items-center gap-2 pt-10">
				{!user.emailVerified && (
					<div
						className="flex flex-row justify-between w-5/6 h-16"
						onClick={() => setVerifyModal(true)}
					>
						<div className="h-full w-16 bg-[var(--primary-button)] rounded-md flex items-center justify-center">
							<FontAwesomeIcon icon={faEnvelope} size="xl" />
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
					<div className="h-full w-16 bg-[var(--primary-button)] rounded-md flex items-center justify-center">
						<FontAwesomeIcon icon={faEnvelope} size="xl" />
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
					<div className="h-full w-16 bg-[var(--primary-button)] rounded-md flex items-center justify-center">
						<FontAwesomeIcon icon={faLock} size="xl" />
					</div>
					<div className="h-full w-52 flex items-center font-light pl-3">
						<p>Change Password</p>
					</div>

					<div className="h-full flex items-center justify-center">
						<FontAwesomeIcon icon={faAngleRight} size="2xl" />
					</div>
				</div>
			</div>

			<div className="w-screen flex flex-col items-center pt-10 gap-2">
				<div
					className="flex flex-row justify-between w-5/6 h-16"
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
				>
					<div className="h-full w-16 bg-[var(--secondary-button)] rounded-md flex items-center justify-center">
						<FontAwesomeIcon icon={faUserPlus} size="xl" />
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
					<div className="h-full w-16 bg-[var(--secondary-button)] rounded-md flex items-center justify-center">
						<FontAwesomeIcon icon={faComments} size="xl" />
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
					<div className="h-full w-16 bg-[var(--secondary-button)] rounded-md flex items-center justify-center">
						<FontAwesomeIcon icon={faSignOutAlt} size="xl" />
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
