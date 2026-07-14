import Image from "next/image";
import SectionBadge from "@/components/ui/SectionBadge";

const BENEFITS = [
	{
		description:
			"Earn attractive commissions for every completed booking made through your unique tracking link.",
		icon: "/affiliate/benefits/attractiveCommisions.svg",
	},
	{
		description:
			"Access dedicated affiliate support to guide you throughout your journey and help you uncover new growth opportunities.",
		icon: "/affiliate/benefits/affliateSupport.svg",
	},
	{
		description:
			"Benefit from region-specific and high-converting marketing campaigns, designed to engage diverse audiences across multiple languages.",
		icon: "/affiliate/benefits/regionSpecificBenefits.svg",
	},
	{
		description:
			"Enjoy exclusive partnership opportunities and performance-based incentives designed to maximize the success of our affiliate collaboration.",
		icon: "/affiliate/benefits/exclusivePartnerships.svg",
	},
];

export default function AffiliateGettingStarted() {
	return (
		<section
			className="w-full bg-white px-[15px] py-10 md:px-10 md:py-16"
			aria-label="Getting started"
		>
			<div className="mx-auto max-w-[1361px]">
				<div className="flex justify-center">
					<SectionBadge label="Getting Started" />
				</div>

				<div className="mt-8 md:mt-[54px]">
					<h2 className="max-w-[373px] text-[20px] leading-[1.5] font-black text-text md:max-w-none md:text-[32px] md:leading-normal">
						Partner With One Of The Leading Travel Company In The World
					</h2>

					<p className="mt-4 text-base leading-[1.5] font-light text-text md:mt-[22px] md:max-w-[1360px] md:text-2xl">
						Join our affiliate network and grow your business by offering
						seamless travel solutions backed by our expertise and global
						partnerships. As a partner, you gain access to a wide range of
						travel services, dedicated support, and opportunities to expand your
						offerings while delivering exceptional value and experiences to your
						clients. Together, we can create meaningful travel opportunities and
						drive sustainable growth for your business.
					</p>
				</div>

				<div className="mt-9 md:mt-[42px]">
					<h3 className="max-w-[317px] text-[16px] leading-[1.5] font-black text-text md:max-w-none md:text-2xl md:leading-normal">
						Why Join The Quantum Travels Affiliate Programme?
					</h3>

					<div className="mt-4 grid grid-cols-2 gap-2 md:mt-[31px] md:grid-cols-4 md:gap-6">
						{BENEFITS.map((benefit) => (
							<div
								key={benefit.description}
								className="rounded-[5px] bg-[#f9f9f9] px-[14px] py-6 md:min-h-[300px] md:px-[17px] md:py-[43px]"
							>
								<div className="relative mb-6 h-8 w-8 md:mb-6 md:h-[72px] md:w-[72px]">
									<Image
										src={benefit.icon}
										alt=""
										fill
										className="object-contain"
										sizes="(min-width: 768px) 72px, 32px"
									/>
								</div>

								<p className="text-[14px] leading-[1.5] font-light text-text md:text-[20px]">
									{benefit.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
