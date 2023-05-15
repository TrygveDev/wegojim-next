import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmModal from "./ConfirmModal";

type Props = {
	confirm?: boolean;
	confirmPrompt?: string;
	confirmSubPropmt?: string;
};

const BackArrow: React.FC<Props> = ({
	confirm,
	confirmPrompt,
	confirmSubPropmt,
}) => {
	const route = useRouter();
	const [open, setOpen] = useState(false);

	return (
		<div className="w-screen h-screen absolute p-7 pointer-events-none">
			{confirm && (
				<ConfirmModal
					open={open}
					setOpen={setOpen}
					prompt={confirmPrompt}
					subPrompt={confirmSubPropmt}
					onConfirm={() => route.back()}
				/>
			)}

			<FontAwesomeIcon
				icon={faAngleLeft}
				size="xl"
				className="pointer-events-auto"
				onClick={() =>
					confirm ? setOpen((value) => !value) : route.back()
				}
			/>
		</div>
	);
};

export default BackArrow;
