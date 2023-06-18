import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-hot-toast";

type Props = {};

const Desktop = (props: Props) => {
	return (
		<div className="w-screen h-screen flex-col flex items-center justify-center bg-[#141414] gap-4 pl-[33vw] pr-[33vw] select-none">
			<h1 className="text-4xl">wegojim</h1>
			<p>
				This is a mobile app! Please open this page on your mobile
				device to gain access.
			</p>
			<div className="flex gap-24 mt-5">
				<FontAwesomeIcon
					icon={faApple}
					color="gray"
					size="2xl"
					className="hover:text-white transition-colors duration-500 cursor-pointer"
					onClick={() => {
						toast.error("Coming soon to the App Store!");
					}}
				/>
				<FontAwesomeIcon
					icon={faGooglePlay}
					color="gray"
					size="2xl"
					className="hover:text-white transition-colors duration-500 cursor-pointer"
					onClick={() => {
						toast.error("Coming soon to the Google Play Store!");
					}}
				/>
			</div>
		</div>
	);
};

export default Desktop;
