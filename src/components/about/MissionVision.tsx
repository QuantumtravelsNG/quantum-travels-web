import Image from "next/image";

const STATS = [
	{
		value: "100K+",
		label: "Happy Travelers",
		icon: "/about/happyTravellers.svg",
		bg: "bg-[#9e328a]",
		valueColor: "text-white",
		labelColor: "text-white",
	},
	{
		value: "100k+",
		label: "Tours Success",
		icon: "/about/tourSuccess.svg",
		bg: "bg-[#f9f9f9]",
		valueColor: "text-[#9e328a]",
		labelColor: "text-text",
	},
	{
		value: "97.5%",
		label: "Positive Review",
		icon: "/about/positiveReview.svg",
		bg: "bg-[#feef60]",
		valueColor: "text-text",
		labelColor: "text-text",
	},
	{
		value: "150+",
		label: "Travel Guide",
		icon: "/about/travelGuide.svg",
		bg: "bg-[#c2ffc2]",
		valueColor: "text-text",
		labelColor: "text-text",
	},
];

function StatCard({
	value,
	label,
	icon,
	bg,
	valueColor,
	labelColor,
}: (typeof STATS)[0]) {
	return (
		<div
			className={`${bg} rounded-md shadow-[0px_1px_6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center gap-1 py-6 px-4 flex-1 min-w-0`}
		>
			<div className="relative size-14 mb-1">
				<Image src={icon} alt="" fill className="object-contain" sizes="56px" />
			</div>
			<span className={`text-2xl font-extrabold leading-snug ${valueColor}`}>
				{value}
			</span>
			<span className={`text-base font-light leading-snug ${labelColor}`}>
				{label}
			</span>
		</div>
	);
}

export default function MissionVision() {
	return (
		<section className="mt-10 md:mt-16 px-4 md:px-16 max-w-[1440px] mx-auto">
			<div className="hidden md:flex items-start gap-8">
				<div className="relative shrink-0 w-73 h-91.5 rounded-xl overflow-hidden">
					<Image
						src="/about/missionVisionImage.jpg"
						alt="Traveller relaxing in a lounge"
						fill
						className="object-cover"
						sizes="292px"
					/>
				</div>

				<div className="flex-1 min-w-0">
					<h2 className="text-[#9e328a] text-4xl font-bold leading-normal text-right mb-3">
						Our Mission
					</h2>
					<p className="text-text text-base md:text-xl font-light leading-normal mb-6">
						To deliver unparalleled travel experiences by harnessing data driven
						insight, delivering exceptional customer service and promoting
						sustainable travel practices.
					</p>

					<h2 className="text-[#9e328a] text-4xl font-bold leading-normal mb-3">
						Our Vision
					</h2>
					<p className="text-text text-base md:text-xl font-light leading-normal">
						To be the African leader in delivering exceptional and seamless
						travel experiences, leveraging our local expertise, dedication to
						excellence and a relentless pursuit of customer delight.
					</p>
				</div>

				<div className="shrink-0 grid grid-cols-2 gap-3 w-82">
					{STATS.map((s) => (
						<StatCard key={s.label} {...s} />
					))}
				</div>
			</div>

			<div className="flex flex-col md:hidden gap-6">
				<div className="relative w-full h-100 md:h-60 rounded-lg overflow-hidden">
					<Image
						src="/about/missionVisionImage.jpg"
						alt="Traveller relaxing in a lounge"
						fill
						className="object-cover"
						sizes="100vw"
					/>
				</div>

				<div>
					<h2 className="text-[#9e328a] text-2xl font-bold leading-normal text-right mb-2">
						Our Mission
					</h2>
					<p className="text-text text-base font-light leading-normal mb-5">
						To deliver unparalleled travel experiences by harnessing data driven
						insight, delivering exceptional customer service and promoting
						sustainable travel practices.
					</p>

					<h2 className="text-[#9e328a] text-2xl font-bold leading-normal mb-2">
						Our Vision
					</h2>
					<p className="text-text text-base font-light leading-normal">
						To be the African leader in delivering exceptional and seamless
						travel experiences, leveraging our local expertise, dedication to
						excellence and a relentless pursuit of customer delight.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3">
					{STATS.map((s) => (
						<StatCard key={s.label} {...s} />
					))}
				</div>
			</div>
		</section>
	);
}
