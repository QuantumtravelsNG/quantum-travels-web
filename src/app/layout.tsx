import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const jost = Montserrat({
	variable: "--font-jost",
	subsets: ["latin"],
	display: "optional",
	preload: true,
	fallback: ["Arial", "Helvetica", "sans-serif"],
	adjustFontFallback: true,
});

export const metadata: Metadata = {
	applicationName: "Quantum Travels",
	title: {
		default: "Quantum Travels",
		template: "%s | Quantum Travels",
	},
	description: "Your journey starts here.",
	manifest: "/favicon/site.webmanifest",
	appleWebApp: {
		title: "Quantum Travels",
		statusBarStyle: "default",
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: [
			{
				url: "/favicon/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
	},
};

export const viewport: Viewport = {
	themeColor: "#ffffff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${jost.variable} h-full antialiased`}
			suppressHydrationWarning
			data-scroll-behavior="smooth"
		>
			<body className="min-h-full flex flex-col">
				<Navbar />
				<div className="flex-1 ">{children}</div>
				<Footer />
				<Chatbot />
			</body>
		</html>
	);
}
