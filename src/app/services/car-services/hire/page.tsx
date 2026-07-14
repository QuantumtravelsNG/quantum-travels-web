import CarServicesHireForm from "@/components/services/carServices/CarServicesHireForm";

export const metadata = {
  title: "Car Hire Booking",
  description: "Confirm details and complete car hire booking.",
};

export default function CarServicesHirePage() {
  return (
    <main className="min-h-screen w-full pt-15 md:pt-22 bg-[#F8F8F8]">
      <CarServicesHireForm />
    </main>
  );
}
