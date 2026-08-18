import { redirect } from "next/navigation";

export const metadata = {
	title: "Airport Drop Off Request",
	description: "Request airport drop-off pricing from Quantum Travels.",
};

export default function CarServicesDropoffRequestPage() {
	redirect("/services/car-services/dropoff");
}
