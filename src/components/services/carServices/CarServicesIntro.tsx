import Image from "next/image";

export default function CarServicesIntro() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-16 md:pt-12">
      <div className="grid gap-6 md:items-center md:gap-8 lg:grid-cols-[minmax(0,1fr)_571px] lg:gap-[82px]">
        <div className="order-2 lg:order-1">
          <p className="max-w-[640px] text-[20px] leading-[1.5] font-bold text-text text-lg md:text-3xl">
            We are committed to delivering fast, reliable, and professional car
            hire and airport transfer services, ensuring a smooth, comfortable,
            and efficient travel experience.
          </p>
        </div>

        <div className="order-1 overflow-hidden rounded-[8px] md:rounded-[10px] lg:order-2 lg:w-[571px]">
          <Image
            src="/ourServices/carServices/car.jpg"
            alt="Luxury vehicle detail in a showroom"
            width={571}
            height={300}
            sizes="(min-width: 1024px) 571px, 100vw"
            className="h-[200px] w-full object-cover md:h-[300px]"
          />
        </div>
      </div>
    </section>
  );
}
