import Image from "next/image";
// import Link from "next/link";

export default function ArriveLikeAVIP() {
	return (
		<section className="relative w-full h-auto overflow-hidden max-w-[1920px] mx-auto">
			{/* AS REQUESTED BY THE QUANTUM TRAVELS TEAM */}
			{/* <Image
				src="/home/likeAVIP.jpg"
				alt="Arrive like a VIP"
				className="object-fill w-full h-auto"
				height={680}
				width={1440}
				priority
			/> */}
			<div className="absolute inset-0">
				<Image
					src="/home/likeAVIP.jpg"
					alt="Arrive like a VIP"
					fill
					className="object-cover"
					sizes="100vw"
					priority
				/>

				<div className="absolute inset-0 bg-black/40" />
			</div>

			<div className="relative h-full max-w-360 mx-auto px-6 md:px-20">
				<div className="text-white flex flex-col items-start py-25 md:py-50">
					<h2 className="font-bold text-2xl md:text-5xl leading-tight mb-4 uppercase tracking-wide">
						<span className="block md:inline">Arrive like a VIP</span>{" "}
					</h2>
					<p className="font-medium text-sm md:text-xl leading-[1.8] max-w-[280px] md:max-w-none">
						Airport Pick Up & Drop Offs • Ground Transportation • Additional
						Security upon request
					</p>
					<div className="mt-6 md:mt-8">
						{/* <Link
							href="/services/car-services"
							className="inline-flex h-[38px] items-center justify-center rounded-[9999px] bg-[#9E328A] px-8 text-xs font-bold text-white transition-colors hover:bg-[#8a2b78] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/50 md:h-[56px] md:px-8 md:text-base"
						>
							Book Now
						</Link> */}
					</div>
				</div>
			</div>
		</section>
	);
}
