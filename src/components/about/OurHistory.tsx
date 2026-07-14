import SectionBadge from "@/components/ui/SectionBadge";

export default function OurHistory() {
	return (
		<section className="w-full px-4 md:px-16 max-w-[1440px] mx-auto mt-10 md:mt-16">
			<div className="mb-8 md:mb-11">
				<SectionBadge label="Our History" />
			</div>

			<div className="text-text text-base md:text-xl leading-normal font-light max-w-360 mx-auto space-y-6">
				<p>
					Incorporated in 2003 and received its IATA accreditation in 2004. What
					began as a traditional travel agency during the era of manual
					ticketing evolved into one of Nigeria&apos;s leading Travel Management
					Companies, recognized for delivering seamless travel solutions and
					exceptional customer service.
				</p>

				<p>
					Over the years, we expanded beyond ticketing to offer a comprehensive
					range of travel management services, including corporate travel
					management, visa advisory and support, travel insurance, accommodation
					bookings, airport assistance, and traveller security tracking. Our
					goal has always been to simplify travel while providing clients with
					the confidence and support they need at every stage of their journey.
				</p>

				<p>
					A major milestone in our growth came in 2009 when we established an
					exclusive partnership with BCD Travel, one of the world&apos;s leading
					Travel Management Companies. This partnership led to the establishment
					of BCD Travel Nigeria, strengthening our ability to deliver
					world-class corporate travel solutions to businesses across various
					industries.
				</p>

				<p>
					Today, Quantum Travels has grown into a trusted travel partner with
					offices across Nigeria and dedicated travel teams embedded within
					client organizations. Through innovation, industry expertise, and a
					commitment to excellence, we continue to help individuals and
					businesses achieve their travel goals with ease, efficiency, and peace
					of mind.
				</p>
			</div>
		</section>
	);
}
