"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type {
	TourPackage,
	SelectionType,
	Currency,
	PriceEntry,
} from "@/lib/quantum";
import { submitTourBooking } from "@/app/actions";
import { isRemoteImage } from "@/lib/images";
import SelectionTypeModal from "@/components/SelectionTypeModal";
import SuccessDialog from "@/components/SuccessDialog";
import { ClickableImage } from "@/components/ClickableImage";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import {
	FloatingInput,
	FloatingPhoneInput,
	FloatingSelect,
} from "@/components/ui/floating-fields";
import { isValidPhoneNumberValue } from "@/lib/phone";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENCY_LABELS: Record<Currency, string> = {
	NGN: "NGN, Naira",
	USD: "USD, Dollar",
	EUR: "EUR, Euro",
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
	NGN: "₦",
	USD: "$",
	EUR: "€",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(amount: number, currency: Currency): string {
	return `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString()}`;
}

function formatDateRange(start: string, end: string): string {
	const fmt = (iso: string) =>
		new Date(iso).toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	return `${fmt(start)} – ${fmt(end)}`;
}

function getEffectiveGuestCount(value: string): number {
	const n = Number(value);
	if (!Number.isInteger(n)) return 1;
	return Math.max(1, n);
}

// ─── Form types & validation ──────────────────────────────────────────────────

interface BookingForm {
	fullName: string;
	email: string;
	phone: string;
	checkIn: string;
	checkOut: string;
	numGuests: string;
}

interface FormErrors {
	fullName?: string;
	email?: string;
	phone?: string;
	checkIn?: string;
	checkOut?: string;
	numGuests?: string;
}

function validateForm(
	form: BookingForm,
	selectionType: SelectionType,
): FormErrors {
	const errors: FormErrors = {};

	if (!form.fullName.trim()) errors.fullName = "Full name is required.";
	else if (form.fullName.trim().length < 2)
		errors.fullName = "Name must be at least 2 characters.";

	const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!form.email.trim()) errors.email = "Email address is required.";
	else if (!emailRe.test(form.email.trim()))
		errors.email = "Enter a valid email address.";

	if (!form.phone.trim()) errors.phone = "Phone number is required.";
	else if (!isValidPhoneNumberValue(form.phone))
		errors.phone = "Enter a valid phone number.";

	if (!form.checkIn) errors.checkIn = "Check-in date is required.";
	if (!form.checkOut) errors.checkOut = "Check-out date is required.";
	if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn)
		errors.checkOut = "Check-out must be after check-in.";

	if (selectionType === "per_person") {
		const n = getEffectiveGuestCount(form.numGuests);
		if (form.numGuests.trim() && !Number.isInteger(Number(form.numGuests)))
			errors.numGuests = "Enter a valid number of guests (minimum 1).";
		else if (n > 50) errors.numGuests = "Maximum 50 guests per booking.";
	}

	return errors;
}

// ─── Out-of-component helpers ─────────────────────────────────────────────────

// ─── Tab config ───────────────────────────────────────────────────────────────

type Tab = "overview" | "details" | "itinerary" | "more";

const ALL_TABS: { id: Tab; label: string }[] = [
	{ id: "overview", label: "Overview" },
	{ id: "details", label: "Details" },
	{ id: "itinerary", label: "Itinerary" },
	{ id: "more", label: "More Information" },
];

// ─── Inclusions parser ────────────────────────────────────────────────────────
// Splits the inclusions string on newlines and renders each "-" bullet item
// with optional **bold** prefix before " - "

function InclusionsList({ items }: { items: string[] }) {
	return (
		<ul className="space-y-2 mt-2 ml-4">
			{items.map((content, i) => {
				// Split on " - " to separate bold label from rest
				const dashIdx = content.indexOf(" - ");
				if (dashIdx !== -1) {
					const bold = content.slice(0, dashIdx);
					const rest = content.slice(dashIdx + 3);
					return (
						<li
							key={i}
							className="list-disc text-[17px] text-text leading-relaxed"
						>
							<span className="font-bold">{bold}</span>
							{` - ${rest}`}
						</li>
					);
				}
				return (
					<li
						key={i}
						className="list-disc text-[17px] font-bold text-text leading-relaxed"
					>
						{content}
					</li>
				);
			})}
		</ul>
	);
}

// ─── Contact parser ───────────────────────────────────────────────────────────
// Renders Phone : / Email : lines bold + inline, rest as light text

function ContactBlock({ contact }: { contact: TourPackage["contact"] }) {
	return (
		<div className="space-y-1">
			{contact.number ? (
				<p className="text-[17px] text-text leading-relaxed">
					<span className="font-bold">Phone :</span> {contact.number}
				</p>
			) : null}
			{contact.email ? (
				<p className="text-[17px] text-text leading-relaxed">
					<span className="font-bold">Email :</span> {contact.email}
				</p>
			) : null}
		</div>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TourDetailView({ tour }: { tour: TourPackage }) {
	const itineraryActivities = tour.itinerary?.dayActivities ?? [];
	const itineraryImage = tour.itinerary?.itineraryImage;
	const hasItinerary =
		itineraryActivities.length > 0 || Boolean(itineraryImage);

	const visibleTabs = ALL_TABS.filter(
		(t) => t.id !== "itinerary" || hasItinerary,
	);

	// ── Pricing state ──────────────────────────────────────────────────────────
	const [selectedType, setSelectedType] = useState<SelectionType>(
		tour.selectionTypes[0]?.type ?? "per_person",
	);
	const [currency, setCurrency] = useState<Currency>("NGN");
	const [numGuests, setNumGuests] = useState("1");

	// ── Modal state ────────────────────────────────────────────────────────────
	const [showSelectionModal, setShowSelectionModal] = useState(false);
	const [showConfirmed, setShowConfirmed] = useState(false);

	// ── Active tab (scroll-tracked) ────────────────────────────────────────────
	const [activeTab, setActiveTab] = useState<Tab>("overview");

	// ── Form state ─────────────────────────────────────────────────────────────
	const [form, setForm] = useState<BookingForm>({
		fullName: "",
		email: "",
		phone: "",
		checkIn: tour.startDate,
		checkOut: tour.endDate,
		numGuests: "1",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitted, setSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");

	// ── Derived pricing ────────────────────────────────────────────────────────
	const selectedSelection = useMemo(
		() => tour.selectionTypes.find((s) => s.type === selectedType),
		[tour.selectionTypes, selectedType],
	);

	const unitPriceEntry = useMemo((): PriceEntry | undefined => {
		if (!selectedSelection) return undefined;
		return (
			selectedSelection.prices.find((p) => p.currency === currency) ??
			selectedSelection.prices[0]
		);
	}, [selectedSelection, currency]);

	const effectiveCurrency: Currency =
		(unitPriceEntry?.currency as Currency) ?? currency;
	const effectiveNumGuests = getEffectiveGuestCount(numGuests);

	const totalPrice = useMemo(() => {
		if (!unitPriceEntry) return 0;
		const multiplier = selectedType === "per_person" ? effectiveNumGuests : 1;
		return unitPriceEntry.amount * multiplier;
	}, [unitPriceEntry, selectedType, effectiveNumGuests]);

	const totalPriceFormatted = formatAmount(totalPrice, effectiveCurrency);

	const availableCurrencies = useMemo((): Currency[] => {
		const set = new Set<Currency>();
		for (const sel of tour.selectionTypes) {
			for (const p of sel.prices) set.add(p.currency as Currency);
		}
		return Array.from(set);
	}, [tour.selectionTypes]);

	// ── Section refs for IntersectionObserver ─────────────────────────────────
	const sectionRefs = useRef<Partial<Record<Tab, HTMLElement | null>>>({});
	const observing = useRef(false);

	useEffect(() => {
		const ids = visibleTabs.map((t) => t.id);
		const observers: IntersectionObserver[] = [];

		ids.forEach((id) => {
			const el = sectionRefs.current[id];
			if (!el) return;
			const obs = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) setActiveTab(id);
				},
				{ rootMargin: "-30% 0px -60% 0px", threshold: 0 },
			);
			obs.observe(el);
			observers.push(obs);
		});

		observing.current = true;
		return () => observers.forEach((o) => o.disconnect());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasItinerary]);

	// ── Smooth-scroll to section ───────────────────────────────────────────────
	const scrollToSection = useCallback((id: Tab) => {
		const el = sectionRefs.current[id];
		if (!el) return;
		const yOffset = -120; // account for sticky tab bar + page header
		const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
		window.scrollTo({ top: y, behavior: "smooth" });
	}, []);

	// ── Handlers ──────────────────────────────────────────────────────────────
	const handleFormChange = useCallback(
		(field: keyof BookingForm, value: string) => {
			setForm((prev) => ({ ...prev, [field]: value }));
			if (submitted) setErrors((prev) => ({ ...prev, [field]: undefined }));
			if (submitError) setSubmitError("");
		},
		[submitted, submitError],
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (isSubmitting) return;

			setSubmitted(true);
			setSubmitError("");
			const errs = validateForm(form, selectedType);
			setErrors(errs);
			if (Object.keys(errs).length > 0) return;

			const bookingGuests =
				selectedType === "family_of_4"
					? 4
					: selectedType === "per_person_sharing"
						? 2
						: getEffectiveGuestCount(form.numGuests);

			const payload = {
				tourID: tour.id,
				selectionType: selectedType,
				currency: effectiveCurrency,
				numGuests: bookingGuests,
				booking: {
					fullName: form.fullName.trim(),
					email: form.email.trim().toLowerCase(),
					phone: form.phone.trim(),
					checkIn: form.checkIn,
					checkOut: form.checkOut,
				},
			};

			setIsSubmitting(true);
			const result = await submitTourBooking(payload);
			setIsSubmitting(false);

			if (!result.ok) {
				setSubmitError(result.message);
				return;
			}

			setShowConfirmed(true);
		},
		[form, selectedType, effectiveCurrency, tour, isSubmitting],
	);

	const isPerPerson = selectedType === "per_person";

	return (
		<>
			{/* Modals */}
			{showSelectionModal && (
				<SelectionTypeModal
					options={tour.selectionTypes}
					selected={selectedType}
					onSelect={(type) => {
						setSelectedType(type);
						if (type !== "per_person") setNumGuests("1");
					}}
					onClose={() => setShowSelectionModal(false)}
				/>
			)}

			<SuccessDialog
				open={showConfirmed}
				onClose={() => setShowConfirmed(false)}
				title="Booking Confirmed"
				description="Your booking is confirmed. You will receive additional details via email shortly."
				buttonLabel="Continue"
			/>

			{/* Page container */}
			<div className="px-4 md:px-16 max-w-7xl mx-auto py-8">
				{/* Top Section */}
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mx-auto max-w-6xl w-full">
					<div className="absolute top-0 left-0 w-full h-4/5 md:h-3/5 rounded-edge bg-primary" />
					{/* Cover photo */}
					<div className="w-full lg:flex-1 shrink-0 relative">
						<ClickableImage
							src={tour.coverPhoto}
							alt={tour.title}
							width={500}
							height={560}
							className="w-full h-auto md:h-[420px] lg:h-[560px] object-cover rounded-[10px]"
							caption={tour.title}
						/>
					</div>

					{/* Right: detail card + selector box */}
					<div className="flex-1 flex flex-col gap-4 relative">
						{/* Detail card */}
						<div className="bg-[#F9F9F9] rounded-[10px] p-6">
							<h1 className="text-2xl md:text-[24px] font-bold text-text leading-tight">
								{tour.title}
							</h1>

							<div className="flex items-center justify-between mt-1.5">
								<p className="text-[18px] md:text-[20px] text-text font-normal">
									{tour.location}
								</p>
								{tour.countryFlags && tour.countryFlags.length > 0 && (
									<div className="flex gap-1.5 items-center">
										{tour.countryFlags.map((flag, i) =>
											isRemoteImage(flag) ? (
												<Image
													key={`${flag}-${i}`}
													src={flag}
													alt=""
													width={28}
													height={28}
													className="size-7 rounded-full object-cover"
													aria-hidden="true"
													unoptimized
												/>
											) : (
												<span
													key={`${flag}-${i}`}
													className="text-2xl"
													aria-hidden="true"
												>
													{flag}
												</span>
											),
										)}
									</div>
								)}
							</div>

							<div className="mt-4 flex flex-col gap-3">
								{/* Duration */}
								<div className="flex items-center gap-2">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#9E328A"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
									<span className="text-[17px] text-text font-light">
										{tour.duration}
									</span>
								</div>

								{/* Dates */}
								<div className="flex items-center gap-2">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#9E328A"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
										<line x1="16" y1="2" x2="16" y2="6" />
										<line x1="8" y1="2" x2="8" y2="6" />
										<line x1="3" y1="10" x2="21" y2="10" />
									</svg>
									<span className="text-[17px] text-text font-light">
										{formatDateRange(tour.startDate, tour.endDate)}
									</span>
								</div>

								{/* Slots */}
								{typeof tour.slotsLeft === "number" && (
									<div className="flex items-center gap-2">
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#9E328A"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
											<circle cx="9" cy="7" r="4" />
											<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
											<path d="M16 3.13a4 4 0 0 1 0 7.75" />
										</svg>
										<span className="text-[17px] text-text font-light">
											{tour.slotsLeft} Slots left
										</span>
									</div>
								)}
							</div>

							{/* Price + change selection type */}
							<div className="mt-5 pt-4 border-t border-black/10">
								<div className="flex items-end gap-2 flex-wrap">
									<span className="text-[28px] font-bold text-text leading-none">
										{totalPriceFormatted}
									</span>
									<span className="text-[18px] text-text font-light mb-0.5">
										{selectedSelection?.label}
									</span>
								</div>
								<button
									type="button"
									onClick={() => setShowSelectionModal(true)}
									className="mt-1.5 flex items-center gap-1 text-[#9E328A] text-[16px] font-light hover:underline"
								>
									Change selection type
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="#9E328A"
										aria-hidden="true"
									>
										<path d="M7 10l5 5 5-5z" />
									</svg>
								</button>
							</div>
						</div>

						{/* Guest + Currency selector */}
						<div className="bg-[#F9F9F9] rounded-[10px] p-6 flex flex-col gap-4">
							<div>
								<FloatingInput
									id="detail-guests"
									type="number"
									min={1}
									max={50}
									label={
										isPerPerson ? "Number of guests" : "N/A for this selection"
									}
									value={isPerPerson ? numGuests : ""}
									placeholder={isPerPerson ? "1" : undefined}
									forceLabel={isPerPerson}
									disabled={!isPerPerson}
									onChange={(e) => {
										handleFormChange("numGuests", e.target.value);
										setNumGuests(e.target.value);
									}}
									className={
										!isPerPerson ? "opacity-40 cursor-not-allowed" : ""
									}
								/>
							</div>

							<div>
								<FloatingSelect
									id="detail-currency"
									label="Currency"
									value={currency}
									onChange={(e) => setCurrency(e.target.value as Currency)}
									className="cursor-pointer"
								>
									{availableCurrencies.map((c) => (
										<option key={c} value={c}>
											{CURRENCY_LABELS[c]}
										</option>
									))}
								</FloatingSelect>
							</div>
						</div>
					</div>
				</div>

				{/* Content + booking form */}
				<div className="mt-10 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
					{/* Left: content with sticky tab nav */}
					<div className="w-full lg:flex-1 relative">
						<div className="sticky top-15 md:top-22 z-10 bg-white border-b border-black/10 w-full">
							<div className="mx-auto flex gap-6 md:gap-10 w-full">
								{visibleTabs.map((tab) => (
									<button
										key={tab.id}
										type="button"
										onClick={() => scrollToSection(tab.id)}
										className={`py-3 text-[15px] whitespace-nowrap font-medium border-b-2 -mb-px transition-colors ${
											activeTab === tab.id
												? "border-[#9E328A] text-text"
												: "border-transparent text-black/50 hover:text-text"
										}`}
									>
										{tab.label}
									</button>
								))}
							</div>
						</div>

						{/* Desktop Sections */}
						<div className="hidden md:block">
							{/* About section */}
							<section
								id="section-overview"
								ref={(el) => {
									sectionRefs.current.overview = el;
								}}
								className="pt-8"
							>
								<h2 className="text-[15px] font-semibold text-text mb-3">
									About
								</h2>
								<p className="text-[17px] font-light text-text leading-relaxed whitespace-pre-line">
									{tour.about}
								</p>
							</section>

							<div className="my-8 h-px bg-black/10" />

							{/* Inclusions section */}
							<section
								id="section-details"
								ref={(el) => {
									sectionRefs.current.details = el;
								}}
							>
								<h2 className="text-[15px] font-semibold text-text mb-1">
									Inclusions
								</h2>
								<InclusionsList items={tour.inclusions} />
							</section>

							<div className="my-8 h-px bg-black/10" />

							{/* Itinerary section (cruise only) */}
							{hasItinerary && (
								<>
									<section
										id="section-itinerary"
										ref={(el) => {
											sectionRefs.current.itinerary = el;
										}}
									>
										<h2 className="text-[15px] font-semibold text-text mb-4">
											Segments
										</h2>

										<div className="flex flex-col md:flex-row gap-6">
											{/* Day list */}
											<div className="flex flex-col gap-4 flex-1">
												{itineraryActivities.map((activity, i) => {
													const [summary, ...details] = activity.split("\n");

													return (
														<div key={i}>
															<p className="text-[17px] text-text">
																<span className="font-bold">Day {i + 1} -</span>{" "}
																<span className="font-light">{summary}</span>
															</p>
															{details.map((line, j) =>
																line.trim() ? (
																	<p
																		key={j}
																		className="text-[15px] font-light text-text leading-relaxed"
																	>
																		{line}
																	</p>
																) : null,
															)}
														</div>
													);
												})}
											</div>

											{/* Single itinerary flier image */}
											{itineraryImage && (
												<div className="relative w-full md:w-[280px] shrink-0 rounded-[5px] overflow-hidden">
													<ClickableImage
														src={itineraryImage}
														alt="Trip Itinerary"
														width={280}
														height={295}
														className="w-full h-[295px] object-cover rounded-[5px]"
														caption="Trip Itinerary"
													/>
													{/* "Tap to View" purple banner */}
													<div
														aria-hidden="true"
														className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 bg-[#9E328A] rounded-[4px] flex items-center gap-2 px-3 py-2 w-[calc(100%-16px)]"
													>
														<span className="text-white text-[12px] font-bold whitespace-nowrap flex-1">
															Tap to View Trip Itinerary
														</span>
														<svg
															width="18"
															height="18"
															viewBox="0 0 24 24"
															fill="none"
															stroke="white"
															strokeWidth="2.5"
															strokeLinecap="round"
															strokeLinejoin="round"
															aria-hidden="true"
														>
															<line x1="5" y1="12" x2="19" y2="12" />
															<polyline points="12 5 19 12 12 19" />
														</svg>
													</div>
												</div>
											)}
										</div>
									</section>

									{/* Divider */}
									<div className="my-8 h-px bg-black/10" />
								</>
							)}

							{/* 24/7 Support section */}
							<section
								id="section-more"
								ref={(el) => {
									sectionRefs.current.more = el;
								}}
							>
								<h2 className="text-[15px] font-semibold text-text mb-3">
									24/7 Support
								</h2>
								<ContactBlock contact={tour.contact} />
							</section>

							<div className="h-24" />
						</div>

						{/* Mobile Accordions */}
						<div className="block md:hidden pt-4 pb-12">
							<Accordion
								value={[activeTab]}
								onValueChange={(vals) => {
									if (vals.length > 0) setActiveTab(vals[0] as Tab);
								}}
							>
								<div className="flex flex-col border-t border-black/10 mt-6 pt-2">
									<AccordionItem
										value="overview"
										className="border-b border-black/10"
									>
										<AccordionTrigger className="text-[14px] font-medium text-text py-4 [&_[data-slot=accordion-trigger-icon]]:text-text hover:no-underline">
											About
										</AccordionTrigger>
										<AccordionContent>
											<p className="text-[17px] font-light text-text leading-relaxed whitespace-pre-line pb-4">
												{tour.about}
											</p>
										</AccordionContent>
									</AccordionItem>

									<AccordionItem
										value="details"
										className="border-b border-black/10"
									>
										<AccordionTrigger className="text-[14px] font-medium text-text py-4 [&_[data-slot=accordion-trigger-icon]]:text-text hover:no-underline">
											Inclusions
										</AccordionTrigger>
										<AccordionContent>
											<div className="pb-4">
												<InclusionsList items={tour.inclusions} />
											</div>
										</AccordionContent>
									</AccordionItem>

									{hasItinerary && (
										<AccordionItem
											value="itinerary"
											className="border-b border-black/10"
										>
											<AccordionTrigger className="text-[14px] font-medium text-text py-4 [&_[data-slot=accordion-trigger-icon]]:text-text hover:no-underline">
												Segments
											</AccordionTrigger>
											<AccordionContent>
												<div className="pb-4 flex flex-col gap-4">
													{itineraryActivities.map((activity, i) => (
														<div key={i}>
															<p className="text-[17px] text-text">
																<span className="font-bold">Day {i + 1} -</span>{" "}
																<span className="font-light">
																	{activity.split("\n")[0]}
																</span>
															</p>
														</div>
													))}
												</div>
											</AccordionContent>
										</AccordionItem>
									)}

									<AccordionItem
										value="more"
										className="border-b border-black/10"
									>
										<AccordionTrigger className="text-[14px] font-medium text-text py-4 [&_[data-slot=accordion-trigger-icon]]:text-text hover:no-underline">
											24/7 Support
										</AccordionTrigger>
										<AccordionContent>
											<div className="pb-4">
												<ContactBlock contact={tour.contact} />
											</div>
										</AccordionContent>
									</AccordionItem>
								</div>
							</Accordion>
						</div>
					</div>

					{/* Booking form */}
					<div className="w-full lg:w-[520px] xl:w-[560px] shrink-0 lg:sticky lg:top-24">
						<div className="bg-[#F9F9F9] rounded-[10px] overflow-hidden shadow-sm">
							{/* Header */}
							<div className="bg-[#9E328A] px-5 py-4">
								<h2 className="text-[17px] font-semibold text-white">
									Book Your {tour.tourType === "cruise" ? "Cruise" : "Holiday"}
								</h2>
							</div>

							<form
								onSubmit={handleSubmit}
								noValidate
								aria-busy={isSubmitting}
								className="p-5 flex flex-col gap-4"
							>
								{/* Section label */}
								<div>
									<p className="text-[17px] font-semibold text-text mb-2">
										Details
									</p>
									<div className="flex">
										<div className="h-0.5 w-16 bg-[#9E328A]" />
										<div className="h-0.5 flex-1 bg-black/10" />
									</div>
								</div>

								{/* Full name */}
								<div>
									<FloatingInput
										id="booking-name"
										type="text"
										label="Enter Full Name"
										value={form.fullName}
										error={errors.fullName}
										onChange={(e) =>
											handleFormChange("fullName", e.target.value)
										}
										autoComplete="name"
									/>
								</div>

								{/* Email + Phone */}
								<div className="flex gap-3">
									<FloatingInput
										id="booking-email"
										type="email"
										label="Enter Email Address"
										value={form.email}
										error={errors.email}
										onChange={(e) => handleFormChange("email", e.target.value)}
										autoComplete="email"
									/>
									<FloatingPhoneInput
										id="booking-phone"
										label="Enter Phone Number"
										value={form.phone}
										error={errors.phone}
										onChange={(value) => handleFormChange("phone", value)}
										autoComplete="tel"
									/>
								</div>

								{/* Check-in + Check-out */}
								<div className="flex gap-3">
									<FloatingInput
										id="booking-checkin"
										type="date"
										label="Check-in Date"
										value={form.checkIn}
										error={errors.checkIn}
										onChange={(e) =>
											handleFormChange("checkIn", e.target.value)
										}
									/>
									<FloatingInput
										id="booking-checkout"
										type="date"
										label="Check-out Date"
										value={form.checkOut}
										error={errors.checkOut}
										onChange={(e) =>
											handleFormChange("checkOut", e.target.value)
										}
									/>
								</div>

								{/* Number of Guests */}
								<div>
									<FloatingInput
										id="booking-guests"
										type="number"
										min={1}
										max={50}
										label="Number of Guests"
										value={form.numGuests}
										error={errors.numGuests}
										onChange={(e) => {
											handleFormChange("numGuests", e.target.value);
											setNumGuests(e.target.value);
										}}
										disabled={!isPerPerson}
										className={
											!isPerPerson ? "opacity-40 cursor-not-allowed" : ""
										}
									/>
								</div>

								{/* Price summary */}
								<div className="border-t border-black/10 pt-3">
									<div className="flex items-end gap-2 flex-wrap">
										<span className="text-[24px] font-bold text-text leading-none">
											{totalPriceFormatted}
										</span>
										<span className="text-[16px] text-text font-light mb-0.5">
											{selectedSelection?.label ?? ""}
										</span>
									</div>
									<p className="mt-1 text-[13px] text-black/50 font-light">
										Price may update at checkout based on availability &amp; tax
									</p>
								</div>

								{submitError ? (
									<p
										className="text-center text-sm font-medium text-[#9E328A]"
										role="alert"
									>
										{submitError}
									</p>
								) : null}

								{/* Submit */}
								<div className="border-t border-black/10 pt-3 flex justify-center">
									<button
										type="submit"
										disabled={isSubmitting}
										className="flex h-14 w-[220px] items-center justify-center rounded-full bg-[#9E328A] text-[15px] font-bold text-white transition-opacity hover:opacity-90 active:scale-99 disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E328A] focus-visible:ring-offset-2"
									>
										{isSubmitting ? "Booking..." : "Book This Tour"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
