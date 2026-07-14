"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  defaultServicePreview,
  ServiceMenuPanel,
} from "@/components/ourServices/ServiceMenuPanel";

function ViewServicesIcon() {
  return (
    <span className="grid grid-cols-2 gap-1" aria-hidden="true">
      <span className="size-2 rounded-[3px] bg-primary md:size-2.5" />
      <span className="size-2 rounded-[3px] bg-primary md:size-2.5" />
      <span className="size-2 rounded-[3px] bg-primary md:size-2.5" />
      <span className="size-2 rounded-[3px] bg-primary md:size-2.5" />
    </span>
  );
}

export default function ServicesHero() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(defaultServicePreview);

  return (
    <section
      className="relative w-full bg-white px-4 pb-8 pt-6 md:px-[90px] md:pb-12 md:pt-[58px]"
      aria-label="Our company services"
    >
      <div className="mx-auto max-w-[1260px] relative">
        <div
          className="relative inline-flex flex-col"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => {
            setIsOpen(false);
            setActiveImage(defaultServicePreview);
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsOpen((open) => !open);
              setActiveImage(defaultServicePreview);
            }}
            className="flex cursor-pointer items-center gap-2 text-primary transition-opacity hover:opacity-85 md:gap-4"
            aria-expanded={isOpen}
            aria-controls="services-hero-menu"
          >
            <span className="flex items-center gap-1 md:gap-2">
              <ViewServicesIcon />
              <span className="text-base font-black md:text-2xl">
                View Services
              </span>
            </span>
            <ChevronDown
              className={`size-4 transition-transform duration-200 md:size-6 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            id="services-hero-menu"
            className={`absolute top-full left-0 z-50 w-[calc(100vw-32px)] md:w-[calc(100vw-180px)] max-w-[1260px] overflow-hidden transition-all duration-300 ease-out ${
              isOpen
                ? "pt-4 max-h-[900px] opacity-100 md:pt-6"
                : "pt-0 max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="pt-2">
              <ServiceMenuPanel
                activeImage={activeImage}
                onItemHover={setActiveImage}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:mt-8 md:grid-cols-[minmax(0,1fr)_690px] md:items-start md:gap-12">
          <div>
            <h1 className="max-w-[360px] text-[32px] leading-[1.08] font-bold text-text md:max-w-none md:text-[64px] md:leading-[1.2]">
              Our <span className="text-primary">Company</span>
              <br />
              Services!
            </h1>
          </div>

          <p className="max-w-[356px] text-sm leading-[1.5] font-light text-text md:max-w-none md:text-2xl">
            We deliver comprehensive travel solutions for both corporate and
            leisure clients from business travel management and executive trips
            to customized holidays, guided tours, and dependable airport
            transfers.
          </p>
        </div>
      </div>
    </section>
  );
}
