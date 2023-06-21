export default interface Pr {
	name: string;
	icon: string;
	progress: {
		[key: string]: {
			date: string;
			weight: [number];
		};
	};
}
