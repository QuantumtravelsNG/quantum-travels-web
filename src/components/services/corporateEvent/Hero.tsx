import Image from "next/image";
// import Link from "next/link";

export default function Hero() {
	return (
		<div>
			<div className="relative h-[400px] w-full overflow-hidden md:h-[560px]">
				<Image
					src="/ourServices/corporateEvent/hero.jpg"
					alt="Corporate event planner walking with business partners."
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 text-white px-4 md:px-16">
					<div className="w-full max-w-6xl mx-auto px-4 md:px-16 space-y-2 pt-14 md:pt-40">
						<h2 className="text-2xl md:text-4xl font-bold text-balance leading-tight">
							Comprehensive event solutions covering strategy, planning, and
							flawless execution tailored to your business needs.
						</h2>
						<p className="text-xl w-full md:w-2/3 leading-normal">
							End-to-end event solutions designed to deliver seamless,
							well-coordinated, and impactful corporate experiences.
						</p>
					</div>
				</div>

				{/* <div className="absolute inset-0 bg-black/30 px-4 md:px-16">
					AS REQUESTED BY THE QUANTUM TRAVELS TEAM
					<div className="w-full max-w-6xl mx-auto flex flex-col items-start text-left py-10 md:py-20 my-auto h-fit">
            <h1 className="font-bold text-[24px] md:text-[44px] text-white leading-tight mb-4 w-2/3">
              Elevate Your Corporate Events With
              <br className="md:hidden" />
              Expert Planning & Precision
            </h1>

            <p className="font-light text-[16px] md:text-[22px] text-white leading-[1.8] max-w-[340px] md:max-w-6xl">
              Seamless solutions for corporate events
            </p>

            <Link
              href="/services/corporate-event/book"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-[50px] bg-white px-6 text-xs font-bold text-primary transition-colors hover:bg-white/90 active:scale-99 md:h-14 md:px-8 md:text-base"
            >
              Make Reservation
            </Link>
          </div>
				</div> */}
			</div>
		</div>
	);
}
