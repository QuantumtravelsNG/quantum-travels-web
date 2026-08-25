"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
	CalendarDays,
	Clock3,
	Info,
	Users,
	Briefcase,
	Snowflake,
	UserCheck,
	ChevronDown,
} from "lucide-react";
import {
	FloatingInput,
	FloatingPhoneInput,
	FloatingTextarea,
	FloatingSelect,
} from "@/components/ui/floating-fields";
import {
	submitAirportPickupBooking,
	submitAirportDropoffBooking,
} from "@/app/actions";
import { formatDateValueForDisplay, isValidDateValue } from "@/lib/date-values";
import { isValidPhoneNumberValue } from "@/lib/phone";
import { isRemoteImage } from "@/lib/images";
import { airports } from "@/lib/airports";
import BookingSuccessDialog from "@/components/services/carServices/BookingSuccessDialog";
import type {
	Car,
	PassengerDetails,
	AirportBookingDetails,
} from "@/lib/quantum";

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function isValidEmail(value: string) {
	const trimmed = value.trim();
	return (
		trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
	);
}

function normalizeAirportName(value: string) {
	return value.trim().toLowerCase();
}

function getAirportIata(value: string) {
	return value.match(/\(([A-Z0-9]{3})\)\s*$/)?.[1] ?? "";
}

function findAirportOption(value: string) {
	const normalizedValue = normalizeAirportName(value);
	const valueIata = getAirportIata(value);

	return airports.find((airport) => {
		const normalizedName = normalizeAirportName(airport.name);
		const airportIata = getAirportIata(airport.name);

		return (
			normalizedName === normalizedValue ||
			(Boolean(valueIata) && airportIata === valueIata)
		);
	});
}

interface CarServicesBookingFormProps {
	serviceType: "airport_pickup" | "airport_dropoff";
}

export default function CarServicesBookingForm({
	serviceType,
}: CarServicesBookingFormProps) {
	const router = useRouter();

	// Session storage values
	const [bookingDetails, setBookingDetails] = useState<{
		firstLocation: string;
		secondLocation: string;
		date: string;
		time: string;
	} | null>(null);

	const [car, setCar] = useState<Car | null>(null);
	const [isValidated, setIsValidated] = useState(false);

	// Form values for booking
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [alternativePhone, setAlternativePhone] = useState("");
	// const [whatsappNumber, setWhatsappNumber] = useState("");
	// const [fullAddress, setFullAddress] = useState("");
	const [flightNumber, setFlightNumber] = useState("");
	const [terminal, setTerminal] = useState("");
	const [noteForDriver, setNoteForDriver] = useState("");

	// Errors and fields
	const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");

	// Load session details on mount and validate
	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedDetails = sessionStorage.getItem("quantum_car_booking");
			const savedCar = sessionStorage.getItem("quantum_car_booking_car");
			let valid = false;

			if (savedDetails && savedCar) {
				try {
					const parsedDetails = JSON.parse(savedDetails);
					const parsedCar = JSON.parse(savedCar);

					if (
						parsedDetails &&
						parsedDetails.firstLocation?.trim() &&
						parsedDetails.secondLocation?.trim() &&
						parsedDetails.date?.trim() &&
						isValidDateValue(parsedDetails.date.trim()) &&
						parsedDetails.time?.trim() &&
						parsedCar &&
						parsedCar.id
					) {
						setTimeout(() => {
							setBookingDetails(parsedDetails);
							setCar(parsedCar);
							setIsValidated(true);
						}, 0);
						valid = true;
					}
				} catch (e) {
					console.error("Error parsing stored booking/car details", e);
				}
			}

			if (!valid) {
				router.replace("/services/car-services");
			}
		}
	}, [router]);

	const firstLocation = bookingDetails?.firstLocation || "";
	const secondLocation = bookingDetails?.secondLocation || "";
	const selectedTime = bookingDetails?.time || "";
	const selectedDateStr = bookingDetails?.date || "";
	const selectedAirport =
		serviceType === "airport_pickup" ? firstLocation : secondLocation;
	const selectedAirportOption = useMemo(
		() => findAirportOption(selectedAirport),
		[selectedAirport],
	);
	const terminalOptions: readonly string[] =
		selectedAirportOption?.terminals ?? [];
	const hasTerminalOptions = terminalOptions.length > 0;
	const defaultTerminal =
		terminalOptions.length === 1 ? terminalOptions[0] : "";
	const terminalValue =
		hasTerminalOptions && !terminalOptions.includes(terminal)
			? defaultTerminal
			: terminal;

	// Format Date for UI (e.g. Mar 24, 2026)
	const formatUIDate = (dateStr: string) => {
		if (!dateStr) return "";
		return formatDateValueForDisplay(dateStr);
	};

	// Calculate prices and details for rendering
	const carPrice = useMemo(() => {
		if (!car) return null;
		const sp = car.servicePrices.find((p) => p.serviceType === serviceType);
		return sp && Number.isFinite(sp.price) && sp.price > 0 ? sp.price : null;
	}, [car, serviceType]);

	const capacity = useMemo(() => {
		if (!car) return { passengers: "3 Passengers", baggage: "3 Baggage" };
		const cat = car.category.toUpperCase();
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
	}, [car]);

	// Form Validation
	const validateField = (name: string, value: string): string => {
		switch (name) {
			case "fullName":
				if (!value.trim()) return "Full name is required.";
				return value.trim().length <= 100
					? ""
					: "Full name must be 100 characters or fewer.";
			case "email":
				if (!value.trim()) return "Email address is required.";
				return isValidEmail(value) ? "" : "Please enter a valid email address.";
			case "phone":
				if (!value.trim()) return "Phone number is required.";
				return isValidPhoneNumberValue(value)
					? ""
					: "Please enter a valid phone number.";
			case "terminal":
				if (!value.trim()) return "Terminal selection is required.";
				if (hasTerminalOptions && !terminalOptions.includes(value)) {
					return "Please select a valid terminal.";
				}
				return "";
			// case "fullAddress":
			// 	if (!value.trim()) return "Full address is required.";
			// 	return value.trim().length <= 180
			// 		? ""
			// 		: "Full address must be 180 characters or fewer.";
			default:
				return "";
		}
	};

	const handleBlur = (name: string, value: string) => {
		setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
	};

	const updateFieldValue = (name: string, val: string) => {
		if (name === "fullName") setFullName(val);
		else if (name === "email") setEmail(val);
		else if (name === "phone") setPhone(val);
		else if (name === "alternativePhone") setAlternativePhone(val);
		// else if (name === "whatsappNumber") setWhatsappNumber(val);
		// else if (name === "fullAddress") setFullAddress(val);
		else if (name === "flightNumber") setFlightNumber(val);
		else if (name === "terminal") setTerminal(val);
		else if (name === "noteForDriver") setNoteForDriver(val);

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleBookingSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!car) return;

		if (
			!car.isActive ||
			car.availabilityStatus !== "available" ||
			car.isAvailableForDate === false
		) {
			setSubmitError(
				"This vehicle is no longer available. Please choose another cab.",
			);
			return;
		}

		if (carPrice === null) {
			setSubmitError(
				"Price unavailable. Please choose another cab or contact us for assistance.",
			);
			return;
		}

		const formValues = {
			fullName,
			email,
			phone,
			terminal: terminalValue,
			// fullAddress,
		};
		const nextErrors: Partial<Record<string, string>> = {};
		let hasErrors = false;

		Object.entries(formValues).forEach(([name, value]) => {
			const errorMsg = validateField(name, value);
			if (errorMsg) {
				nextErrors[name] = errorMsg;
				hasErrors = true;
			}
		});

		setErrors(nextErrors);

		if (hasErrors) return;

		setIsSubmitting(true);
		setSubmitError("");

		const airport =
			serviceType === "airport_pickup" ? firstLocation : secondLocation;
		const address =
			serviceType === "airport_pickup" ? secondLocation : firstLocation;

		const airportDetails: AirportBookingDetails = {
			airport: String(airport),
			terminal: String(terminalValue.trim()),
			address: String(address),
			fullAddress: String(address.trim()),
			pickupDate: String(selectedDateStr),
			pickupTime: String(selectedTime),
		};

		const passengerDetails: PassengerDetails = {
			fullName: String(fullName.trim()),
			email: String(email.trim().toLowerCase()),
			phone: String(phone.trim()),
			alternativePhone: String(alternativePhone.trim()),
			whatsappNumber: "",
			flightNumber: String(flightNumber.trim()),
			noteForDriver: String(noteForDriver.trim()),
			companyName: "",
			additionalComment: "",
		};

		const payload = {
			carId: String(car.id),
			airportDetails,
			passengerDetails,
			quotedPrice: carPrice,
		};

		const action =
			serviceType === "airport_pickup"
				? submitAirportPickupBooking
				: submitAirportDropoffBooking;

		try {
			const result = await action(payload);
			if (!result.ok) {
				setSubmitError(result.message);
				return;
			}

			setSubmitted(true);
		} catch {
			setSubmitError(
				"We could not submit your booking. Please check your connection and try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCloseDialog = () => {
		setSubmitted(false);
		setFullName("");
		setEmail("");
		setPhone("");
		setAlternativePhone("");
		setFlightNumber("");
		setTerminal("");
		setNoteForDriver("");
		setErrors({});
		setSubmitError("");
		sessionStorage.removeItem("quantum_car_booking_car");
		sessionStorage.removeItem("quantum_car_booking");
		router.replace("/services/car-services");
	};

	if (!isValidated || !car || !bookingDetails) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-[#F8F8F8]">
				<div className="text-lg font-bold text-[#9E328A] animate-pulse">
					Loading Booking Details...
				</div>
			</div>
		);
	}

	return (
		<div className="w-full bg-white py-8 md:py-12">
			<BookingSuccessDialog
				open={submitted}
				onClose={handleCloseDialog}
				title="Booking Successful"
				description="Your booking has been received successfully. Our team will review the details and get back to you shortly."
			/>

			<div className="mx-auto max-w-[1440px] px-4 md:px-16">
				{/* Top Announcement Banner */}
				<div className="w-full bg-[#9E328A]/10 border border-[#9E328A]/20 rounded-[5px] p-4 flex items-start gap-3 mb-6 md:mb-8 max-w-[1130px] mx-auto">
					<Info className="size-5 text-[#9E328A] shrink-0 mt-0.5" />
					<p className="text-xs md:text-sm text-text font-light leading-snug">
						100% cancellation fee applies to cancellations less than 48 hours
						before pick up time
					</p>
				</div>

				<div className="grid gap-6 md:gap-8 lg:grid-cols-[520px_1fr] items-start max-w-[1130px] mx-auto">
					{/* Left Column (Overview, Car Card, Driver details) */}
					<div className="space-y-6 md:space-y-8 w-full">
						{/* Journey Overview Card */}
						<div className="rounded-[10px] bg-[#f9f9f9] p-5 md:p-6 ">
							<div className="rounded-[5px] bg-[#9E328A] p-5 text-white shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
								<h2 className="text-[18px] md:text-xl font-bold mb-4">
									Pick up & Drop off
								</h2>

								<div className="relative pl-6 border-l border-white/30 space-y-6 ml-2 mb-2">
									{/* Origin */}
									<div className="relative">
										<span className="absolute -left-[30px] top-1 flex size-[12px] items-center justify-center">
											<span className="size-3 rounded-full bg-white ring-4 ring-white/20" />
										</span>
										<p className="text-[10px] font-light text-white/70 uppercase">
											{serviceType === "airport_pickup"
												? "Pick Up From Airport"
												: "Pick Up Address"}
										</p>
										<p className="text-[12px] md:text-sm font-medium mt-1 leading-snug">
											{firstLocation}
										</p>
									</div>

									{/* Destination */}
									<div className="relative">
										<span className="absolute -left-[30px] top-1 flex size-[12px] items-center justify-center">
											<span className="size-3 rounded-full bg-white ring-4 ring-white/20" />
										</span>
										<p className="text-[10px] font-light text-white/70 uppercase">
											{serviceType === "airport_pickup"
												? "Drop Off Address"
												: "Drop Off At Airport"}
										</p>
										<p className="text-[12px] md:text-sm font-medium mt-1 leading-snug">
											{secondLocation}
										</p>
									</div>
								</div>

								<div className="border-t border-white/20 my-4" />

								<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light">
									<div className="flex items-center gap-2">
										<Clock3 className="size-4 shrink-0" />
										<span>{selectedTime}</span>
									</div>
									<div className="flex items-center gap-2">
										<CalendarDays className="size-4 shrink-0" />
										<span>{formatUIDate(selectedDateStr)}</span>
									</div>
								</div>
							</div>

							{/* Terminal Field */}
							<div className="mt-5">
								{hasTerminalOptions ? (
									<FloatingSelect
										id="terminal-select"
										label="Airport Terminal"
										value={terminalValue}
										error={errors.terminal}
										onBlur={() => handleBlur("terminal", terminalValue)}
										onChange={(e) =>
											updateFieldValue("terminal", e.target.value)
										}
										trailingIcon={<ChevronDown className="size-5 text-text" />}
										hideDefaultChevron
										className="h-14 text-sm"
									>
										<option value="">Select Terminal</option>
										{terminalOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</FloatingSelect>
								) : (
									<FloatingInput
										id="terminal-input"
										label="Enter Airport Terminal"
										value={terminal}
										error={errors.terminal}
										onBlur={() => handleBlur("terminal", terminal)}
										onChange={(e) =>
											updateFieldValue("terminal", e.target.value)
										}
										className="h-14 text-sm"
									/>
								)}
							</div>
						</div>

						{/* Car Details Card */}
						<div className="rounded-[10px] bg-[#f9f9f9] overflow-hidden  flex flex-col border border-black/2">
							{/* Car Image container */}
							<div className="relative w-full h-[180px] bg-white flex items-center justify-center p-4">
								<Image
									src={car.image}
									alt={car.name}
									fill
									priority
									sizes="(max-width: 768px) 100vw, 520px"
									className="object-contain p-2"
									unoptimized={isRemoteImage(car.image)}
								/>
							</div>

							{/* Car Info container */}
							<div className="p-5 md:p-6 space-y-4">
								<div>
									<h3 className="text-lg md:text-xl font-black text-text uppercase tracking-tight">
										{car.name}
									</h3>
									<p className="text-[12px] md:text-xs font-medium text-black/50 uppercase tracking-wide mt-0.5">
										{car.category} - Premium
									</p>
									<p className="text-xs font-light text-black/60 mt-1">
										Inclusive
									</p>
								</div>

								{/* Features list */}
								<div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
									<div className="flex items-center gap-2 text-xs font-light text-black/80">
										<Users className="size-4 text-text shrink-0" />
										<span>{capacity.passengers}</span>
									</div>
									<div className="flex items-center gap-2 text-xs font-light text-black/80">
										<Briefcase className="size-4 text-text shrink-0" />
										<span>{capacity.baggage}</span>
									</div>
									<div className="flex items-center gap-2 text-xs font-light text-black/80">
										<Snowflake className="size-4 text-text shrink-0" />
										<span className="truncate">Fully Airconditioned</span>
									</div>
									<div className="flex items-center gap-2 text-xs font-light text-black/80">
										<UserCheck className="size-4 text-text shrink-0" />
										<span className="truncate">Professional Drivers</span>
									</div>
								</div>
							</div>
						</div>

						{/* Driver & Cab Details Notice */}
						<div className="rounded-[10px] bg-[#f9f9f9] p-5 ">
							<h3 className="text-[16px] md:text-lg font-bold text-text mb-1">
								Driver & Cab Details
							</h3>
							<p className="text-xs md:text-sm font-light text-black/60 leading-normal">
								Cab and driver details will be shared after booking is confirmed
							</p>
						</div>
					</div>

					{/* Right Column (Passenger Details Form, Pricing, Submit Button) */}
					<div className="rounded-[10px] bg-[#f9f9f9] overflow-hidden  flex flex-col w-full">
						<div className="bg-[#9E328A] h-[56px] flex items-center px-5 shrink-0">
							<h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
								Passenger Details
							</h2>
						</div>

						<form
							onSubmit={handleBookingSubmit}
							className="p-5 md:p-8 space-y-6"
						>
							<div>
								<span className="text-[14px] md:text-base font-bold text-text uppercase tracking-wider pb-1.5 border-b-2 border-[#9E328A]">
									Details
								</span>
								<div className="w-full h-px bg-black/10 mt-1" />
							</div>

							<div className="space-y-4 pt-2">
								<FloatingInput
									id="book-fullname"
									label="Enter Full Name"
									value={fullName}
									disabled={isSubmitting}
									error={errors.fullName}
									autoComplete="name"
									onBlur={() => handleBlur("fullName", fullName)}
									onChange={(e) => updateFieldValue("fullName", e.target.value)}
									className="h-12 md:h-14 text-sm"
								/>

								<FloatingInput
									id="book-email"
									type="email"
									label="Enter Email Address"
									value={email}
									disabled={isSubmitting}
									error={errors.email}
									autoComplete="email"
									onBlur={() => handleBlur("email", email)}
									onChange={(e) => updateFieldValue("email", e.target.value)}
									className="h-12 md:h-14 text-sm"
								/>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FloatingPhoneInput
										id="book-phone"
										label="Enter Phone Number"
										value={phone}
										disabled={isSubmitting}
										error={errors.phone}
										onBlur={() => handleBlur("phone", phone)}
										onChange={(val) => updateFieldValue("phone", val)}
										className="h-12 md:h-14 text-sm"
									/>

									<FloatingPhoneInput
										id="book-alt-phone"
										label="Enter Alternative Number"
										value={alternativePhone}
										disabled={isSubmitting}
										onChange={(val) =>
											updateFieldValue("alternativePhone", val)
										}
										className="h-12 md:h-14 text-sm"
									/>
								</div>

								{/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FloatingPhoneInput
										id="book-whatsapp"
										label="Enter WhatsApp Number"
										value={whatsappNumber}
										disabled={isSubmitting}
										onChange={(val) => updateFieldValue("whatsappNumber", val)}
										className="h-12 md:h-14 text-sm"
									/>
								</div> */}

								<div className="flex items-center gap-2 text-black/50 pl-1 py-1">
									<Info className="size-4 shrink-0" />
									<span className="text-[10px] md:text-xs font-light">
										Please enter a valid email address & phone number
									</span>
								</div>

								{/* <FloatingInput
									id="book-full-address"
									label="Full Address"
									value={fullAddress}
									disabled={isSubmitting}
									error={errors.fullAddress}
									autoComplete="street-address"
									onBlur={() => handleBlur("fullAddress", fullAddress)}
									onChange={(e) =>
										updateFieldValue("fullAddress", e.target.value)
									}
									className="h-12 md:h-14 text-sm"
								/> */}

								<FloatingInput
									id="book-flightnumber"
									label="Enter Flight Number (Optional)"
									value={flightNumber}
									disabled={isSubmitting}
									error={errors.flightNumber}
									onBlur={() => handleBlur("flightNumber", flightNumber)}
									onChange={(e) =>
										updateFieldValue("flightNumber", e.target.value)
									}
									className="h-12 md:h-14 text-sm"
								/>

								<FloatingTextarea
									id="book-note"
									label="Add a note for driver"
									value={noteForDriver}
									disabled={isSubmitting}
									onChange={(e) =>
										updateFieldValue("noteForDriver", e.target.value)
									}
									className="!min-h-[80px] !resize-none text-sm"
								/>
							</div>

							<div className="border-t border-black/10 pt-5 space-y-4">
								<div>
									<p className="text-[20px] md:text-2xl font-bold text-text leading-none">
										{carPrice !== null
											? `NGN ${carPrice.toLocaleString("en-NG", {
													minimumFractionDigits: 2,
												})}`
											: "Price unavailable"}
									</p>
									<p className="text-[10px] md:text-xs font-light text-black/40 mt-1.5 leading-snug">
										{carPrice !== null
											? "Price may update at checkout based on availability & tax"
											: "Please choose another cab or contact us for assistance."}
									</p>
								</div>

								{submitError && (
									<p
										className="text-xs text-center font-medium text-[#9E328A]"
										role="alert"
									>
										{submitError}
									</p>
								)}

								<div className="flex justify-center pt-2">
									<button
										type="submit"
										disabled={isSubmitting || carPrice === null}
										className="flex h-12 md:h-14 w-full sm:w-[260px] items-center justify-center rounded-full bg-[#9E328A] text-[14px] md:text-base font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 shadow-[0px_4px_12px_rgba(158,50,138,0.25)] disabled:cursor-not-allowed disabled:opacity-80"
									>
										{isSubmitting ? "Processing..." : "Proceed"}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
