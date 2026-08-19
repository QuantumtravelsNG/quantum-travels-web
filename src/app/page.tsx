import FancyText from "@/components/FancyText";
import Hero from "@/components/home/Hero";
import ServicesBar from "@/components/home/ServicesBar";
import UltimateTravelExperience from "@/components/home/UltimateTravelExperience";
import DiscoverBySea from "@/components/home/DiscoverBySea";
// import AdsSection from "@/components/home/AdsSection";
// import ArriveLikeAVIP from "@/components/home/Arrival";
import ProvidersCarousel from "@/components/home/ProvidersCarousel";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getFeaturedTourPackages, getHomepageData } from "@/lib/quantum-api";

export const metadata = {
	title: "Home",
	description:
		"Plan corporate travel, holidays, visa processing, events, and car services with Quantum Travels.",
};

export const revalidate = 300;

export default async function HomePage() {
	const [homepage, featuredTours] = await Promise.all([
		getHomepageData(),
		getFeaturedTourPackages(),
	]);

	return (
		<main>
			<Hero
				image={homepage.heroSection}
				mobileImage={homepage.heroSectionMobile}
			/>
			<div className="py-6 md:py-10" id="explore">
				<FancyText
					backdrop="Travel the right way"
					foreground="The quantum advantage"
				/>
			</div>
			<ServicesBar />
			{featuredTours.length > 0 && (
				<UltimateTravelExperience tours={featuredTours} />
			)}
			<DiscoverBySea />
			{/* <AdsSection ads={homepage.ads} /> */}
			{/* <ArriveLikeAVIP /> */}
			<NewsletterSection />
			<ProvidersCarousel />
		</main>
	);
}
