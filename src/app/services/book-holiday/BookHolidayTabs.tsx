"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function BookHolidayTabs() {
	const pathname = usePathname();

	const isCruises = pathname.includes("cruises");
	const isPackage = !isCruises; // Default to package holiday if not cruises

	return (
		<div className="px-4 md:px-16 max-w-[1440px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-2 md:mt-6 mb-4">
			<div className="flex flex-col gap-1">
				<h2 className="text-[16px] md:text-[24px] font-bold text-text">
					Find The Holiday That Suits You
				</h2>
				<p className="text-[12px] md:text-[20px] font-light text-text">
					Level up your experience with Quantum
				</p>
			</div>

			<div className="flex flex-row items-center gap-8 md:gap-[50px] lg:gap-16">
				{/* Package Holiday Tab */}
				<Link
					href="/services/book-holiday/package-holiday"
					className="group flex flex-row items-center gap-2"
				>
					<div className="relative w-6 h-6 md:w-8 md:h-8 shrink-0">
						<Image
							src="/ourServices/book-holiday/packageHolidayHovered.svg"
							alt=""
							fill
							className={isPackage ? "block" : "hidden group-hover:block"}
						/>
						<Image
							src="/ourServices/book-holiday/packageHolidayDefault.svg"
							alt=""
							fill
							className={isPackage ? "hidden" : "block group-hover:hidden"}
						/>
					</div>
					<span
						className={`text-[16px] md:text-[20px] transition-colors ${isPackage ? "text-[#9E328A] font-bold" : "text-text font-light group-hover:text-[#9E328A]"}`}
					>
						Package Holiday
					</span>
				</Link>

				{/* Cruises Tab */}
				<Link
					href="/services/book-holiday/cruises"
					className="group flex flex-row items-center gap-2"
				>
					<div className="relative w-6 h-6 md:w-8 md:h-8 shrink-0">
						<Image
							src="/ourServices/book-holiday/cruisesHovered.svg"
							alt=""
							fill
							className={isCruises ? "block" : "hidden group-hover:block"}
						/>
						<Image
							src="/ourServices/book-holiday/cruisesDefault.svg"
							alt=""
							fill
							className={isCruises ? "hidden" : "block group-hover:hidden"}
						/>
					</div>
					<span
						className={`text-[16px] md:text-[20px] transition-colors ${isCruises ? "text-[#9E328A] font-bold" : "text-text font-light group-hover:text-[#9E328A]"}`}
					>
						Cruises
					</span>
				</Link>
			</div>
		</div>
	);
}
