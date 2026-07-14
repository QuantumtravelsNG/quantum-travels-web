import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative w-full h-70 md:h-[400px] overflow-hidden">
      <Image
        src="/about/hero.jpg"
        alt="Modern glass building viewed from below against a blue sky"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      <div className="relative z-10 h-full flex flex-col justify-center px-5 md:px-25 max-w-[1440px] mx-auto">
        <div className="hidden md:block">
          <h1 className="text-white text-[44px] font-bold leading-normal">
            Learn More About Our
          </h1>
          <p className="text-white text-[44px] font-bold leading-normal ml-[235px]">
            History &amp; Our Business
          </p>
          <p className="text-white text-[22px] font-medium leading-[1.8] mt-1">
            The story of how our commitment to exceptional travel experiences
            began.
          </p>
        </div>

        <div className="md:hidden">
          <h1 className="text-white text-2xl font-bold leading-normal">
            Learn More About Our
          </h1>
          <p className="text-white text-2xl font-bold leading-normal ml-[68px]">
            History &amp; Our Business
          </p>
          <p className="text-white text-base font-medium leading-[1.8] mt-1">
            The story of how our commitment to exceptional
            <br />
            travel experiences began.
          </p>
        </div>
      </div>
    </section>
  );
}
