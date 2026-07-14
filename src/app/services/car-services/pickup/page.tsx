import CarServicesSelection from "@/components/services/carServices/CarServicesSelection";

export const metadata = {
	title: "Airport Pick Up",
	description: "Complete your Quantum Travels airport pick-up reservation.",
};

export default function CarServicesPickupPage() {
	return (
		<main className="min-h-screen w-full pt-15 md:pt-22 bg-white">
			<CarServicesSelection serviceType="airport_pickup" />
		</main>
	);
}
