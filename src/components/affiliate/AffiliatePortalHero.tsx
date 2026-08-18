import Image from "next/image";
import Link from "next/link";

export default function AffiliatePortalHero() {
	return (
		<section className="w-full bg-white" aria-label="Affiliate portal hero">
			<div className="relative isolate mx-auto min-h-[400px] overflow-hidden md:min-h-[600px]">
				<div className="absolute inset-0">
					<Image
						src="/affiliate/affiliateHero.jpg"
						alt="Aircraft parked on the tarmac"
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
					<div className="absolute inset-0" />
				</div>

				{/* <div
					aria-hidden="true"
					className="absolute left-[-131px] top-[-89px] h-[540px] w-[430px] rounded-r-full bg-primary md:left-[-230px] md:top-[-148px] md:h-[976px] md:w-[800px]"
				/> */}

				<div className="relative z-10 mx-auto flex min-h-[400px] max-w-[1440px] items-center px-5 md:min-h-[600px] md:px-29">
					<div className="max-w-[363px] text-white md:max-w-[720px]">
						<h1 className="text-4xl leading-tight font-bold md:text-[44px] md:leading-normal">
							Elevate Your Business With Quantum Travels
						</h1>

						<p className="mt-4 max-w-[360px] text-base leading-[1.5] font-light md:mt-3 md:max-w-[720px] md:text-[22px] md:leading-[1.8]">
							Partner with us to unlock new opportunities, expand your reach,
							and deliver exceptional travel experiences to your clients.
						</p>

						<Link
							href="/affiliate-portal/register"
							className="mt-6 inline-flex h-10 items-center justify-center rounded-[50px] bg-white px-6 text-xs font-bold text-primary transition-colors hover:bg-white/90 active:scale-99 md:mt-8 md:h-14 md:px-8 md:text-base"
						>
							Become an Affiliate
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
