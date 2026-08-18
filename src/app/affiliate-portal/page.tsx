import AffiliateGettingStarted from "@/components/affiliate/AffiliateGettingStarted";
import AffiliatePortalHero from "@/components/affiliate/AffiliatePortalHero";
import { PageCTAFull } from "@/components/PageCTA";

export const metadata = {
	title: "Affiliate Portal",
	description:
		"Partner with Quantum Travels to expand your reach and deliver exceptional travel experiences to your clients.",
};

export default function AffiliatePortalPage() {
	return (
		<main className="pt-15 md:pt-22">
			<AffiliatePortalHero />
			<AffiliateGettingStarted />
			<div className="px-4 pb-10 md:px-10 md:pb-16">
				<div className="mx-auto max-w-300">
					<PageCTAFull
						title="Want to Know More about Our Affiliate Programme?"
						subtitle="Ask us anything."
						image="/affiliate/affiliateCTAImage.jpg"
						btnVariant="primary"
						btnLabel="Make an Enquiry"
						btnHref="/contact-us"
						className="from-black to-[#7a7a7a]"
					/>
				</div>
			</div>
		</main>
	);
}
