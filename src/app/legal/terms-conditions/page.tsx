import LegalAccordion from "@/components/legal/LegalAccordion";
import legalData from "../legal-content.json";

export const metadata = {
	title: "Terms & Conditions",
	description: "Read the Quantum Travels terms and conditions.",
};

export default function LegalTermsConditionsPage() {
	const policy = legalData["terms-conditions"];

	return (
		<main className="min-h-screen w-full bg-white pt-15 md:pt-22">
			<div className="mx-auto max-w-[1440px] px-4 md:px-16 py-20">
				<div className="max-w-4xl mx-auto">
					<div className="text-center md:text-left mb-8 border-b border-neutral-100 pb-8">
						<h1 className="text-[36px] leading-normal font-bold text-text md:text-[44px]">
							{policy.title}
						</h1>
						<p className="text-xs md:text-sm font-medium text-neutral-400 mt-3 uppercase tracking-wide">
							{policy.updatedDate}
						</p>

						<div className="mt-8 text-text/60 font-light leading-[1.8] text-sm md:text-lg space-y-4 max-w-3xl">
							{policy.intro.map((para, idx) => (
								<p key={idx}>{para}</p>
							))}
						</div>
					</div>

					<LegalAccordion sections={policy.sections} />
				</div>
			</div>
		</main>
	);
}
