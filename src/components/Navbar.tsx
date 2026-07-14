"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import {
	defaultServicePreview,
	serviceMenu,
	ServiceMenuPanel,
} from "@/components/ourServices/ServiceMenuPanel";

const navLinks = [
	{ name: "About us", href: "/about-us" },
	{ name: "Our Services", href: "/services" },
	{ name: "Affiliate Portal", href: "/affiliate-portal" },
	{ name: "Gallery", href: "/gallery" },
	{ name: "Contact Us", href: "/contact-us" },
];

export default function Navbar() {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpenPath, setMobileMenuOpenPath] = useState<string | null>(
		null,
	);
	const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
	const [activeServiceImage, setActiveServiceImage] = useState(
		defaultServicePreview,
	);
	const isMobileMenuOpen = mobileMenuOpenPath === pathname;

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // initialize

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const isTransparent = isHome && !scrolled && !isMobileMenuOpen;

	const headerBgClass = isTransparent
		? "bg-transparent text-white"
		: "bg-white text-text shadow-[0px_1px_6px_0px_rgba(0,0,0,0.1)]";

	const quantumLogoSrc = isTransparent
		? "/assets/quantumLogoWhite.svg"
		: "/assets/quantumLogo.svg";

	const dbLogoSrc = isTransparent
		? "/assets/dunAndBradstreetWhite.svg"
		: "/assets/dunAndBradstreet.svg";

	const isActiveRoute = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	const closeServicesMenu = () => {
		setServicesMenuOpen(false);
		setActiveServiceImage(defaultServicePreview);
	};

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${headerBgClass}`}
		>
			<div className="mx-auto flex h-15 md:h-22 w-full max-w-360 items-center justify-between px-4 md:px-10">
				<div className="flex items-center space-x-4 md:space-x-8">
					<Link
						href="/"
						className="relative h-[34px] w-[90px] md:h-[46px] md:w-[120px]"
					>
						<Image
							src={quantumLogoSrc}
							alt="Quantum Travels Logo"
							fill
							className="object-contain object-left"
							sizes="(max-width: 768px) 90px, 120px"
							priority
						/>
					</Link>

					<Link
						className="hidden md:block relative h-[46px] w-[51px]"
						href="https://profiles.dunsregistered.com/TPSAME-BAS-004.aspx/"
						rel="noopener noreferrer"
						target="_blank"
					>
						<Image
							src={dbLogoSrc}
							alt="Dun & Bradstreet Logo"
							fill
							className="object-contain"
							sizes="51px"
						/>
					</Link>
				</div>

				<nav className="hidden md:flex items-center gap-10">
					{navLinks.map((link) => {
						const isActive = isActiveRoute(link.href);
						const isServicesLink = link.href === "/services";

						if (isServicesLink) {
							return (
								<div
									key={link.name}
									className="relative"
									onMouseEnter={() => setServicesMenuOpen(true)}
									onMouseLeave={closeServicesMenu}
									onFocusCapture={() => setServicesMenuOpen(true)}
									onBlurCapture={(event) => {
										if (
											event.currentTarget.contains(
												event.relatedTarget as Node | null,
											)
										) {
											return;
										}

										closeServicesMenu();
									}}
								>
									<Link
										href={link.href}
										className={`text-base font-medium leading-normal whitespace-nowrap transition-opacity hover:opacity-80 ${
											isActive ? "text-primary" : ""
										}`}
										aria-haspopup="true"
										aria-expanded={servicesMenuOpen}
									>
										{link.name}
									</Link>

									<div
										className={`absolute top-full left-1/2 z-50 w-[min(1120px,calc(100vw-80px))] -translate-x-1/2 overflow-hidden transition-all duration-300 ease-out ${
											servicesMenuOpen
												? "pt-8 max-h-[520px] opacity-100"
												: "pt-0 max-h-0 opacity-0 pointer-events-none"
										}`}
									>
										<ServiceMenuPanel
											activeImage={activeServiceImage}
											onItemHover={setActiveServiceImage}
											onItemClick={closeServicesMenu}
										/>
									</div>
								</div>
							);
						}

						return (
							<Link
								key={link.name}
								href={link.href}
								className={`text-base font-medium leading-normal whitespace-nowrap transition-opacity hover:opacity-80 ${
									isActive ? "text-primary" : ""
								}`}
							>
								{link.name}
							</Link>
						);
					})}
				</nav>

				<div className="flex items-center gap-4">
					<div className="hidden md:flex items-center gap-2">
						<span className="flex items-center gap-1 text-base font-black tracking-wide leading-normal whitespace-nowrap">
							<Image
								src="/home/nigFlag.png"
								alt="Nigeria flag"
								width={20}
								height={20}
								className="h-5 w-5 object-cover"
							/>
							EN
						</span>
					</div>

					<div className="md:hidden">
						<Sheet
							open={isMobileMenuOpen}
							onOpenChange={(open) => {
								setMobileMenuOpenPath(open ? pathname : null);
								if (!open) closeServicesMenu();
							}}
						>
							<SheetTrigger>
								<Menu
									className={`h-6 w-6 ${isTransparent ? "text-white" : "text-text"}`}
								/>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="flex flex-col w-[300px] sm:w-[350px] p-0 bg-white"
							>
								<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
								<div className="flex flex-col h-full pt-16 relative">
									<div className="flex flex-col mt-4">
										{navLinks.map((link) => {
											const isServicesLink = link.href === "/services";

											if (isServicesLink) {
												return (
													<React.Fragment key={link.name}>
														<div>
															<div className="flex items-stretch">
																<Link
																	href={link.href}
																	onClick={() => {
																		setMobileMenuOpenPath(null);
																		closeServicesMenu();
																	}}
																	className="flex-1 px-6 py-6 text-base font-medium text-text transition-colors hover:bg-gray-50"
																>
																	{link.name}
																</Link>
																<button
																	type="button"
																	onClick={() =>
																		setServicesMenuOpen((open) => !open)
																	}
																	className="flex w-16 items-center justify-center text-text transition-colors hover:bg-gray-50"
																	aria-expanded={servicesMenuOpen}
																	aria-controls="mobile-services-menu"
																	aria-label={
																		servicesMenuOpen
																			? "Collapse services menu"
																			: "Expand services menu"
																	}
																>
																	<ChevronDown
																		className={`size-5 transition-transform duration-200 ${
																			servicesMenuOpen ? "rotate-180" : ""
																		}`}
																	/>
																</button>
															</div>
															<div
																id="mobile-services-menu"
																className={`overflow-hidden transition-all duration-300 ease-out ${
																	servicesMenuOpen
																		? "max-h-96 opacity-100"
																		: "max-h-0 opacity-0"
																}`}
															>
																<div className="pb-3 pl-10 pr-6">
																	{serviceMenu.map((service) => (
																		<Link
																			key={service.title}
																			href={service.href}
																			onClick={() => {
																				setMobileMenuOpenPath(null);
																				closeServicesMenu();
																			}}
																			className="block py-3 text-sm font-medium text-text/80 transition-colors hover:text-primary"
																		>
																			{service.title}
																		</Link>
																	))}
																</div>
															</div>
														</div>
														<hr className="border-gray-200 w-[80%] mx-auto" />
													</React.Fragment>
												);
											}

											return (
												<React.Fragment key={link.name}>
													<Link
														href={link.href}
														onClick={() => {
															setMobileMenuOpenPath(null);
															closeServicesMenu();
														}}
														className="px-6 py-6 text-base font-medium text-text transition-colors hover:bg-gray-50"
													>
														{link.name}
													</Link>
													<hr className="border-gray-200 w-[80%] mx-auto" />
												</React.Fragment>
											);
										})}
									</div>

									<div className="mt-8 px-6 flex items-center gap-2">
										<span className="flex items-center gap-1 text-base font-black text-text">
											<Image
												src="/home/nigFlag.png"
												alt="Nigeria flag"
												width={20}
												height={20}
												className="h-5 w-5 object-cover"
											/>
											EN
										</span>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}
