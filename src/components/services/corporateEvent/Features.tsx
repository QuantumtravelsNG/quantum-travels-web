import FancyText from "@/components/FancyText";
import Image from "next/image";

const features = [
  {
    title: "End-to-End Coordination",
    description:
      "We manage every aspect of your event from planning and logistics to execution ensuring a seamless and well-coordinated experience.",
  },
  {
    title: "Time & Cost Efficiency",
    description:
      "Our structured approach and industry network help optimize costs while saving your team valuable time and resources.",
  },
  {
    title: "Professional Execution",
    description:
      "With experienced event specialists, we deliver polished, high-quality events that reflect your brand and meet your objectives.",
  },
];

export default function Features() {
  return (
    <section className="py-8 space-y-10">
      <FancyText
        backdrop="Work with us"
        foreground="enjoy corporate benefits"
      />
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 flex gap-10 items-center flex-col-reverse md:flex-row">
        <div className="space-y-8 w-full md:w-1/2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl overflow-hidden w-full col-span-1"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-black/80 md:text-balance text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Image
          src="/ourServices/corporateEvent/feature.jpg"
          alt="Corporate event planner walking with business partners."
          width={500}
          height={480}
          className="object-cover h-full w-full md:w-1/2 rounded-xl"
        />
      </div>
    </section>
  );
}
