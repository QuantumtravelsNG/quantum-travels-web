import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const footerLinks = {
	"Business Solutions": [
		{
			name: "Book a Holiday",
			href: "/services/book-holiday/package-holiday",
		},
		{ name: "Corporate Travel", href: "/services/corporate-travel" },
		{ name: "Airport Transfers", href: "/services/car-services" },
		{ name: "Corporate Event", href: "/services/corporate-event" },
		{ name: "Visa Processing", href: "/services/visa" },
		{ name: "Car Hire", href: "/services/car-services" },
	],
	"Quantum Travels": [
		{ name: "About Us", href: "/about-us" },
		{ name: "Our Services", href: "/services" },
		{ name: "Affiliate Portal", href: "/affiliate-portal" },
		{ name: "Gallery", href: "/gallery" },
	],
	Legal: [
		{ name: "Privacy Policy", href: "/legal/privacy-policy" },
		{ name: "Terms & Conditions", href: "/legal/terms-conditions" },
		{ name: "Cookie Policy", href: "/legal/cookie-policy" },
	],
	"Help & Support": [
		{ name: "Contact Us", href: "/contact-us" },
		{ name: "Browse FAQ", href: "/contact-us#faq" },
	],
};

const SocialIcons = () => (
	<div className="flex items-center space-x-6 text-white">
		<Link href="https://twitter.com/QuantumTravels" aria-label="X (Twitter)">
			<svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
				<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
			</svg>
		</Link>
		<Link href=" https://tiktok.com/@quantumtravelsltd" aria-label="TikTok">
			<svg viewBox="0 0 448 512" className="w-5 h-5 fill-current">
				<path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
			</svg>
		</Link>
		<Link href=" https://www.youtube.com/@Quantum_Travels" aria-label="YouTube">
			<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
				<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
			</svg>
		</Link>
		<Link
			href=" https://instagram.com/quantum_travels_ltd"
			aria-label="Instagram"
		>
			<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
				<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
			</svg>
		</Link>
		<Link href="https://facebook.com/QuantumTravels" aria-label="Facebook">
			<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
				<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
			</svg>
		</Link>
		<Link
			href=" https://linkedin.com/company/quantum-travels-ltd"
			aria-label="LinkedIn"
		>
			<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
				<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
			</svg>
		</Link>
	</div>
);

export default function Footer() {
	return (
		<footer className="w-full bg-[#7F7F7F] text-white">
			<div className="hidden md:block w-full max-w-360 mx-auto pt-16 pb-8 px-4 md:px-10 relative">
				<div className="flex flex-row justify-between mb-16">
					<div className="flex w-3/4 justify-between pr-10">
						{Object.entries(footerLinks).map(([category, links]) => (
							<div key={category} className="flex flex-col">
								<h3 className="text-xl font-bold mb-8">{category}</h3>
								<ul className="flex flex-col space-y-4">
									{links.map((link) => (
										<li key={link.name}>
											<Link
												href={link.href}
												className="text-base font-light hover:underline list-disc"
											>
												<span className="flex items-center gap-2">
													<span className="h-1.5 w-1.5 rounded-full bg-white hidden lg:block" />{" "}
													{link.name}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					<div className="flex flex-col items-end pt-2 w-1/4 relative">
						<div className="rounded-full size-12 flex items-center justify-center shrink-0">
							<Image
								src="/assets/logomark.svg"
								alt="Quantum Logo"
								width={50}
								height={50}
								className="object-contain w-auto h-auto"
							/>
						</div>

						<div className="mt-20 flex rounded-xl gap-4 items-center">
							<div className="flex flex-col text-left">
								<h4 className="font-bold text-xl text-balance">
									Scan QR Code to Send Feedback
								</h4>
								<p className="text-base font-light mt-1 text-balance">
									Tell us how we can serve you better.
								</p>
							</div>
							<Link
								className="bg-white overflow-hidden rounded shrink-0"
								href="https://forms.gle/esdnY4JuFwtgHBKh7"
							>
								<Image
									src="/assets/footerQRCode.png"
									alt="Feedback QR Code"
									width={100}
									height={100}
								/>
							</Link>
						</div>
					</div>
				</div>

				<hr className="border-white/50 mb-8" />

				<div className="flex items-center justify-between mb-12">
					<div className="flex items-center space-x-4">
						<Image
							src="/assets/footerWreath.png"
							alt="Nigeria's Number 1 Corporate Travel Consolidator"
							width={64}
							height={72}
							className="object-contain"
						/>
						<div className="flex flex-col">
							<span className="text-xl font-light leader-tight">
								Nigeria&apos;s Number 1 Corporate
							</span>
							<span className="text-xl font-light leader-tight">
								Travel Consolidator
							</span>
						</div>
					</div>

					<SocialIcons />
				</div>

				<div className="text-center text-lg font-medium text-white pb-6">
					© 2026 Quantum Travels Nigeria Limited, All Rights Reserved.
				</div>
			</div>

			<div className="md:hidden flex flex-col pt-10 pb-6 relative px-6">
				<div className="rounded-full size-12 flex items-center justify-center ">
					<Image
						src="/assets/logomark.svg"
						alt="Quantum Logo"
						width={36}
						height={36}
						className="object-contain w-auto h-auto"
					/>
				</div>

				<div className="mb-10 w-full">
					<Accordion defaultValue={["item-0"]}>
						{Object.entries(footerLinks).map(([category, links], index) => (
							<AccordionItem
								key={category}
								value={`item-${index}`}
								className="border-b border-white/50"
							>
								<AccordionTrigger className="text-sm font-bold text-white hover:no-underline py-4">
									{category}
								</AccordionTrigger>
								<AccordionContent>
									<ul className="flex flex-col space-y-4 pt-2 pb-4 pl-4">
										{links.map((link) => (
											<li key={link.name}>
												<Link
													href={link.href}
													className="text-xs font-light flex items-center gap-2"
												>
													<span className="h-1 w-1 rounded-full bg-white" />{" "}
													{link.name}
												</Link>
											</li>
										))}
									</ul>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>

				<div className="flex flex-col items-center justify-center text-center mb-10">
					<h4 className="font-bold text-sm mb-1 text-balance">
						Scan QR Code to Send Feedback
					</h4>
					<p className="text-xs font-light mb-4 text-balance">
						Tell us how we can serve you better.
					</p>
					<Link
						className="bg-white rounded overflow-hidden"
						href="https://forms.gle/esdnY4JuFwtgHBKh7"
					>
						<Image
							src="/assets/footerQRCode.png"
							alt="Feedback QR Code"
							width={64}
							height={64}
						/>
					</Link>
				</div>

				<hr className="border-white/50 w-full mb-8" />

				<div className="flex flex-col items-center justify-center mb-8 gap-4">
					<div className="flex items-center gap-4 text-center pb-8 border-b border-white/50 w-full justify-center">
						<Image
							src="/assets/footerWreath.png"
							alt="Nigeria's Number 1"
							width={43}
							height={48}
							className="object-contain"
						/>
						<div className="flex flex-col text-left">
							<span className="text-sm font-light leading-snug">
								Nigeria&apos;s Number 1 Corporate
							</span>
							<span className="text-sm font-light leading-snug">
								Travel Consolidator
							</span>
						</div>
					</div>

					<div className="pt-2">
						<SocialIcons />
					</div>
				</div>

				<div className="text-center text-xs font-medium text-white pb-4">
					© 2026 Quantum Travels Nigeria Limited, All Rights Reserved.
				</div>
			</div>
		</footer>
	);
}
