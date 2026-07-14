import PageCTA from "@/components/PageCTA";
import PageHero from "@/components/PageHero";
import Visas from "@/components/services/visa/Visas";

const hero = "/ourServices/visa/hero.jpg";

export const metadata = {
	title: "Visa Processing",
	description:
		"Explore visa processing services from Quantum Travels for smooth travel planning.",
};

export const revalidate = 300;

export default function OurServicesVisaPage() {
	return (
		<main className="w-full pt-15 md:pt-22">
			<div className="w-full mt-8 md:mt-10">
				<PageHero
					heading="Effortless Visa Processing Services Designed to Simplify Your Travel Plans"
					subheading="Quickly, Smoothly, and Without the Stress."
					image={hero}
				/>
			</div>
			<div className="px-4 md:px-16 max-w-[1440px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-2 md:mt-6 mb-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-[16px] md:text-[24px] font-bold text-text">
						Visa Processing
					</h2>
					<p className="text-[12px] md:text-[20px] font-light text-text">
						Entrust all required documents to our team and anticipate a seamless
						experience.
					</p>
				</div>
			</div>
			<Visas />
			<div className="mx-4 md:mx-16 my-10 md:my-16">
				<PageCTA
					title={"Want to know more about our visa processing service?"}
					subtitle="Ask us anything."
					btnVariant="light"
					btnLabel="Make an Enquiry"
					btnHref="/contact-us"
					image="/ourServices/visa/CTA.jpg"
					className="from-[#9E328A] to-[#D4A2C6]"
				/>
			</div>
		</main>
	);
}
