"use client";

import Image from "next/image";

export default function CorporateTravelHero() {
  const scrollToForm = () => {
    document
      .getElementById("corporate-contact-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative w-full bg-[#f8f8f8]">
      {/* Background Image Container */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden [clip-path:inset(0)] md:h-[800px]">
        <div className="fixed inset-x-0 top-[60px] h-[560px] md:top-[88px] md:h-[800px]">
          <Image
            src="/ourServices/corporateTravel/corporateTravelHero.jpg"
            alt="Corporate Travel"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Hero Content Overlay */}
      <div className="relative w-full h-[560px] md:h-[800px] flex flex-col">
        <div className="w-full">
          <div className="bg-[#9E328A] w-full h-[300px] md:h-[320px] px-6 py-8 flex flex-col justify-center items-start">
            <div className="w-full max-w-6xl mx-auto flex flex-col items-start text-left">
              <h1 className="font-bold text-[24px] md:text-[44px] text-white leading-tight mb-4">
                Corporate Travel <br className="md:hidden" />
                Management
              </h1>

              <p className="font-light text-[16px] md:text-[22px] text-white leading-[1.8] mb-8 max-w-[340px] md:max-w-[1120px]">
                At Quantum Travels, business travel is more than bookings. We
                deliver personalized, seamless travel experiences by optimizing
                every aspect of your journey, with expert support tailored to
                your needs.
              </p>

              <button
                onClick={scrollToForm}
                className="bg-white hover:bg-white/90 active:scale-99 text-[#9E328A] font-bold text-[12px] md:text-[16px] px-8 py-3 md:px-[32px] md:py-[14px] rounded-[50px] transition-colors"
                type="button"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
