import OurServices from "@/components/ourServices/OurServices";
import ServicesHero from "@/components/ourServices/ServicesHero";
import WhyQuantumTravels from "@/components/ourServices/WhyQuantumTravels";

export const metadata = {
  title: "Our Services",
  description:
    "Explore Quantum Travels services, including corporate travel, visa processing, holidays, events, and car services.",
};

export default function OurServicesPage() {
  return (
    <main className="pt-15 md:pt-22">
      <ServicesHero />
      <OurServices />
      <WhyQuantumTravels />
    </main>
  );
}
