"use client";

import { CircularProgress } from "@mui/material";

export default function Loading() {
	return (
		<div className="w-screen h-screen flex items-center justify-center bg-[var(--secondary)]">
			<CircularProgress />
		</div>
	);
}
