import { faDeleteLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type Weight = {
	weight: number;
};

const WeightInputModal = (props: Props) => {
	const [weights, setWeights] = useState<Weight[]>([
		{
			weight: null,
		},
	]);
	return (
		<Modal
			className="flex flex-col items-center justify-center"
			open={props.open}
			onClose={() => props.setOpen((value) => !value)}
			disableAutoFocus
		>
			<div className="bg-[var(--secondary)] w-5/6 pt-5 pb-5 flex flex-col items-center justify-between gap-5 text-center rounded-lg">
				{/* Titles */}
				<div className="pt-5 pr-10 pl-10">
					<h1 className="text-xl font-bold">Track your progress!</h1>
					<p className=" text-xs">
						Enter the weight you used for this exercise.
					</p>
				</div>
				{/* Inputs */}
				<div className="max-h-72 flex flex-col gap-2 overflow-y-scroll">
					{weights.length > 0
						? weights.map((weight: any, i: number) => {
								return (
									<div
										key={i}
										className="flex items-center justify-center"
									>
										<div className="pr-2">
											<p>Set {i + 1}</p>
										</div>
										<div className="w-3/6 h-14 rounded-lg bg-[var(--secondary-button)] flex flex-row items-center">
											<div className="w-full pl-5 pr-5">
												<input
													className="text-lg text-center w-full bg-transparent focus:outline-none"
													maxLength={4}
													placeholder="0"
													value={
														weight.weight
															? weight.weight
															: ""
													}
													type="number"
													onChange={(e: any) => {
														const newList = [
															...weights,
														];
														newList[i].weight =
															e.target.value;
														setWeights(newList);
													}}
												></input>
											</div>
										</div>
										<div
											className="pl-2"
											onClick={() => {
												setWeights((value) =>
													value.filter((_, index) => {
														return index !== i;
													})
												);
											}}
										>
											<FontAwesomeIcon
												icon={faDeleteLeft}
												color="#C73C3C"
												size="xl"
											/>
										</div>
									</div>
								);
						  })
						: null}
				</div>

				{/* Add button */}
				<div
					className="flex gap-2 items-center justify-start w-full pl-8"
					onClick={() => {
						if (weights.length < 10) {
							setWeights((value) => [...value, { weight: null }]);
						} else {
							toast.error("You can only track up to 10 sets!");
						}
					}}
				>
					<FontAwesomeIcon icon={faPlus} />
					<p>add set</p>
				</div>

				{/* Submit */}
				<div className="w-full flex flex-col items-center gap-2 pb-5 pr-5 pl-5">
					<Button
						variant="contained"
						color="success"
						className="w-full"
						onClick={() => {
							console.log(weights);
							if (weights.length === 0)
								return toast.error(
									"You have to add atleast one set!"
								);
						}}
					>
						Ok
					</Button>
					<Button
						variant="contained"
						color="error"
						className="w-full"
						onClick={() => props.setOpen((value) => !value)}
					>
						Dont track
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default WeightInputModal;
