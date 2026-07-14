import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TourCard from "@/components/TourCard";
import { getTourListKey, type TourPackage } from "@/lib/quantum";

export default function UltimateTravelExperience({
	tours,
}: {
	tours: TourPackage[];
}) {
	return (
		<section className="w-full py-10 bg-white">
			<div className="max-w-360 mx-auto px-4 md:px-16">
				<div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6 mb-8 md:mb-16">
					<h2 className="text-3xl md:text-5xl font-medium text-text text-center">
						The{" "}
						<span
							className="font-bold text-transparent bg-clip-text bg-cover bg-center"
							style={{ backgroundImage: "url('/home/ultimate-mask.jpg')" }}
						>
							Ultimate
						</span>
						<br />
						<span
							className="font-bold text-transparent bg-clip-text bg-cover bg-center"
							style={{ backgroundImage: "url('/home/travel-mask.jpg')" }}
						>
							Travel
						</span>{" "}
						Experience
					</h2>

					<Link
						href="/services/book-holiday/package-holiday"
						className="hidden md:block"
					>
						<Button variant="cta" size="cta">
							Find More Tours
							<ArrowRightCircle className="size-5" />
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-3 gap-y-5 md:gap-5">
					{tours.map((tour, index) => (
						<TourCard key={getTourListKey(tour, index)} tour={tour} />
					))}
				</div>

				<div className="flex justify-center mt-10 md:hidden">
					<Link href="/services/book-holiday/package-holiday">
						<Button variant="cta" size="cta-sm">
							Find More Tours
							<ArrowRightCircle className="size-4" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
