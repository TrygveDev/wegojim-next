import {
	faBell,
	faChartSimple,
	faHome,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import { User } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

type Props = {
	user: User | null;
};

const Navbar = (props: Props) => {
	const router = useRouter();
	const path = usePathname();
	return (
		<div className="w-screen h-screen absolute pointer-events-none flex flex-col items-center justify-between p-4">
			<div className="w-full pointer-events-none rounded-2xl flex flex-row justify-between items-center">
				<FontAwesomeIcon
					className="pointer-events-auto"
					icon={faBell}
					size="xl"
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
				/>
				<Link className="pointer-events-auto" href="/settings">
					<Avatar
						src={props.user?.photoURL}
						className="border-[var(--primary)] border-2"
					/>
				</Link>
			</div>
			<div className="h-14 w-full pointer-events-auto rounded-2xl bg-[var(--primary-button)] flex flex-row justify-evenly items-center">
				<FontAwesomeIcon
					icon={faChartSimple}
					size="xl"
					color={path === "/stats" ? "" : "var(--secondary)"}
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
				/>
				<FontAwesomeIcon
					icon={faHome}
					size="xl"
					color={path === "/" ? "" : "var(--secondary)"}
					onClick={() => router.push("/")}
				/>
				<FontAwesomeIcon
					icon={faUsers}
					size="xl"
					color={path === "/social" ? "" : "var(--secondary)"}
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
				/>
			</div>
		</div>
	);
};

export default Navbar;
