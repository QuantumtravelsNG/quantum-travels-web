import Image from "next/image";
import { isRemoteImage } from "@/lib/images";

interface PageHeroProps {
  image: string;
  heading: string;
  subheading: string;
}

export default function PageHero({
  image,
  heading,
  subheading,
}: PageHeroProps) {
  return (
    <div className="px-4 md:px-16 max-w-[1440px] mx-auto">
      <div className="relative overflow-hidden rounded-[8px] md:rounded-[10px] text-white">
        <Image
          src="/assets/quantumBg.png"
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 768px) 1312px, 100vw"
          priority
        />

        <div className="relative z-10 flex flex-col md:flex-row p-[15px] pb-8 md:p-[20px] md:pl-[22px] gap-6 md:gap-10 items-center">
          <div className="relative w-full h-[220px] md:w-[600px] md:h-[400px] shrink-0 rounded-[8px] md:rounded-[10px] overflow-hidden">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 480px, 100vw"
              priority
              unoptimized={isRemoteImage(image)}
            />
          </div>

          <div className="flex flex-col gap-4 md:gap-10 flex-1 items-start w-full">
            <h1 className="font-bold text-[28px] md:text-4xl lg:text-5xl leading-[1.2] whitespace-pre-line">
              {heading}
            </h1>
            <p className="font-light text-base md:text-2xl">{subheading}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
