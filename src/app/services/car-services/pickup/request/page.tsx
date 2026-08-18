import { redirect } from "next/navigation";

export const metadata = {
	title: "Airport Pick Up Request",
	description: "Request airport pick-up pricing from Quantum Travels.",
};

export default function CarServicesPickupRequestPage() {
	redirect("/services/car-services/pickup");
}
