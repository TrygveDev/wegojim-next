import { Modal } from "@mui/material";
import React from "react";

type Props = {
	prompt: string;
	subPrompt?: string;
	onConfirm: () => void;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConfirmModal = (props: Props) => {
	return (
		<Modal
			className="flex flex-col items-center justify-center"
			open={props.open}
			onClose={() => props.setOpen((value) => !value)}
			disableAutoFocus
		>
			<div className="bg-[var(--secondary)] w-5/6 min-h-[20vh] flex flex-col items-center justify-between gap-5 text-center rounded-lg">
				<div className="pt-5 pr-5 pl-5 h-full flex flex-col items-center justify-center">
					<h1 className="text-xl font-bold">{props.prompt}</h1>
					{props.subPrompt && (
						<p className=" text-xs">{props.subPrompt}</p>
					)}
				</div>

				<div className="w-full h-[10vh] flex flex-row items-center">
					<button
						className="bg-[var(--secondary-button)] h-full text-lg w-full flex items-center justify-center rounded-bl"
						onClick={() => props.setOpen((value) => !value)}
					>
						Cancel
					</button>

					<button
						className="bg-[var(--primary-button)] h-full text-lg w-full flex items-center justify-center rounded-br"
						onClick={props.onConfirm}
					>
						Yes
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default ConfirmModal;
