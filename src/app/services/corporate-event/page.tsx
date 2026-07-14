import PageCTA from "@/components/PageCTA";
import EventTypes from "@/components/services/corporateEvent/EventTypes";
import Features from "@/components/services/corporateEvent/Features";
import Hero from "@/components/services/corporateEvent/Hero";

export const metadata = {
  title: "Corporate Event",
  description:
    "Plan conferences, conventions, product launches, exhibitions, and corporate events with Quantum Travels.",
};

export default function OurServicesCorporateEventsPage() {
  return (
    <main className="min-h-screen w-full pt-15 md:pt-22">
      <Hero />
      <EventTypes />
      <Features />
      <div className="mx-4 md:mx-16 my-10 md:my-16">
        <PageCTA
          title={"Want to know more about our corporate event service?"}
          subtitle="Ask us anything."
          btnVariant="light"
          btnLabel="Make an Enquiry"
          btnHref="/contact-us"
          image="/ourServices/corporateEvent/CTA.jpg"
          className="from-[#9E328A] to-[#D4A2C6]"
        />
      </div>
    </main>
  );
}
