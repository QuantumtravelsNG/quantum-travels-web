import CarServicesSelection from "@/components/services/carServices/CarServicesSelection";

export const metadata = {
	title: "Airport Drop Off",
	description: "Complete your Quantum Travels airport drop-off reservation.",
};

export default function CarServicesDropoffPage() {
	return (
		<main className="min-h-screen w-full pt-15 md:pt-22 bg-white">
			<CarServicesSelection serviceType="airport_dropoff" />
		</main>
	);
}
