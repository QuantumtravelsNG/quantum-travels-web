import Image from "next/image";
import Link from "next/link";
import { isRemoteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type PageCTABtnVariant = "light" | "primary";

interface PageCTAProps {
	title: string;
	subtitle: string;
	className?: string;
	image: string;
	btnVariant?: PageCTABtnVariant;
	btnLabel: string;
	btnHref: string;
}

const buttonVariantClasses: Record<PageCTABtnVariant, string> = {
	light: "bg-white text-primary hover:bg-white/90",
	primary: "bg-white text-primary hover:bg-white/90",
};

export default function PageCTA({
	title,
	subtitle,
	className,
	image,
	btnVariant = "primary",
	btnLabel,
	btnHref,
}: PageCTAProps) {
	return (
		<section className="px-4 md:px-16 max-w-7xl mx-auto w-full overflow-hidden rounded-[8px] md:rounded-[10px]">
			<div className="relative isolate min-h-[500px] overflow-hidden rounded-[8px] md:min-h-[280px] md:rounded-[10px]">
				<Image
					src={image}
					alt=""
					fill
					className="object-cover md:object-center"
					sizes="(min-width: 768px) 1200px, 100vw"
					unoptimized={isRemoteImage(image)}
				/>

				<div
					className={cn(
						"absolute left-1/2 top-[244px] h-[556px] w-[760px] -translate-x-1/2 overflow-hidden rounded-t-full md:rounded-tl-none md:rounded-r-full md:left-[-70px] md:top-1/2 md:h-[585px] md:w-[585px] md:translate-x-0 md:-translate-y-1/2",
						className,
					)}
				>
					<Image
						src="/assets/quantumBg.png"
						alt=""
						fill
						className="object-cover"
						sizes="(min-width: 768px) 585px, 760px"
					/>
				</div>

				<div className="relative z-10 flex min-h-[500px] items-end px-12 pb-10 md:min-h-[280px] md:items-start md:px-10 md:pb-0 t-4 md:pt-11">
					<div className="max-w-[281px] text-white md:max-w-[366px] space-y-3">
						<h2 className="text-lg leading-normal font-bold md:text-2xl whitespace-pre-line">
							{title}
						</h2>
						<p className="text-base leading-[1.8] font-medium ">{subtitle}</p>
						<Link
							href={btnHref}
							className={cn(
								"inline-flex h-[38px] items-center justify-center rounded-[50px] px-8 text-xs font-bold transition-colors md:h-14 md:text-base mt-1.5 active:scale-99",
								buttonVariantClasses[btnVariant],
							)}
						>
							{btnLabel}
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
