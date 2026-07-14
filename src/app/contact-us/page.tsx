import ContactUsContent from "@/components/contact/ContactUsContent";

export const metadata = {
	title: "Contact Us",
	description:
		"Contact Quantum Travels for travel enquiries, bookings, corporate travel, holidays, and support.",
};

export default function ContactUsPage() {
	return (
		<main className="w-full pt-15 md:pt-22">
			<ContactUsContent />
		</main>
	);
}
