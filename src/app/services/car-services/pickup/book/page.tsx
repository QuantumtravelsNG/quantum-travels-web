import CarServicesBookingForm from "@/components/services/carServices/CarServicesBookingForm";

export const metadata = {
  title: "Airport Pick Up Booking",
  description: "Confirm details and complete airport pick-up booking.",
};

export default function CarServicesPickupBookPage() {
  return (
    <main className="min-h-screen w-full pt-15 md:pt-22 bg-[#F8F8F8]">
      <CarServicesBookingForm serviceType="airport_pickup" />
    </main>
  );
}
