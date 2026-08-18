import Image from "next/image";
import CarServicesReservationForm from "@/components/services/carServices/CarServicesReservationForm";

export default function CarServicesHero() {
	return (
		<section className="relative">
			<div className="relative h-[400px] w-full overflow-hidden md:h-[560px]">
				<Image
					src="/ourServices/carServices/carServicesHero.jpg"
					alt="Passenger stepping out of a chauffeured vehicle"
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-black/30" />

				<div className="absolute inset-x-0 top-[08px] z-10 mx-auto w-full max-w-[1120px] px-6 text-center text-white md:top-[138px] md:px-8">
					<h1 className="mt-40 md:mt-10 mx-auto max-w-[960px] text-[24px] leading-[1.1] font-bold md:text-[44px] md:leading-[1.08]">
						Book Your Premium Airport Transfers & Car Hire Services
					</h1>
				</div>
			</div>

			<div
				id="car-services-reservation"
				className="relative z-20 mx-auto -mt-[78px] w-full max-w-[1320px] scroll-mt-24 px-4 md:px-8 lg:-mt-[96px]"
			>
				<CarServicesReservationForm variant="hero" />
			</div>
		</section>
	);
}
