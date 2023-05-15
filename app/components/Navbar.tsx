import {
	faBell,
	faChartSimple,
	faGear,
	faHome,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

type Props = {};

const Navbar = (props: Props) => {
	const router = useRouter();
	const path = usePathname();
	return (
		<div className="w-screen h-screen absolute pointer-events-none flex flex-col items-center justify-between pl-7 pr-7">
			<div className="w-full m-7 pointer-events-none rounded-2xl flex flex-row justify-between items-center">
				<FontAwesomeIcon
					className="pointer-events-auto"
					icon={faBell}
					size="xl"
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
				/>
				<FontAwesomeIcon
					className="pointer-events-auto"
					icon={faGear}
					size="xl"
					onClick={() => router.push("/settings")}
				/>
			</div>
			<div className="h-14 w-full mb-6 pointer-events-auto rounded-2xl bg-[#1E1E1E] flex flex-row justify-evenly items-center">
				<FontAwesomeIcon
					icon={faChartSimple}
					size="xl"
					color={path === "/stats" ? "#FFF" : "#8E8E8E"}
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
					// router.push("/stats")
				/>
				<FontAwesomeIcon
					icon={faHome}
					size="xl"
					color={path === "/home" ? "#FFF" : "#8E8E8E"}
					onClick={() => router.push("/home")}
				/>
				<FontAwesomeIcon
					icon={faUsers}
					size="xl"
					color={path === "/social" ? "#FFF" : "#8E8E8E"}
					onClick={() =>
						toast.error("This feature is not available yet!")
					}
					// router.push("/social")
				/>
			</div>
		</div>
	);
};

export default Navbar;
