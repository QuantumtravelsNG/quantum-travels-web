"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
	CalendarDays,
	Clock3,
	Users,
	Briefcase,
	Snowflake,
	UserCheck,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import PoliciesDialog from "./PoliciesDialog";
import { getCarsAvailabilityAction } from "@/app/actions";
import {
	addDaysToDateValue,
	formatDateValue,
	formatDateValueForDisplay,
	getTodayDateValue,
	parseDateValue,
} from "@/lib/date-values";
import { isRemoteImage } from "@/lib/images";
import type { Car } from "@/lib/quantum";

interface CarServicesSelectionProps {
	serviceType: "airport_pickup" | "airport_dropoff";
}

export default function CarServicesSelection({
	serviceType,
}: CarServicesSelectionProps) {
	const router = useRouter();

	// Session storage values
	const [bookingDetails, setBookingDetails] = useState<{
		firstLocation: string;
		secondLocation: string;
		date: string;
		time: string;
	} | null>(null);

	const [selectedDateStr, setSelectedDateStr] = useState("");
	const [cars, setCars] = useState<Car[]>([]);
	const [loading, setLoading] = useState(true);

	const [policiesOpen, setPoliciesOpen] = useState(false);

	// Load session details on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const saved = sessionStorage.getItem("quantum_car_booking");
			let isValid = false;

			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					if (
						parsed &&
						parsed.firstLocation?.trim() &&
						parsed.secondLocation?.trim() &&
						parsed.date?.trim() &&
						parsed.time?.trim()
					) {
						setBookingDetails(parsed);
						setSelectedDateStr(parsed.date.trim());
						isValid = true;
					}
				} catch (e) {
					console.error("Error parsing stored booking details", e);
				}
			}

			if (!isValid) {
				router.replace("/services/car-services");
			}
		}
	}, [router]);

	// Fetch cars whenever date changes
	useEffect(() => {
		if (!selectedDateStr || !bookingDetails) return;

		async function fetchCars() {
			setLoading(true);
			try {
				const fetched = await getCarsAvailabilityAction(
					serviceType,
					selectedDateStr,
				);
				setCars(fetched);
			} catch (err) {
				console.error("Error fetching available cars", err);
			} finally {
				setLoading(false);
			}
		}

		fetchCars();
	}, [bookingDetails, selectedDateStr, serviceType]);

	const firstLocation = bookingDetails?.firstLocation || "";
	const secondLocation = bookingDetails?.secondLocation || "";
	const selectedTime = bookingDetails?.time || "";
	// Generate 7 days around the selected date
	const days = useMemo(() => {
		if (!selectedDateStr) return [];
		const selected = parseDateValue(selectedDateStr);
		if (!selected) {
			return [];
		}

		const arr = [];
		for (let i = -3; i <= 3; i++) {
			const d = new Date(selected);
			d.setDate(selected.getDate() + i);
			arr.push(d);
		}
		return arr;
	}, [selectedDateStr]);

	// Format Date for UI (e.g. Mar 24, 2026)
	const formatUIDate = (date: Date) => {
		return formatDateValueForDisplay(formatDateValue(date));
	};

	// Format Date for API (YYYY-MM-DD)
	const formatAPIDate = (date: Date) => {
		return formatDateValue(date);
	};

	// Update selected date state
	const handleDateSelect = (date: Date) => {
		const nextDateStr = formatAPIDate(date);
		setSelectedDateStr(nextDateStr);
		// Update saved details in session storage
		if (bookingDetails) {
			const updated = { ...bookingDetails, date: nextDateStr };
			setBookingDetails(updated);
			sessionStorage.setItem("quantum_car_booking", JSON.stringify(updated));
		}
	};

	// Go back or forward 1 day
	const handleSlideDate = (offset: number) => {
		if (!selectedDateStr) return;
		const nextDateStr = addDaysToDateValue(selectedDateStr, offset);
		const nextDate = nextDateStr ? parseDateValue(nextDateStr) : null;
		if (nextDate) {
			handleDateSelect(nextDate);
		}
	};

	// Check if a date is in the past
	const isPastDate = (date: Date) => {
		return formatDateValue(date) < getTodayDateValue();
	};

	// Calculate prices and details for rendering
	const getCarPrice = (car: Car) => {
		const sp = car.servicePrices.find((p) => p.serviceType === serviceType);
		return sp && Number.isFinite(sp.price) && sp.price > 0 ? sp.price : null;
	};

	const getCapacityDetails = (category: string) => {
		const cat = category.toUpperCase();
		if (cat.includes("SUV")) {
			return { passengers: "4 Passengers", baggage: "4 Baggage" };
		}
		if (cat.includes("VAN")) {
			return { passengers: "8 Passengers", baggage: "6 Baggage" };
		}
		if (cat.includes("BUS")) {
			return { passengers: "15 Passengers", baggage: "10 Baggage" };
		}
		return { passengers: "3 Passengers", baggage: "3 Baggage" }; // Sedan / Default
	};

	function isBookableCar(car: Car) {
		return (
			car.isActive &&
			car.availabilityStatus === "available" &&
			car.isAvailableForDate !== false
		);
	}

	// Filter available cars based on vehicle status and selected date.
	const availableCars = useMemo(() => {
		return cars.filter(isBookableCar);
	}, [cars]);

	return (
		<div className="w-full bg-white py-8 md:py-12">
			<div className="mx-auto max-w-[1440px] px-4 md:px-16">
				{/* Top Headers Section */}
				<div className="flex items-end justify-between gap-4 mb-4 md:mb-6">
					<div>
						<h1 className="text-[16px] md:text-[24px] font-black text-text tracking-tight leading-none">
							Select a Cab Type
						</h1>
						<p className="text-[12px] md:text-[20px] font-light text-black/70 mt-1 md:mt-2">
							Choose what type of vehicle speaks to you
						</p>
					</div>
					<div className="text-right">
						<span className="text-[12px] md:text-[20px] font-bold text-[#9E328A] md:text-[#9e328a]">
							{loading
								? "Loading..."
								: `${availableCars.length} ${
										availableCars.length === 1 ? "Result" : "Results"
									}`}
						</span>
					</div>
				</div>

				{/* Date Slider Calendar */}
				<div className="relative flex items-center justify-between rounded-[10px] bg-[#f9f9f9] h-[80px] md:h-[96px] border border-black/2 px-2 md:px-4 mb-6 md:mb-8 overflow-hidden select-none">
					<button
						onClick={() => handleSlideDate(-1)}
						className="flex size-8 md:size-10 items-center justify-center rounded-full hover:bg-black/[0.04] transition-colors shrink-0"
						aria-label="Previous day"
					>
						<ChevronLeft className="size-5 md:size-6 text-text" />
					</button>

					<div className="flex flex-1 items-center justify-around overflow-hidden gap-1 md:gap-2 px-1 md:px-4 max-w-[1100px] mx-auto">
						{days.map((day, idx) => {
							const dayStr = formatAPIDate(day);
							const isActive = dayStr === selectedDateStr;
							const past = isPastDate(day);
							const label = formatUIDate(day);

							// Generate divider lines
							const showDivider = idx > 0;

							return (
								<div key={dayStr} className="flex items-center w-full">
									{showDivider && (
										<div className="h-[44px] md:h-[72px] w-px bg-black/10 shrink-0 self-center hidden sm:block" />
									)}
									<button
										onClick={() => handleDateSelect(day)}
										className={[
											"flex-1 flex flex-col items-center justify-center h-[80px] md:h-[96px] rounded-[5px] md:rounded-[10px] transition-colors px-1 md:px-2",
											isActive
												? "bg-[#9E328A] text-white!"
												: past
													? "opacity-20 text-text cursor-not-allowed"
													: "text-text hover:bg-black/[0.02]",
										].join(" ")}
										disabled={past}
									>
										<span className="text-[10px] md:text-[14px] md:text-sm font-light uppercase tracking-wide">
											{label.split(",")[0]}
										</span>
										<span className="text-[12px] md:text-[16px] md:text-base font-bold mt-0.5 md:mt-1">
											{past ? "No Fares" : "Available"}
										</span>
									</button>
								</div>
							);
						})}
					</div>

					<button
						onClick={() => handleSlideDate(1)}
						className="flex size-8 md:size-10 items-center justify-center rounded-full hover:bg-black/[0.04] transition-colors shrink-0"
						aria-label="Next day"
					>
						<ChevronRight className="size-5 md:size-6 text-text" />
					</button>
				</div>

				{/* Two-Column Booking Overview & Fleet List */}
				<div className="grid gap-6 md:gap-8 lg:grid-cols-[400px_1fr] items-start">
					{/* Left Journey Overview */}
					<div className="rounded-[8px] md:rounded-[10px] bg-[#9E328A] p-5 md:p-6 text-white shadow-[0px_2px_8px_1px_rgba(0,0,0,0.08)] lg:sticky lg:top-28 w-full">
						<h2 className="text-[18px] md:text-xl font-bold mb-4 md:mb-6">
							Journey Overview
						</h2>

						<div className="relative pl-6 border-l border-white/30 space-y-6 md:space-y-8 mb-5 md:mb-6 ml-2">
							{/* Origin */}
							<div className="relative">
								<span className="absolute -left-[30px] top-1 flex size-[12px] items-center justify-center">
									<span className="size-3 rounded-full bg-white ring-4 ring-white/20" />
								</span>
								<p className="text-[10px] md:text-xs font-light text-white/70 uppercase">
									{serviceType === "airport_pickup"
										? "Pick Up From Airport"
										: "Pick Up Address"}
								</p>
								<p className="text-[12px] md:text-[14px] md:text-base font-medium mt-1 leading-snug">
									{firstLocation}
								</p>
							</div>

							{/* Destination */}
							<div className="relative">
								<span className="absolute -left-[30px] top-1 flex size-[12px] items-center justify-center">
									<span className="size-3 rounded-full bg-white ring-4 ring-white/20" />
								</span>
								<p className="text-[10px] md:text-xs font-light text-white/70 uppercase">
									{serviceType === "airport_pickup"
										? "Drop Off Address"
										: "Drop Off At Airport"}
								</p>
								<p className="text-[12px] md:text-[14px] md:text-base font-medium mt-1 leading-snug">
									{secondLocation}
								</p>
							</div>
						</div>

						<div className="border-t border-white/20 my-5 md:my-6" />

						<div className="flex flex-wrap gap-x-6 gap-y-3 mb-6 md:mb-8">
							<div className="flex items-center gap-2 text-[14px] md:text-base font-light">
								<Clock3 className="size-4 md:size-5 shrink-0" />
								<span>{selectedTime}</span>
							</div>
							<div className="flex items-center gap-2 text-[14px] md:text-base font-light">
								<CalendarDays className="size-4 md:size-5 shrink-0" />
								<span>
									{selectedDateStr
										? formatDateValueForDisplay(selectedDateStr)
										: ""}
								</span>
							</div>
						</div>

						<button
							onClick={() =>
								router.push("/services/car-services#car-services-reservation")
							}
							className="flex h-10 md:h-12 w-full items-center justify-center rounded-[50px] bg-white text-[12px] md:text-sm font-bold text-[#9E328A] transition-transform hover:scale-[1.01] active:scale-99 active:translate-y-px shadow-[0px_4px_12px_rgba(0,0,0,0.1)]"
						>
							Edit Details
						</button>
					</div>

					{/* Right Fleet Cards or Empty State */}
					<div className="space-y-4 md:space-y-6 flex-1 w-full">
						{loading ? (
							// Skeleton Loaders
							<div className="space-y-4 md:space-y-6">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="h-[360px] md:h-[260px] w-full rounded-[10px] bg-white/60 animate-pulse shadow-[0px_2px_8px_rgba(0,0,0,0.03)]"
									/>
								))}
							</div>
						) : availableCars.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
								<div className="relative size-[140px] overflow-hidden shrink-0">
									<Image
										src="/ourServices/emptyState.svg"
										alt="No fares available globe"
										fill
										priority
										className="object-contain"
									/>
								</div>
								<div className="text-[16px] md:text-[20px] font-medium text-text text-center mt-8 leading-relaxed max-w-xl mx-auto">
									<p className="leading-relaxed mb-0">
										There are no available fares at the moment please check back
										later.
									</p>
									<p className="leading-relaxed mt-2 md:mt-1">
										Please{" "}
										<Link
											href="/contact-us"
											className="text-[#9E328A] md:text-[#9e328a] font-bold underline decoration-solid decoration-from-font underline-offset-4"
										>
											Contact Us
										</Link>{" "}
										if you need further assistance.
									</p>
								</div>
							</div>
						) : (
							availableCars.map((car) => {
								const price = getCarPrice(car);
								const hasPrice = price !== null;
								const capacity = getCapacityDetails(car.category);

								return (
									<div
										key={car.id}
										className="relative flex flex-col md:flex-row rounded-[8px] md:rounded-[10px] bg-[#f9f9f9] overflow-hidden border border-black/2"
									>
										{/* Car Image Column */}
										<div className="relative w-full md:w-[300px] h-[180px] md:h-[260px] bg-[#f9f9f9] flex items-center justify-center shrink-0 p-4">
											<Image
												src={car.image}
												alt={car.name}
												fill
												sizes="(max-width: 768px) 100vw, 300px"
												className="object-contain p-2 md:p-4 transition-transform duration-500 hover:scale-102"
												unoptimized={isRemoteImage(car.image)}
											/>
										</div>

										{/* Car Info Details Column */}
										<div className="flex-1 flex flex-col justify-between p-4 md:py-8 md:px-8 border-t md:border-t-0 md:border-r border-black/10">
											<div>
												<h3 className="text-[20px] md:text-2xl font-black text-text uppercase tracking-tight leading-none">
													{car.name}
												</h3>
												<p className="text-[16px] md:text-sm font-medium text-black/50 mt-1 uppercase tracking-wide">
													{car.category} - Premium
												</p>
												<p className="text-[14px] md:text-sm font-light text-black/70 mt-1 md:mt-2">
													Inclusive
												</p>
											</div>

											{/* Features List */}
											<div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 md:mt-0">
												<div className="flex items-center gap-2 text-[14px] font-light text-black/80">
													<Users className="size-[16px] text-text shrink-0" />
													<span>{capacity.passengers}</span>
												</div>
												<div className="flex items-center gap-2 text-[14px] font-light text-black/80">
													<Briefcase className="size-[16px] text-text shrink-0" />
													<span>{capacity.baggage}</span>
												</div>
												<div className="flex items-center gap-2 text-[14px] font-light text-black/80">
													<Snowflake className="size-[16px] text-text shrink-0" />
													<span className="truncate">Fully Airconditioned</span>
												</div>
												<div className="flex items-center gap-2 text-[14px] font-light text-black/80">
													<UserCheck className="size-[16px] text-text shrink-0" />
													<span className="truncate">Professional Drivers</span>
												</div>
											</div>

											{/* Read Policies button */}
											<div className="mt-4 md:mt-2">
												<button
													onClick={() => setPoliciesOpen(true)}
													className="text-[14px] font-medium text-[#9E328A] underline underline-offset-4 decoration-1 hover:text-[#8a2b78] transition-colors cursor-pointer"
												>
													Read Policies
												</button>
											</div>
										</div>

										{/* Divider for mobile cards */}
										<div className="block md:hidden border-t border-[#f0f0f0] w-full" />

										{/* Price and Book Action Column */}
										<div className="w-full md:w-[200px] flex md:flex-col justify-between md:justify-center items-center p-4 md:p-6 gap-4 shrink-0">
											<div className="text-left md:text-center w-full">
												<p className="text-[16px] md:text-xl font-bold text-text leading-none">
													{hasPrice
														? `NGN ${price.toLocaleString("en-NG", {
																minimumFractionDigits: 2,
															})}`
														: "Price unavailable"}
												</p>
												<p className="text-[10px] md:text-xs font-light text-black/50 mt-1">
													{hasPrice
														? "Tax Included"
														: "Please contact us for assistance"}
												</p>
											</div>

											<button
												disabled={!hasPrice}
												onClick={() => {
													if (!hasPrice) return;
													sessionStorage.setItem(
														"quantum_car_booking_car",
														JSON.stringify(car),
													);
													router.push(
														`/services/car-services/${serviceType === "airport_pickup" ? "pickup" : "dropoff"}/book`,
													);
												}}
												className="flex h-[38px] md:h-12 w-[124px] md:w-full items-center justify-center rounded-full bg-[#9E328A] text-[12px] md:text-sm font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 shadow-[0px_4px_12px_rgba(158,50,138,0.2)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#9E328A]"
											>
												Book Now
											</button>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>

			{/* Policies Modal Dialog */}
			<PoliciesDialog
				open={policiesOpen}
				onClose={() => setPoliciesOpen(false)}
			/>
		</div>
	);
}
