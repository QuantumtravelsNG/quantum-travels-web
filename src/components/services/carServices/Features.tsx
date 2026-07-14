const features = [
  {
    title: "Easy Online Booking",
    description:
      "Arrange your airport transfer quickly through a seamless and user-friendly system, designed to save time and reduce complexity.",
  },
  {
    title: "Professional Service",
    description:
      "We use reputable airport transfer service providers employing professional and reliable drivers.",
  },
  {
    title: "Free Cancellation",
    description:
      "If your plans change, you can cancel your reservation free of charge up to 48 hours before the scheduled pick up time.",
  },
];

export default function CarServicesFeatures() {
  return (
    <section className="w-full bg-primary">
      <div className="max-w-[1440px] px-4 md:px-16 py-8 md:py-16 flex flex-col md:flex-row mx-auto gap-6 md:gap-12">
        {features.map((feature, index) => (
          <div key={index} className="md:w-1/3 text-center text-white">
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="text-balance leading-normal">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
