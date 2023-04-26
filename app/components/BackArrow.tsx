import { useRouter } from "next/navigation";
import React from "react";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
	path: string;
};

const BackArrow: React.FC<Props> = ({ path }) => {
	const route = useRouter();

	return (
		<div className="w-screen h-screen absolute p-10 pointer-events-none">
			<FontAwesomeIcon
				icon={faAngleLeft}
				size="2xl"
				className="pointer-events-auto"
				onClick={() => route.push(path)}
			/>
		</div>
	);
};

export default BackArrow;
