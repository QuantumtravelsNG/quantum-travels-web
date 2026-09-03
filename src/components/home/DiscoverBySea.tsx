import Image from "next/image";
import Link from "next/link";

export default function DiscoverBySea() {
	return (
		<section className="relative w-full h-auto overflow-hidden max-w-[1920px] mx-auto">
			{/* <Image
				src="/home/discoverSection.jpg"
				alt="Discover the world by sea"
				className="object-fill w-full h-auto"
				height={680}
				width={1440}
				priority
			/> */}
			<div className="absolute inset-0">
				<Image
					src="/home/discoverSection.jpg"
					alt="Discover the world by sea"
					className="object-cover"
					fill
					sizes="100vw"
					priority
				/>
				{/* <div className="absolute inset-0 bg-black/40" /> */}
			</div>

			<div className="relative h-full max-w-360 mx-auto px-6 md:px-20 py-25 md:py-50 md:aspect-[1440/640]">
				<div className="text-white flex flex-col items-start ">
					{/* <h2 className="font-bold text-2xl md:text-5xl leading-tight mb-4 uppercase tracking-wide">
						<span className="block md:inline">Discover The World</span>{" "}
						<span className="block md:inline">By Sea</span>
					</h2>
					<p className="font-medium text-sm md:text-xl leading-[1.8] max-w-[280px] md:max-w-none">
						Thoughtfully designed journeys that reveal more than
						<br className="hidden md:block" /> destinations.
					</p> */}
					{/* <div className="mt-6 md:mt-8"> */}
					<div className="mt-16 md:mt-8">
						<Link
							href="/services/book-holiday/cruises"
							className="inline-flex h-[38px] items-center justify-center rounded-[9999px] bg-[#9E328A] px-8 text-xs font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/50 md:h-[56px] md:px-8 md:text-base"
						>
							Explore
						</Link>
					</div>
				</div>

				{/* <div className="mt-4 md:mt-8 flex items-center gap-[24px] md:gap-[54px]">
					<Image
						src="/home/royal carribean logo.svg"
						alt="Royal Caribbean"
						width={130}
						height={58}
						className="w-[72px] h-[32px] md:w-[130px] md:h-[58px] object-contain"
					/>
					<Image
						src="/home/msc cruise logo.svg"
						alt="MSC Cruises"
						width={130}
						height={58}
						className="w-[72px] h-[32px] md:w-[130px] md:h-[58px] object-contain"
					/>
					<Image
						src="/home/disney cruise line logo.svg"
						alt="Disney Cruise Line"
						width={130}
						height={58}
						className="w-[72px] h-[32px] md:w-[130px] md:h-[58px] object-contain"
					/>
				</div> */}
			</div>
		</section>
	);
}
