"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Section {
	title: string;
	paragraphs: string[];
}

interface LegalAccordionProps {
	sections: Section[];
}

export default function LegalAccordion({ sections }: LegalAccordionProps) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const toggleAccordion = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<div className="w-full">
			{sections.map((section, index) => {
				const isOpen = activeIndex === index;
				return (
					<div key={index} className="border-b border-neutral-200 py-1 md:py-2">
						<button
							onClick={() => toggleAccordion(index)}
							className="w-full flex items-center justify-between py-5 md:py-6 text-left focus:outline-none group cursor-pointer"
							aria-expanded={isOpen}
						>
							<h3 className="text-text text-xl md:text-[24px] font-bold pr-4 leading-snug transition-colors group-hover:text-[#9E328A]">
								{section.title}
							</h3>
							<ChevronDown
								className={`w-5 h-5 text-[#9E328A] shrink-0 transition-transform duration-300 ${
									isOpen ? "rotate-180" : ""
								}`}
							/>
						</button>
						<div
							className={`grid transition-all duration-300 ease-in-out ${
								isOpen
									? "grid-rows-[1fr] opacity-100 pb-6"
									: "grid-rows-[0fr] opacity-0"
							}`}
						>
							<div className="overflow-hidden">
								<div className="text-text/60 font-light leading-[1.8] text-base md:text-lg space-y-4 pr-2">
									{section.paragraphs.map((paragraph, pIdx) => {
										// If paragraph starts with a bullet point, render it with indented styling
										if (paragraph.startsWith("• ")) {
											return (
												<p key={pIdx} className="pl-4 -indent-4">
													{paragraph}
												</p>
											);
										}
										return <p key={pIdx}>{paragraph}</p>;
									})}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
