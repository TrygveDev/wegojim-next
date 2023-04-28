import { useRouter } from "next/navigation";
import React from "react";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {};

const BackArrow: React.FC<Props> = ({}) => {
	const route = useRouter();

	return (
		<div className="w-screen h-screen absolute p-10 pointer-events-none">
			<FontAwesomeIcon
				icon={faAngleLeft}
				size="2xl"
				className="pointer-events-auto"
				onClick={() => route.back()}
			/>
		</div>
	);
};

export default BackArrow;
