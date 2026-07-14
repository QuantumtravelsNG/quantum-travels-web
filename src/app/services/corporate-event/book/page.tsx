import CorporateEventBookingForm from "@/components/services/corporateEvent/CorporateEventBookingForm";

export const metadata = {
  title: "Corporate Event Reservation",
  description:
    "Reserve corporate event planning services with Quantum Travels.",
};

export default function CorporateEventBookPage() {
  return (
    <main className="min-h-screen w-full pt-15 md:pt-22">
      <CorporateEventBookingForm />
    </main>
  );
}
