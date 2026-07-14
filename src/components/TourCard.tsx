"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isRemoteImage } from "@/lib/images";
import { type TourPackage, getDisplayPrice } from "@/lib/quantum";

interface TourCardProps {
	tour: TourPackage;
}

export default function TourCard({ tour }: TourCardProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className="flex flex-col group"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div className="relative w-full aspect-180/220 md:aspect-320/340 rounded-[12px] overflow-hidden">
				<Link
					href={`/services/book-holiday/${tour.tourType === "cruise" ? "cruises" : "package-holiday"}/${tour.slug}`}
					className="w-full h-full cursor-pointer absolute inset-0 top-0 bottom-0 left-0 right-0 z-10"
				/>
				<Image
					src={tour.coverPhoto}
					alt={tour.title}
					fill
					className="object-cover transition-transform duration-500"
					sizes="(max-width: 768px) 50vw, 25vw"
					unoptimized={isRemoteImage(tour.coverPhoto)}
				/>

				<div
					className={`absolute inset-0 bg-black/20 rounded-lg transition-opacity duration-300 ${
						hovered ? "opacity-100" : "opacity-0"
					}`}
				/>

				<div
					className={`absolute inset-x-3 bottom-3 md:flex flex-col gap-2 transition-all duration-300 z-20 hidden  ${
						hovered
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-4 pointer-events-none"
					}`}
				>
					<Link
						href={`/services/book-holiday/${tour.tourType === "cruise" ? "cruises" : "package-holiday"}/${tour.slug}`}
						className="w-full cursor-pointer"
					>
						<Button
							variant="card-glass"
							size="card"
							className="w-full uppercase tracking-wider"
						>
							More Information
						</Button>
					</Link>
				</div>
			</div>

			<div className="mt-4">
				<Link
					href={`/services/book-holiday/${tour.tourType === "cruise" ? "cruises" : "package-holiday"}/${tour.slug}`}
					className="w-full cursor-pointer"
				>
					<h3 className="text-base md:text-xl font-semibold text-text leading-tight">
						{tour.title}
					</h3>
				</Link>

				<div className="flex items-center gap-2 mt-1 flex-wrap text-xs md:text-md leading-none">
					<span className="font-light text-text">{tour.duration}</span>
					<span className="h-1.5 w-1.5 rounded-full bg-black" />
					<span className="font-light text-text">{getDisplayPrice(tour)}</span>
				</div>
			</div>
		</div>
	);
}
