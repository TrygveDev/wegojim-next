import "./globals.css";
import { Lexend } from "next/font/google";
import ToasterProvider from "./providers/ToasterProvider";

const font = Lexend({
	subsets: ["latin"],
});

export const metadata = {
	title: "wegojim",
	description: "Track your gains, smash your goals",
	manifest: "/manifest.json",
	applicationName: "wegojim",
	icons: {
		icon: "/favicon.png",
		apple: "/apple-touch-icon.png",
	},
	appleWebApp: {
		title: "wegojim",
		capable: true,
		statusBarStyle: "default",
	},
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
