"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import type { SelectionPrice, SelectionType } from "@/lib/quantum";

const SELECTION_DESCRIPTIONS: Record<SelectionType, string> = {
	per_person: "Standard individual pricing per person.",
	per_person_sharing:
		"Individual pricing when sharing a room, helping you save more.",
	family_of_4:
		"Special package for a family of four traveling together.\n(2 Adults & 2 Children between ages 2 - 12)",
};

interface SelectionTypeModalProps {
	options: SelectionPrice[];
	selected: SelectionType;
	onSelect: (type: SelectionType) => void;
	onClose: () => void;
}

export default function SelectionTypeModal({
	options,
	selected,
	onSelect,
	onClose,
}: SelectionTypeModalProps) {
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKey);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	if (typeof document === "undefined") return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 px-4"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-label="Change selection type"
		>
			<div
				className="w-full max-w-[440px] rounded-[10px] overflow-hidden shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="bg-[#9E328A] h-14 flex items-center px-7">
					<h2 className="text-white text-xl font-bold">Selection</h2>
				</div>

				<div className="bg-white px-7 py-6 flex flex-col gap-5">
					{options.map((option) => {
						const isSelected = option.type === selected;
						const description = SELECTION_DESCRIPTIONS[option.type];

						return (
							<button
								key={option.type}
								type="button"
								onClick={() => {
									onSelect(option.type);
									onClose();
								}}
								className="text-left w-full"
							>
								<div className="flex items-center gap-4">
									<div
										className={`flex-shrink-0 w-8 h-8 rounded-[5px] flex items-center justify-center transition-colors ${
											isSelected
												? "bg-[#9E328A]"
												: "bg-white border border-black/20"
										}`}
									>
										{isSelected && (
											<svg
												width="16"
												height="12"
												viewBox="0 0 16 12"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M1.5 6L6 10.5L14.5 1.5"
													stroke="white"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										)}
									</div>
									<span className="text-base font-bold text-text">
										{option.label}
									</span>
								</div>
								{!isSelected && (
									<p className="mt-1.5 ml-12 text-sm text-black/70 leading-relaxed whitespace-pre-line">
										{description}
									</p>
								)}
							</button>
						);
					})}
				</div>
			</div>
		</div>,
		document.body,
	);
}
