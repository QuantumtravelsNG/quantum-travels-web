import CorporateTravelHero from "@/components/services/CorporateTravelHero";
import CorporateTravelForm from "@/components/services/CorporateTravelForm";

export const metadata = {
	title: "Corporate Travel",
	description:
		"Manage business travel with Quantum Travels corporate travel services.",
};

export default function OurServicesCorporateTravelPage() {
	return (
		<main className="flex min-h-screen flex-col w-full pt-15 md:pt-22">
			<CorporateTravelHero />
			<CorporateTravelForm />
			<div className="w-full">
				<div className="max-w-[1440px] mx-auto">
					<p className="text-base md:text-3xl text-center leading-[150%] text-primary font-medium py-20 max-w-4xl text- mx-auto px-4">
						Whether for business or leisure, your journey with us goes beyond
						logistics, delivering efficient, seamless, and personalized travel
						solutions.
					</p>
				</div>
			</div>
		</main>
	);
}
