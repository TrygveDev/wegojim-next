import "./globals.css";
import { Lexend } from "next/font/google";
import ToasterProvider from "./providers/ToasterProvider";

const font = Lexend({
	subsets: ["latin"],
});

export const metadata = {
	title: "wegojim",
	description: "Track your gains, smash your goals",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={font.className}>
				{children}
				<ToasterProvider />
			</body>
		</html>
	);
}
