import CarServicesAlternateRequestForm from "@/components/services/carServices/CarServicesAlternateRequestForm";

export const metadata = {
	title: "Airport Drop Off Request",
	description: "Request airport drop-off pricing from Quantum Travels.",
};

export default function CarServicesDropoffRequestPage() {
	return (
		<main className="min-h-screen w-full pt-15 md:pt-22 bg-[#F8F8F8]">
			<CarServicesAlternateRequestForm serviceType="airport_dropoff" />
		</main>
	);
}
