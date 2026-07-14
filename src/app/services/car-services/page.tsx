import { Suspense } from "react";
import PageCTA from "@/components/PageCTA";
import CarServicesHero from "@/components/services/carServices/CarServicesHero";
import CarServicesIntro from "@/components/services/carServices/CarServicesIntro";
import CarServicesSteps from "@/components/services/carServices/CarServicesSteps";
import CarServicesFeatures from "@/components/services/carServices/Features";
import PaymentStatusDetector from "@/components/services/carServices/PaymentStatusDetector";

export const metadata = {
  title: "Car Services",
  description:
    "Reserve car hire, airport pickup, and airport drop-off services with Quantum Travels.",
};

export default function CarServicesPage() {
  return (
    <main className="min-h-screen w-full">
      <CarServicesHero />
      <CarServicesIntro />
      <CarServicesSteps />
      <CarServicesFeatures />
      <div className="mx-4 md:mx-16 my-10 md:my-16">
        <PageCTA
          title={
            "Want to know more about our car hire and airport transfer services?"
          }
          subtitle="Ask us anything."
          btnVariant="light"
          btnLabel="Make an Enquiry"
          btnHref="/contact-us"
          image="/ourServices/carServices/carServicesCTA.jpg"
          className="from-[#9E328A] to-[#D4A2C6]"
        />
      </div>
      <Suspense>
        <PaymentStatusDetector />
      </Suspense>
    </main>
  );
}

