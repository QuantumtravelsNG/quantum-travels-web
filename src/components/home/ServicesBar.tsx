import React from "react";
import Image from "next/image";
import Link from "next/link";

type HomeServiceLink = {
	icon: string;
	iconHover: string;
	href: string;
	label: string;
};

const homeServiceLinks: HomeServiceLink[] = [
	{
		href: "/services/book-holiday",
		label: "Book a Holiday",
		icon: "/home/holidayDefault.svg",
		iconHover: "/home/holiday.svg",
	},
	{
		href: "/services/corporate-travel",
		label: "Corporate Travel",
		icon: "/home/corporateDefault.svg",
		iconHover: "/home/corporate.svg",
	},
	{
		href: "/services/car-services",
		label: "Airport Transfer",
		icon: "/home/airportDefault.svg",
		iconHover: "/home/airport.svg",
	},
	{
		href: "/services/corporate-event",
		label: "Corporate Event",
		icon: "/home/eventDefault.svg",
		iconHover: "/home/event.svg",
	},
	{
		href: "/services/visa",
		label: "Visa Processing",
		icon: "/home/visaDefault.svg",
		iconHover: "/home/visa.svg",
	},
	{
		href: "/services/car-services",
		label: "Car Hire",
		icon: "/home/carDefault.svg",
		iconHover: "/home/car.svg",
	},
];

export default function ServicesBar() {
	return (
		<section className="py-8">
			<div className="max-w-7xl mx-auto px-4 md:px-10">
				<div className="hidden md:flex bg-white h-[180px] rounded-[10px] shadow-[0px_2px_8px_1px_rgba(0,0,0,0.08)] w-full items-center">
					{homeServiceLinks.map((link, index) => (
						<React.Fragment key={link.label}>
							<Link
								href={link.href}
								className="group relative flex-1 flex flex-col items-center justify-center h-full gap-3"
							>
								<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[124px] h-[10px] bg-[#9E328A] rounded-b-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

								<div className="relative w-[44px] h-[44px]">
									<Image
										src={link.icon}
										alt={link.label}
										fill
										className="object-contain block group-hover:hidden transition-all duration-300"
										sizes="44px"
									/>
									<Image
										src={link.iconHover}
										alt={link.label}
										fill
										className="object-contain hidden group-hover:block transition-all duration-300"
										sizes="44px"
									/>
								</div>
								<span className="text-[14px] font-medium text-text whitespace-nowrap">
									{link.label}
								</span>
							</Link>

							{index < homeServiceLinks.length - 1 && (
								<div className="w-px h-[124px] bg-[#E5E5E5]" />
							)}
						</React.Fragment>
					))}
				</div>

				<div className="md:hidden flex flex-col bg-white rounded-[8px] shadow-[0px_0.8px_4px_0px_rgba(0,0,0,0.08)] w-full">
					{homeServiceLinks.map((link, index) => (
						<React.Fragment key={link.label}>
							<Link
								href={link.href}
								className="flex items-center justify-between px-4 py-5 hover:bg-gray-50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="relative size-8">
										<Image
											src={link.iconHover}
											alt={link.label}
											fill
											className="object-contain"
											sizes="32px"
										/>
									</div>
									<span className="text-base font-medium text-text">
										{link.label}
									</span>
								</div>
								<div className="size-10 border border-black/10 rounded-lg flex items-center justify-center shrink-0">
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M14 8H2"
											stroke="black"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M9 3L14 8L9 13"
											stroke="black"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							</Link>
							{index < homeServiceLinks.length - 1 && (
								<div className="mx-4 h-px bg-[#E5E5E5]" />
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		</section>
	);
}
