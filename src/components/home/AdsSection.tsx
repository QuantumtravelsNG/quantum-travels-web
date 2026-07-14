"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { isRemoteImage } from "@/lib/images";
import type { AdData } from "@/lib/rawdata";

export default function AdsSection({ ads }: { ads: AdData[] }) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const tape = Array(20).fill(ads).flat();

	const scrollLeft = () => {
		if (scrollRef.current) {
			const scrollAmount = window.innerWidth >= 768 ? 624 : 312;
			scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
		}
	};

	const scrollRight = () => {
		if (scrollRef.current) {
			const scrollAmount = window.innerWidth >= 768 ? 624 : 312;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (scrollRef.current) {
				const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
				const scrollAmount = window.innerWidth >= 768 ? 624 : 312;

				if (scrollLeft + clientWidth >= scrollWidth - 10) {
					scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
				} else {
					scrollRef.current.scrollBy({
						left: scrollAmount,
						behavior: "smooth",
					});
				}
			}
		}, 3500);

		return () => clearInterval(interval);
	}, []);

	if (ads.length === 0) return null;

	return (
		<section className="relative w-full py-6 md:py-10 bg-white overflow-hidden flex justify-center">
			<div className="absolute top-1/2 -translate-y-1/2 w-full max-w-360 px-4 lg:px-10 z-10 flex items-center justify-between pointer-events-none">
				<button
					onClick={scrollLeft}
					className="hidden md:flex size-[64px] bg-white rounded-full items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer pointer-events-auto"
				>
					<ArrowLeft className="size-6 text-text" strokeWidth={1.5} />
				</button>
				<button
					onClick={scrollRight}
					className="hidden md:flex size-[64px] bg-white rounded-full items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer pointer-events-auto"
				>
					<ArrowRight className="size-6 text-text" strokeWidth={1.5} />
				</button>
			</div>

			<div className="w-full max-w-[1920px] mx-auto">
				<div
					ref={scrollRef}
					className="flex gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory pt-4 pb-4 px-6 md:px-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
				>
					{tape.map((ad, index) => (
						<Link
							key={`${ad.id}-${index}`}
							href={ad.link}
							className="relative shrink-0 snap-center rounded-[10px] overflow-hidden w-[300px] h-[120px] md:w-[600px] md:h-[240px] hover:scale-102 hover:ring-primary transition-transform ease-linear"
						>
							<Image
								src={ad.image}
								alt={`Ad ${ad.id}`}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 300px, 600px"
								unoptimized={isRemoteImage(ad.image)}
							/>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
