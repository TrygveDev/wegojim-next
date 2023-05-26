import { faDeleteLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	active: string;
	workout: Workout;
};

type Workout = {
	name: string;
	icon: string;
	exercises: {
		[key: string]: {
			name: string;
			sets: string | number;
			reps: string | number;
		};
	};
};

type Weight = {
	weight: number;
};

const WeightInputModal = (props: Props) => {
	const [weights, setWeights] = useState<Weight[]>([
		{
			weight: 0,
		},
	]);

	const progress = useState({
		workoutId: {
			"Date.now": {
				[props.active]: {
					weight: [120, 130, 140],
				},
				[props.active]: {
					weight: [120, 130, 140],
				},
			},
		},
	});

	return (
		<Modal
			className="flex flex-col items-center justify-center"
			open={props.open}
			onClose={() => props.setOpen((value) => !value)}
			disableAutoFocus
		>
			<div className="bg-[var(--secondary)] w-5/6 min-h-[20vh] flex flex-col items-center justify-between gap-5 text-center rounded-lg">
				{/* Titles */}
				<div className="pr-5 pl-5 pt-5 flex flex-col items-center justify-center">
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
					className="flex gap-2 items-center justify-start w-fit"
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
				<div className="w-full h-[10vh] flex flex-row items-center">
					<button
						className="bg-[var(--secondary-button)] h-full text-lg w-full flex items-center justify-center rounded-bl"
						onClick={() => props.setOpen((value) => !value)}
					>
						Dont Track
					</button>

					<button
						className="bg-[var(--primary-button)] h-full text-lg w-full flex items-center justify-center rounded-br"
						onClick={() => {
							console.log(weights);
							setWeights([
								{
									weight: null,
								},
							]);
							props.setOpen((value) => !value);
						}}
					>
						Confirm
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default WeightInputModal;
