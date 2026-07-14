import CarServicesBookingForm from "@/components/services/carServices/CarServicesBookingForm";

export const metadata = {
  title: "Airport Drop Off Booking",
  description: "Confirm details and complete airport drop-off booking.",
};

export default function CarServicesDropoffBookPage() {
  return (
    <main className="min-h-screen w-full pt-15 md:pt-22 bg-[#F8F8F8]">
      <CarServicesBookingForm serviceType="airport_dropoff" />
    </main>
  );
}
