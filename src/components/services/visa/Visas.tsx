import EmptyState from "@/components/EmptyState";
import { formatVisaPrice, getVisaListKey, type VisaType } from "@/lib/quantum";
import { getVisaPackages } from "@/lib/quantum-api";
import { isRemoteImage } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";

function VisaCard({ visa }: { visa: VisaType }) {
	return (
		<Link
			href={`/services/visa/${visa.slug}`}
			className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E328A] focus-visible:ring-offset-4"
		>
			<article className="relative aspect-[426/500] min-h-[360px] overflow-hidden rounded-[10px] bg-black">
				<Image
					src={visa.image}
					alt={visa.name}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 426px"
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					unoptimized={isRemoteImage(visa.image)}
				/>
				<div className="absolute inset-0 bg-black/10" />

				<div className="relative z-10 flex h-full flex-col justify-between p-4 text-white md:p-6">
					<h2 className="max-w-[320px] text-[24px] leading-[1.05] font-black text-white uppercase md:text-[28px]">
						{visa.country}
						<br />
						{visa.visaFormat}
					</h2>

					<div>
						<div className="flex flex-wrap items-center gap-2.5 text-[12px] leading-normal font-light text-white md:text-base">
							<span>Type - {visa.type}</span>
							<span className="size-[6px] rounded-full bg-white" />
							<span>Validity - {visa.validity}</span>
						</div>

						<p className="mt-3 text-white">
							<span className="text-[24px] leading-normal font-black md:text-[28px]">
								{formatVisaPrice(visa)}
							</span>{" "}
							<span className="text-base leading-normal font-light md:text-[20px]">
								Per Person
							</span>
						</p>
					</div>
				</div>
			</article>
		</Link>
	);
}

export default async function Visas() {
	const visas = await getVisaPackages();

	return (
		<section className="mx-auto mt-6 max-w-[1440px] px-4 md:px-16">
			{visas.length === 0 ? (
				<EmptyState />
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{visas.map((visa, index) => (
						<VisaCard key={getVisaListKey(visa, index)} visa={visa} />
					))}
				</div>
			)}
		</section>
	);
}
