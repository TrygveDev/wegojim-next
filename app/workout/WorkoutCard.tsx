import React from "react";
import Exercise from "../interfaces/Exercise";

type Props = {
	setActive: (exercise: string) => void;
	exercise: [string, Exercise];
};

const WorkoutCard = (props: Props) => {
	return (
		<div
			className={
				"w-full h-20 rounded-lg bg-[var(--secondary-button)] flex flex-row items-center"
			}
			onClick={() => props.setActive(props.exercise[0])}
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

export default WorkoutCard;
