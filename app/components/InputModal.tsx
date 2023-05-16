import { Button, Modal } from "@mui/material";
import React, { useState } from "react";

type Props = {
	prompt: string;
	subPrompt?: string;
	onConfirm: (input: any) => void;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	placeholder?: string;
	type?: string;
};

const InputModal = (props: Props) => {
	const [input, setInput] = useState("");
	return (
		<Modal
			className="flex flex-col items-center justify-center"
			open={props.open}
			onClose={() => props.setOpen((value) => !value)}
			disableAutoFocus
		>
			<div className="bg-[var(--secondary)] w-5/6 flex flex-col items-center justify-between gap-5 text-center rounded-lg">
				<div className="pt-5 pr-10 pl-10">
					<h1 className="text-xl font-bold">{props.prompt}</h1>
					{props.subPrompt && (
						<p className=" text-xs">{props.subPrompt}</p>
					)}
				</div>

				<div className="w-3/4 flex items-center bg-[var(--secondary-button)] p-3 rounded text-lg">
					<input
						className="bg-transparent w-full focus:outline-none"
						maxLength={50}
						placeholder={props.placeholder}
						type={props.type}
						onChange={(e) => setInput(e.target.value)}
					></input>
				</div>

				<div className="w-full flex flex-col items-center gap-2 pb-5 pr-5 pl-5">
					<Button
						variant="contained"
						color="success"
						className="w-full"
						onClick={() => props.onConfirm(input)}
					>
						Ok
					</Button>
					<Button
						variant="contained"
						color="error"
						className="w-full"
						onClick={() => props.setOpen((value) => !value)}
					>
						Back
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default InputModal;
