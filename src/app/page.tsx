import FancyText from "@/components/FancyText";
import Hero from "@/components/home/Hero";
import ServicesBar from "@/components/home/ServicesBar";
import UltimateTravelExperience from "@/components/home/UltimateTravelExperience";
import DiscoverBySea from "@/components/home/DiscoverBySea";
import AdsSection from "@/components/home/AdsSection";
import ArriveLikeAVIP from "@/components/home/Arrival";
import ProvidersCarousel from "@/components/home/ProvidersCarousel";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getHomepageData } from "@/lib/quantum-api";

export const metadata = {
	title: "Home",
	description:
		"Plan corporate travel, holidays, visa processing, events, and car services with Quantum Travels.",
};

export const revalidate = 300;

export default async function HomePage() {
	const homepage = await getHomepageData();

	return (
		<main>
			<Hero image={homepage.heroSection} heroUrl={homepage.heroURL} />
			<div className="py-6 md:py-10" id="explore">
				<FancyText
					backdrop="Travel the right way"
					foreground="The quantum way"
				/>
			</div>
			<ServicesBar />
			<UltimateTravelExperience tours={homepage.holidayPackages} />
			<DiscoverBySea />
			<AdsSection ads={homepage.ads} />
			<ArriveLikeAVIP />
			<NewsletterSection />
			<ProvidersCarousel />
		</main>
	);
}
