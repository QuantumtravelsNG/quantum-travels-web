import Image from "next/image";

interface ServiceCard {
  title: string;
  items: string[];
  image: string;
  side: "left" | "right";
}

const SERVICES: ServiceCard[] = [
  {
    title: "Corporate Travel\nManagement",
    items: [
      "Account management",
      "Management Information system (MIS) Reporting",
      "Decision Source: Security Manager",
      "Vendor Negotiation",
      "Meetings, Incentives, Conferences and Events (M.I.C.E)",
    ],
    image: "/ourServices/corporateTravelManagement.jpg",
    side: "right",
  },
  {
    title: "Flight Services",
    items: [
      "Reservation and Electronic Ticketing",
      "Ticket Rerouting, Reconfirmation and Endorsement",
      "Lost Baggage Tracking and Handling",
    ],
    image: "/ourServices/flightServices.jpg",
    side: "left",
  },
  {
    title: "Travel Related\nServices",
    items: [
      "Hotel Reservations",
      "Car Reservation and Hire",
      "International Driver's License Procurement",
      "Travel or Health Insurance",
      "Visa Assistance and Processing",
    ],
    image: "/ourServices/travelRelatedServices.jpg",
    side: "right",
  },
  {
    title: "Executive Card\nProgramme Management",
    items: [
      "Processing of Miles redemption and free Tickets",
      "Priority on seat confirmation on full flights",
      "Access to Airline Business Lounges worldwide",
      "Vendor Priority at check in regardless of class of travel",
    ],
    image: "/ourServices/executiveCardProgramme.jpg",
    side: "left",
  },
  {
    title: "Quantum Training\nProgramme",
    items: [
      "Giving back to the community by providing training to help build budding careers.",
    ],
    image: "/ourServices/quantumTrainingProgram.jpg",
    side: "right",
  },
];

const clipStyles = `
  .clip-right {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 24%, 5% 17%, 0 10%);
  }
  .clip-left {
    clip-path: polygon(0 0, 100% 0, 100% 10%, 95% 17%, 100% 24%, 100% 100%, 0 100%);
  }
`;

function ServicePanel({ title, items, image, side }: ServiceCard) {
  const isRight = side === "right";

  return (
    <div className="relative w-full h-[300px] md:h-[480px] overflow-hidden flex">
      <Image
        src={image}
        alt={title.replace(/\n/g, " ")}
        fill
        className="object-cover"
        sizes="100vw"
      />

      <div
        className={`relative z-10 w-full h-full flex ${
          isRight ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`
            flex flex-col
            w-1/2 md:w-[calc(50%-100px)] h-full
            bg-black/50
            pt-6 md:pt-[58px]
            ${isRight ? "pl-5 md:pl-[58px] pr-3 md:pr-10 items-start" : "pr-5 md:pr-[58px] pl-3 md:pl-10 items-end"}
            ${isRight ? "clip-right" : "clip-left"}
          `}
        >
          <div className="w-fit">
            <h2 className="text-white text-base md:text-[28px] font-bold leading-normal mb-3 md:mb-[52px] whitespace-pre-line w-full">
              {title}
            </h2>
            <div className="flex flex-col gap-1.5 md:gap-5">
              {items.map((item) => (
                <p
                  key={item}
                  className="text-white text-xs md:text-xl font-light leading-normal whitespace-pre-line"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OurServices() {
  return (
    <section className="w-full" aria-label="Our Services">
      <style>{clipStyles}</style>
      <div className="flex flex-col">
        {SERVICES.map((service) => (
          <ServicePanel key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
}
