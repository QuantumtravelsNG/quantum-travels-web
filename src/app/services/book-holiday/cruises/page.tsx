import EmptyState from "@/components/EmptyState";
import TourCard from "@/components/TourCard";
import PageHero from "@/components/PageHero";
import BookHolidayTabs from "@/app/services/book-holiday/BookHolidayTabs";
import { getTourPackages } from "@/lib/quantum-api";
import { getTourListKey } from "@/lib/quantum";

export const metadata = {
	title: "Cruises",
	description: "Explore cruise packages and experiences from Quantum Travels.",
};

export const revalidate = 300;

export default async function CruisesPage() {
	const cruises = await getTourPackages("cruise");

	return (
		<div className="flex flex-col pb-10 md:pb-16">
			<div className="mb-4 mt-8 max-w-[1440px] mx-auto w-full md:mb-10 md:mt-10">
				<PageHero
					heading={
						"Discover The Best \nTours & Experience\nTravel Like Never\nBefore"
					}
					subheading="We ensure your vacation is unforgettable."
					image="/ourServices/book-holiday/cruiseHeroImage.jpg"
				/>
			</div>

			<BookHolidayTabs />

			<div className="flex-1 mt-6">
				{cruises.length === 0 ? (
					<section className="px-4 md:px-16 max-w-[1440px] mx-auto">
						<EmptyState />
					</section>
				) : (
					<section className="px-4 md:px-16 max-w-[1440px] mx-auto">
						<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
							{cruises.map((tour, index) => (
								<TourCard key={getTourListKey(tour, index)} tour={tour} />
							))}
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
