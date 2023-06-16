import React from "react";

type Props = {
	setUncheckModalOpen: (arg0: boolean) => void;
	setActive: (exercise: string) => void;
	exercise: [
		string,
		{ name: string; sets: string | number; reps: string | number }
	];
};

const CheckedWorkoutCard = (props: Props) => {
	return (
		<div
			className={
				"w-full h-12 rounded-lg bg-[#151515] flex flex-row items-center italic text-gray-400 line-through"
			}
			onClick={() => {
				props.setUncheckModalOpen(true);
				props.setActive(props.exercise[0]);
			}}
		>
			<div className="w-4/6">
				<p className="w-full pl-5">{props.exercise[1].name}</p>
			</div>
			<div className="w-2/12 text-center">
				<p>{props.exercise[1].sets}</p>
			</div>
			<div className="w-3/12 text-center pr-5">
				<p>{props.exercise[1].reps}</p>
			</div>
		</div>
	);
};

export default CheckedWorkoutCard;
