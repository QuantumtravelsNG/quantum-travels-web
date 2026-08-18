import Image from "next/image";
import { Button } from "@/components/ui/button";
import { isRemoteImage } from "@/lib/images";
import Link from "next/link";

export default function Hero({
	image,
	mobileImage,
	bannerText,
}: {
	image: string;
	mobileImage: string;
	bannerText: string;
}) {
	return (
		<section className="relative mx-auto w-full max-w-[1920px] overflow-hidden">
			{/* max-h-[400px] md:max-h-[640px] 
			
			<Image
				src={image}
				alt="Quantum Travels Homepage hero image."
				className="object-fill w-full h-auto"
				height={680}
				width={1440}
				priority
				unoptimized={isRemoteImage(image)}
			/>
			*/}
			<div className="relative w-full md:aspect-[1440/680] md:min-h-[600px]">
				<Image
					src={mobileImage}
					alt="Quantum Travels Homepage hero image."
					className="h-auto w-full object-cover md:hidden"
					height={600}
					width={440}
					priority
					unoptimized={isRemoteImage(mobileImage)}
				/>
				<Image
					src={image}
					alt="Quantum Travels Homepage hero image."
					className="hidden object-cover md:block"
					fill
					priority
					sizes="100vw"
					unoptimized={isRemoteImage(image)}
				/>
			</div>

			<div className="absolute inset-0 z-10 flex items-center">
				<div className="mx-auto w-full max-w-360 px-8 md:px-[137px]">
					{bannerText ? (
						<h1 className="mb-8 whitespace-pre-line text-2xl leading-snug font-bold text-text md:text-[44px] md:leading-tight">
							{bannerText}
						</h1>
					) : null}

					<Link href="#explore" className="inline-block">
						<Button variant="default" size="hero" className="md:block hidden">
							Explore
						</Button>
						<Button variant="default" size="hero-sm" className="md:hidden">
							Explore
						</Button>
					</Link>
				</div>
			</div>

			{/* AS REQUESTED BY THE QUANTUM TRAVELS TEAM */}
			{/* <div className="relative z-10 w-full max-w-360 mx-auto px-8 md:px-[137px]">
				<h1 className="text-2xl md:text-[44px] font-bold text-white leading-snug md:leading-tight mb-4">
					World-Class Corporate
					<br className="hidden md:block" />
					<span className="md:hidden">{" & "}</span>
					<span className="hidden md:inline">{" & "}</span>
					Leisure Travel
				</h1>

				<p className="text-base md:text-2xl font-light text-white leading-relaxed mb-8 max-w-3xl">
					Corporate Travel • Leisure Trips • Airport Transfers
					<span className="hidden md:inline"> • </span>
					<span className="md:hidden">
						<br />•{" "}
					</span>
					Corporate Events
					<span className="hidden md:inline"> • </span>
					<span className="md:hidden"> • </span>
					One Seamless Experience.
				</p>

				<Link href="#explore" className="inline-block">
					<Button variant="hero" size="hero" className="md:block hidden">
						Explore
					</Button>
					<Button variant="hero" size="hero-sm" className="md:hidden">
						Explore
					</Button>
				</Link>
			</div> */}
		</section>
	);
}
