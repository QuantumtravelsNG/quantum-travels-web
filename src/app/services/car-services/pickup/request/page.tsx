import CarServicesAlternateRequestForm from "@/components/services/carServices/CarServicesAlternateRequestForm";

export const metadata = {
	title: "Airport Pick Up Request",
	description: "Request airport pick-up pricing from Quantum Travels.",
};

export default function CarServicesPickupRequestPage() {
	return (
		<main className="min-h-screen w-full pt-15 md:pt-22 bg-[#F8F8F8]">
			<CarServicesAlternateRequestForm serviceType="airport_pickup" />
		</main>
	);
}
