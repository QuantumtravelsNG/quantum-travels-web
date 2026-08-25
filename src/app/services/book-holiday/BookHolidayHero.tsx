"use client";

import { usePathname } from "next/navigation";
import PageHero from "@/components/PageHero";

export default function BookHolidayHero() {
	const pathname = usePathname();

	let image = null;

	if (pathname.includes("cruises")) {
		image = "/ourServices/book-holiday/cruiseHeroImage.jpg";
	} else if (pathname.includes("package-holiday")) {
		image = "/ourServices/book-holiday/packageHolidayHeroImage.jpg";
	}

	if (!image) {
		return null;
	}

	return (
		<div className="mt-8 md:mt-10">
			<PageHero
				heading={
					"Discover The Best \nTours & Experience\nTravel Like Never\nBefore"
				}
				subheading="We ensure your vacation is unforgettable."
				image={image}
			/>
		</div>
	);
}
