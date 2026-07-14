"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type ServiceMenuItem = {
	title: string;
	description: string;
	image: string;
	href: string;
};

export const serviceMenu: ServiceMenuItem[] = [
	{
		title: "Book a Holiday",
		description:
			"Discover the best tours & experience travel like never before.",
		image: "/ourServices/book-holiday/packageHolidayHeroImage.jpg",
		href: "/services/book-holiday/package-holiday",
	},
	{
		title: "Corporate Travel",
		description: "We deliver personalized, seamless travel experiences.",
		image: "/ourServices/corporateTravel/corporateTravelHero.jpg",
		href: "/services/corporate-travel",
	},
	{
		title: "Car Services",
		description:
			"Professionally managed transport ensuring a smooth travel experience.",
		image: "/ourServices/carServices/carServicesHero.jpg",
		href: "/services/car-services",
	},
	{
		title: "Corporate Event",
		description: "Seamless solutions for corporate events.",
		image: "/ourServices/corporateEvent/hero.jpg",
		href: "/services/corporate-event",
	},
	{
		title: "Visa Application",
		description:
			"Effortless visa processing services designed to simplify your travel plans.",
		image: "/ourServices/visa/hero.jpg",
		href: "/services/visa",
	},
];

export const defaultServicePreview = "/ourServices/serviceMenu/primary.png";

interface ServiceMenuPanelProps {
	activeImage: string;
	onItemHover: (image: string) => void;
	onItemClick?: () => void;
}

export function ServiceMenuPanel({
	activeImage,
	onItemHover,
	onItemClick,
}: ServiceMenuPanelProps) {
	return (
		<>
			<div className="hidden md:grid md:grid-cols-[440px_1fr] md:gap-8 md:rounded-[10px] md:bg-[#f9f9f9] md:p-4 md:shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
				<div className="relative h-auto overflow-hidden rounded-[5px]">
					<Image
						src={activeImage}
						alt=""
						fill
						className="object-cover"
						sizes="440px"
					/>
				</div>

				<div className="border-l border-black/15 pl-8">
					<div className="flex h-full flex-col justify-between py-2">
						{serviceMenu.map((item) => (
							<Link
								key={item.title}
								href={item.href}
								onMouseEnter={() => onItemHover(item.image)}
								onFocus={() => onItemHover(item.image)}
								onClick={onItemClick}
								className="group flex items-start justify-between gap-6 rounded-md px-0 py-1 transition-opacity hover:opacity-85"
							>
								<div>
									<h3 className="text-[20px] font-bold leading-none text-text group-hover:text-primary">
										{item.title}
									</h3>
									<p className="mt-2 max-w-[470px] text-base leading-6 font-light text-text group-hover:text-primary">
										{item.description}
									</p>
								</div>
								<ChevronRight className="mt-1 size-5 shrink-0 text-text group-hover:text-primary" />
							</Link>
						))}
					</div>
				</div>
			</div>

			<div className="rounded-[10px] bg-[#f9f9f9] p-5 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] md:hidden">
				<div className="space-y-5">
					{serviceMenu.map((item) => (
						<Link
							key={item.title}
							href={item.href}
							onClick={onItemClick}
							className="block transition-opacity hover:opacity-85"
						>
							<h3 className="text-base font-bold leading-normal text-text">
								{item.title}
							</h3>
							<p className="mt-1 text-xs leading-[1.5] font-light text-text">
								{item.description}
							</p>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
