import legalData from "../legal-content.json";

export const metadata = {
	title: "Cookie Policy",
	description: "Read the Quantum Travels cookie policy.",
};

export default function LegalCookiePolicyPage() {
	const policy = legalData["cookie-policy"];

	return (
		<main className="min-h-screen w-full bg-white pt-15 md:pt-22">
			<div className="mx-auto max-w-[1440px] px-4 md:px-16 py-20">
				<div className="max-w-4xl mx-auto">
					<div className="text-center md:text-left mb-8 border-b border-neutral-100 pb-6">
						<h1 className="text-[36px] leading-normal font-bold text-text md:text-[44px]">
							Cookie Policy
						</h1>
						<p className="text-xs md:text-sm font-medium text-neutral-400 mt-3 uppercase tracking-wide">
							{policy.updatedDate}
						</p>
					</div>

					<div className="space-y-10 mt-8">
						{policy.sections.map((section, idx) => (
							<div key={idx} className="space-y-5">
								<h2 className="text-xl md:text-[24px] font-bold text-text tracking-tight uppercase">
									{section.title}
								</h2>
								<div className="text-text/60 font-light leading-[1.8] text-base md:text-lg space-y-4">
									{section.paragraphs.map((p, pIdx) => (
										<p key={pIdx}>{p}</p>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
