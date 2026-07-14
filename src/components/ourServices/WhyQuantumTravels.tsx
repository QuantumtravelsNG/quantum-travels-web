import Image from "next/image";
import FancyText from "@/components/FancyText";

const WHY_QUANTUM_POINTS = [
  {
    title: "Worldwide Coverage",
    description:
      "Global coverage via the BCD Travel Platform: We are present in 98 countries across 6 continents. We give you local service with global reach.",
  },
  {
    title: "Competitive Pricing",
    description: "Lowest Fare Guarantee",
  },
  {
    title: "Best Support 24/7",
    description:
      "Proven Track Record of Success: recognition from suppliers and clients",
  },
];

export default function WhyQuantumTravels() {
  return (
    <section
      className="w-full bg-white px-4 py-10 md:px-16  md:py-18 max-w-[1440px] mx-auto"
      aria-label="Why Quantum Travels"
    >
      <div className="w-full">
        <FancyText
          backdrop="Travel With Quantum"
          foreground="Why Quantum Travels"
        />

        <div className="mt-7 flex flex-col gap-6 md:mt-10 md:grid md:grid-cols-[1fr_500px] md:items-start md:gap-16">
          <div className="order-2 space-y-8 md:order-1 md:space-y-14 md:pt-[71px]">
            {WHY_QUANTUM_POINTS.map((point) => (
              <div key={point.title}>
                <h2 className="text-[18px] leading-normal font-bold text-text md:text-2xl">
                  {point.title}
                </h2>
                <p className="mt-3 text-base leading-[1.5] font-light text-text md:mt-4 md:max-w-[640px] md:text-xl">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          <div className="order-1 md:order-2">
            <div className="relative h-[240px] overflow-hidden rounded-[5px] md:h-[480px] md:rounded-[10px]">
              <Image
                src="/ourServices/whyQuantumImage.jpg"
                alt="Suitcases near an airport window with an airplane taking off"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 500px, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
