import Image from "next/image";
import Link from "next/link";

const eventTypes = [
  {
    title: "Conferences",
    description: "Over 100+ Hosted",
    image: "/ourServices/corporateEvent/conferences.jpg",
  },
  {
    title: "Conventions",
    description: "96.5% Client Satisfaction Recorded",
    image: "/ourServices/corporateEvent/conventions.jpg",
  },
  {
    title: "Exhibitions",
    description: "Over 500k Attendees Recorded",
    image: "/ourServices/corporateEvent/exhibitions.jpg",
  },
  {
    title: "Product Launches",
    description: "80.8% Attendance Rate",
    image: "/ourServices/corporateEvent/productLaunches.jpg",
  },
];

export default function EventTypes() {
  return (
    <section className="py-10 space-y-10 relative">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-16 space-y-2">
        <h2 className="text-3xl font-bold text-balance leading-normal">
          Comprehensive event solutions covering strategy, planning, and
          flawless execution tailored to your business needs.
        </h2>
        <p className="text-xl text-black/80 w-full md:w-2/3 leading-normal">
          End-to-end event solutions designed to deliver seamless,
          well-coordinated, and impactful corporate experiences.
        </p>
      </div>
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {eventTypes.map((event, index) => (
          <div
            key={index}
            className="rounded-3xl overflow-hidden w-full col-span-1 bg-white"
          >
            <Image
              src={event.image}
              alt={event.title}
              width={316}
              height={260}
              className="object-cover h-32 md:h-52 w-full rounded-t-3xl"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-black/80">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 md:px-16 max-w-[1440px] mx-auto">
        <div className="bg-primary px-6 md:px-12 py-6 md:py-12 rounded-3xl flex justify-between flex-col md:flex-row items-start md:items-center space-y-4">
          <div className="space-y-2">
            <p className="text-white/90">Let’s Work Together!</p>
            <h3 className="text-white text-2xl font-semibold">
              We Host & Manage All Types Of Corporate Events.
            </h3>
          </div>
          <Link
            href="/services/corporate-event/book"
            className="inline-flex h-10 items-center justify-center rounded-[50px] bg-white px-6 text-xs font-bold text-primary transition-colors hover:bg-white/90 active:scale-99 md:h-14 md:px-8 md:text-base"
          >
            Make Reservation
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 bg-primary/20 clip-bg w-full h-full -z-10" />
    </section>
  );
}
