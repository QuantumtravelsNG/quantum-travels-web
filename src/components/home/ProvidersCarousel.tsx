"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const TILE_WIDTH = 200;
const GAP = 16;

const ALL_PROVIDERS = [
  { src: "/home/providers/aircanada.png", alt: "Air Canada" },
  { src: "/home/providers/turkish.png", alt: "Turkish Airlines" },
  { src: "/home/providers/ethiopian.png", alt: "Ethiopian Airlines" },
  { src: "/home/providers/qatar airlines.png", alt: "Qatar Airways" },
  { src: "/home/providers/airPeace.png", alt: "Air Peace" },
  { src: "/home/providers/rwandAir.png", alt: "RwandAir" },
  { src: "/home/providers/amadeus.png", alt: "Amadeus" },
  { src: "/home/providers/britishAirways.png", alt: "British Airways" },
  { src: "/home/providers/klm.png", alt: "KLM" },
  { src: "/home/providers/msc.png", alt: "MSC Cruises" },
  { src: "/home/providers/disneyCruiseLine.png", alt: "Disney Cruise Line" },
  { src: "/home/providers/royalCarribean.png", alt: "Royal Caribbean" },
  { src: "/home/providers/delta.png", alt: "Delta" },
  { src: "/home/providers/airFrance.png", alt: "Air France" },
];

const ROW_ONE = ALL_PROVIDERS;
const ROW_TWO = [...ALL_PROVIDERS].reverse();

const SPEED_NORMAL = 0.8;
const SPEED_SLOW = 0.3;

function ProviderTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center bg-[#f9f9f9] rounded-[8px]"
      style={{ width: TILE_WIDTH, height: 80, padding: "0 28px" }}
    >
      <div className="relative w-full h-[56px]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="144px"
        />
      </div>
    </div>
  );
}

interface MarqueeRowProps {
  items: { src: string; alt: string }[];
  direction: "rtl" | "ltr";
  speedRef: React.MutableRefObject<number>;
}

function MarqueeRow({ items, direction, speedRef }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<number>(0);

  const unitWidth = items.length * (TILE_WIDTH + GAP);

  useEffect(() => {
    posRef.current = direction === "ltr" ? -unitWidth : 0;

    let rafId: number;

    const tick = () => {
      const speed = speedRef.current;

      if (direction === "rtl") {
        posRef.current -= speed;
        if (posRef.current <= -unitWidth) posRef.current += unitWidth;
      } else {
        posRef.current += speed;
        if (posRef.current >= 0) posRef.current -= unitWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [direction, speedRef, unitWidth]);

  const repeated = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: GAP }}
      >
        {repeated.map((item, i) => (
          <ProviderTile
            key={`${item.alt}-${i}`}
            src={item.src}
            alt={item.alt}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProvidersCarousel() {
  const speedRef = useRef<number>(SPEED_NORMAL);

  return (
    <section
      className="bg-white w-full py-6 overflow-hidden"
      onMouseEnter={() => {
        speedRef.current = SPEED_SLOW;
      }}
      onMouseLeave={() => {
        speedRef.current = SPEED_NORMAL;
      }}
    >
      <div className="flex flex-col gap-4">
        <MarqueeRow items={ROW_ONE} direction="rtl" speedRef={speedRef} />
        <MarqueeRow items={ROW_TWO} direction="ltr" speedRef={speedRef} />
      </div>
    </section>
  );
}
