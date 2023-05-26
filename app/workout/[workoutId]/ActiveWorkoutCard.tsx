import React from "react";
import { toast } from "react-hot-toast";

type Props = {
	exercise: [
		string,
		{ name: string; sets: string | number; reps: string | number }
	];
	setWeightSubmit: (weightSubmit: boolean) => void;
};

const ActiveWorkoutCard = (props: Props) => {
	return (
		<div
			className={
				"w-full min-h-32 rounded-lg bg-[var(--primary-button)] flex flex-col"
			}
			onClick={() => {}}
		>
			<div className="w-full flex flex-row items-center mt-1">
				<div className="w-7/12">
					<p className="pl-5 font-extralight">Exercise</p>
				</div>
				<div className="w-2/12 font-extralight text-center">
					<p>Sets</p>
				</div>
				<div className="pr-5 w-3/12 font-extralight text-center">
					<p>Reps</p>
				</div>
			</div>
			<div className="w-full flex flex-row items-center mb-2">
				<div className="w-7/12">
					<p className="w-full pl-5">{props.exercise[1].name}</p>
				</div>
				<div className="w-2/12 h- full text-center">
					<p>{props.exercise[1].sets}</p>
				</div>
				<div className="w-3/12 text-center pr-5">
					<p>{props.exercise[1].reps}</p>
				</div>
			</div>
			{/* <div className="w-full flex flex-row items-center justify-center mt-1">
				<div className="w-3/12 font-extralight text-center">
					<p>Set 1</p>
				</div>
				<div className="w-3/12 font-extralight text-center">
					<p>Set 2</p>
				</div>
				<div className="w-3/12 font-extralight text-center">
					<p>Set 3</p>
				</div>
			</div>
			<div className="w-full flex flex-row items-center justify-center text-xl pb-2">
				<div className="w-3/12 text-center">
					<p>20kg</p>
				</div>
				<div className="w-3/12 text-center">
					<p>22.5kg</p>
				</div>
				<div className="w-3/12 text-center">
					<p>25kg</p>
				</div>
			</div> */}
		</div>
	);
};

export default ActiveWorkoutCard;
