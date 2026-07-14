import Image from "next/image";
import FancyText from "../../FancyText";

const steps = [
	{
		title: "Enter Booking Details",
		description:
			"Share your trip details and preferences, allowing us to tailor every aspect of your transportation needs.",
	},
	{
		title: "Make Payment",
		description:
			"Complete your reservation with ease using our secure payment process, ensuring a fast and hassle-free confirmation.",
	},
	{
		title: "Enjoy Your Ride",
		description:
			"Sit back and enjoy a comfortable, and professionally managed journey, with timely pickups and a smooth travel experience.",
	},
];

function ImageMask() {
	return (
		<div className="relative w-full h-[480px]">
			<Image
				src="/ourServices/carServices/carServiceSteps.jpg"
				alt=""
				fill
				sizes="(max-width: 768px) 100vw, 40vw"
				className="object-cover image-mask"
			/>
		</div>
	);
}

export default function CarServicesSteps() {
	return (
		<div className="max-w-[1440px] mx-auto px-4 md:px-16 py-10 md:space-y-10">
			<FancyText backdrop="how it works" foreground="follow 3 simple steps" />
			<div className="flex md:gap-12 items-center flex-col md:flex-row w-fit mx-auto">
				<div className="w-full md:w-2/5">
					<ImageMask />
				</div>

				<div className="w-full md:w-3/5 space-y-2">
					{steps.map((step, index) => (
						<div
							key={index}
							className="flex md:px-12 md:py-5 md:border-primary md:border-l-4"
						>
							<div className="w-full">
								<h3 className="text-2xl font-semibold">{step.title}</h3>
								<p className="text-gray-600 text-balance leading-normal">
									{step.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
