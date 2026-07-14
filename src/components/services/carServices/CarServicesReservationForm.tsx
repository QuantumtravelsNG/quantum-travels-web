"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
	CalendarDays,
	ChevronDown,
	ChevronsUpDown,
	Clock3,
	Info,
	MapPin,
} from "lucide-react";
import { FloatingInput, FloatingSelect } from "@/components/ui/floating-fields";
import { searchAirportsAction } from "@/app/actions";
import { getTodayDateValue, isValidDateValue } from "@/lib/date-values";

type BookingMode = "pickup" | "dropoff" | "hire";

type BookingFormState = {
	primaryLocation: string;
	secondaryLocation: string;
	date: string;
	time: string;
	duration: string;
	vehicleType: string;
};

type StoredBookingData =
	| {
			type: "pickup" | "dropoff";
			firstLocation: string;
			secondLocation: string;
			date: string;
			time: string;
	  }
	| {
			type: "hire";
			origin: string;
			destination: string;
			duration: string;
			vehicleType: string;
	  };

type BookingModeConfig = {
	label: string;
	route: string;
	fields: {
		primaryLabel: string;
		secondaryLabel: string;
		thirdLabel: string;
		fourthLabel: string;
	};
};

const MODE_CONFIG: Record<BookingMode, BookingModeConfig> = {
	pickup: {
		label: "Airport Pick Up",
		route: "/services/car-services/pickup",
		fields: {
			primaryLabel: "Pick Up From Airport",
			secondaryLabel: "Drop Off Address (Select City)",
			thirdLabel: "Pick Up Date",
			fourthLabel: "Pick Up Time",
		},
	},
	dropoff: {
		label: "Airport Drop Off",
		route: "/services/car-services/dropoff",
		fields: {
			primaryLabel: "Pick Up Address (Select City)",
			secondaryLabel: "Drop Off At Airport",
			thirdLabel: "Pick Up Date",
			fourthLabel: "Pick Up Time",
		},
	},
	hire: {
		label: "Car Hire",
		route: "/services/car-services/hire",
		fields: {
			primaryLabel: "Origin",
			secondaryLabel: "Destination",
			thirdLabel: "Rental Duration",
			fourthLabel: "Vehicle Type",
		},
	},
};

const PICKUP_TIME_OPTIONS = [
	"06:00 AM",
	"08:00 AM",
	"10:00 AM",
	"12:00 PM",
	"02:00 PM",
	"04:00 PM",
	"06:00 PM",
	"08:00 PM",
];

const RENTAL_DURATION_OPTIONS = [
	"4 hours",
	"8 hours",
	"12 hours",
	"1 day",
	"2 days",
	"3 days",
	"1 week",
	"Multiple weeks",
];

const VEHICLE_TYPE_OPTIONS = ["Sedan", "SUV", "Executive", "Van", "Bus"];
const CITY_OPTIONS = [
	"Lagos",
	"Ibadan",
	"Abeokuta",
	"Ilorin",
	"Osogbo",
	"Port Harcourt",
	"Kano",
	"Kaduna",
	"Akure",
	"Benin",
	"Uyo",
];

const EMPTY_BOOKING_FORM: BookingFormState = {
	primaryLocation: "",
	secondaryLocation: "",
	date: "",
	time: "",
	duration: "",
	vehicleType: "",
};

function isStoredBookingData(value: unknown): value is StoredBookingData {
	if (!value || typeof value !== "object") {
		return false;
	}

	const data = value as Partial<Record<string, unknown>>;

	if (data.type === "pickup" || data.type === "dropoff") {
		return (
			typeof data.firstLocation === "string" &&
			typeof data.secondLocation === "string" &&
			typeof data.date === "string" &&
			typeof data.time === "string"
		);
	}

	if (data.type === "hire") {
		return (
			typeof data.origin === "string" &&
			typeof data.destination === "string" &&
			typeof data.duration === "string" &&
			typeof data.vehicleType === "string"
		);
	}

	return false;
}

function getInitialBookingState(): {
	mode: BookingMode;
	form: BookingFormState;
} {
	if (typeof window === "undefined") {
		return { mode: "pickup", form: { ...EMPTY_BOOKING_FORM } };
	}

	const saved = window.sessionStorage.getItem("quantum_car_booking");
	if (!saved) {
		return { mode: "pickup", form: { ...EMPTY_BOOKING_FORM } };
	}

	try {
		const parsed: unknown = JSON.parse(saved);
		if (!isStoredBookingData(parsed)) {
			return { mode: "pickup", form: { ...EMPTY_BOOKING_FORM } };
		}

		if (parsed.type === "hire") {
			return {
				mode: parsed.type,
				form: {
					primaryLocation: parsed.origin,
					secondaryLocation: parsed.destination,
					date: "",
					time: "",
					duration: parsed.duration,
					vehicleType: parsed.vehicleType,
				},
			};
		}

		return {
			mode: parsed.type,
			form: {
				primaryLocation: parsed.firstLocation,
				secondaryLocation: parsed.secondLocation,
				date: parsed.date,
				time: parsed.time,
				duration: "",
				vehicleType: "",
			},
		};
	} catch (error) {
		console.error("Error restoring stored car booking details", error);
		return { mode: "pickup", form: { ...EMPTY_BOOKING_FORM } };
	}
}

function ModeTab({
	active,
	compact,
	disabled,
	label,
	onClick,
}: {
	active: boolean;
	compact?: boolean;
	disabled?: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={[
				"rounded-full border transition-colors active:scale-99 disabled:cursor-not-allowed disabled:opacity-60",
				compact
					? "h-[30px] min-w-[96px] px-4 text-[10px]"
					: "h-12 min-w-[120px] px-8 text-[14px]",
				active
					? "border-[#9E328A] bg-[#9E328A] font-extrabold text-white"
					: "border-black/20 bg-white font-medium text-text hover:bg-black/[0.02] disabled:hover:bg-white",
			].join(" ")}
		>
			{label}
		</button>
	);
}

type CarServicesReservationFormProps = {
	variant?: "default" | "hero";
};

export default function CarServicesReservationForm({
	variant = "default",
}: CarServicesReservationFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [initialBooking] = useState(getInitialBookingState);
	const [mode, setMode] = useState<BookingMode>(initialBooking.mode);
	const [form, setForm] = useState<BookingFormState>(initialBooking.form);

	const [errors, setErrors] = useState<
		Partial<Record<keyof BookingFormState, string>>
	>({});

	const config = MODE_CONFIG[mode];
	const isHeroVariant = variant === "hero";
	const isFormDisabled = isSubmitting || isPending;
	const minTransferDate = useMemo(() => {
		return getTodayDateValue();
	}, []);

	const fourthOptions = useMemo(() => {
		if (mode === "hire") {
			return VEHICLE_TYPE_OPTIONS;
		}

		return PICKUP_TIME_OPTIONS;
	}, [mode]);

	const thirdOptions = useMemo(() => {
		if (mode === "hire") {
			return RENTAL_DURATION_OPTIONS;
		}

		return [];
	}, [mode]);

	function updateField(field: keyof BookingFormState, value: string) {
		setForm((current) => ({ ...current, [field]: value }));
		if (errors[field]) {
			setErrors((current) => ({ ...current, [field]: undefined }));
		}
	}

	function isCityField(field: "primaryLocation" | "secondaryLocation") {
		return (
			(mode === "pickup" && field === "secondaryLocation") ||
			(mode === "dropoff" && field === "primaryLocation")
		);
	}

	const [airportSuggestions, setAirportSuggestions] = useState<
		{ name: string; iata: string }[]
	>([]);
	const [activeSearchField, setActiveSearchField] = useState<
		"primary" | "secondary" | null
	>(null);

	const handleLocationChange = async (
		field: "primaryLocation" | "secondaryLocation",
		val: string,
	) => {
		updateField(field, val);

		if (isCityField(field)) {
			const normalizedValue = val.trim().toLowerCase();
			setActiveSearchField(
				field === "primaryLocation" ? "primary" : "secondary",
			);
			setAirportSuggestions(
				CITY_OPTIONS.filter((city) =>
					city.toLowerCase().includes(normalizedValue),
				).map((city) => ({ name: city, iata: city })),
			);
			return;
		}

		const isAirportField =
			(mode === "pickup" && field === "primaryLocation") ||
			(mode === "dropoff" && field === "secondaryLocation");

		if (isAirportField && val.trim().length >= 2) {
			setActiveSearchField(
				field === "primaryLocation" ? "primary" : "secondary",
			);
			try {
				const results = await searchAirportsAction(val);
				setAirportSuggestions(results);
			} catch (err) {
				console.error("Error searching airports:", err);
				setAirportSuggestions([]);
			}
		} else {
			setAirportSuggestions([]);
			setActiveSearchField(null);
		}
	};

	function handleLocationFocus(field: "primaryLocation" | "secondaryLocation") {
		if (!isCityField(field)) return;
		setActiveSearchField(field === "primaryLocation" ? "primary" : "secondary");
		setAirportSuggestions(
			CITY_OPTIONS.map((city) => ({ name: city, iata: city })),
		);
	}

	function handleModeChange(nextMode: BookingMode) {
		if (isFormDisabled) {
			return;
		}

		setMode(nextMode);
		setErrors({});
		setAirportSuggestions([]);
		setActiveSearchField(null);
		setForm({ ...EMPTY_BOOKING_FORM });
	}

	function validateForm(): boolean {
		const newErrors: Partial<Record<keyof BookingFormState, string>> = {};

		if (mode === "hire") {
			if (!form.primaryLocation.trim()) {
				newErrors.primaryLocation = "Origin is required.";
			}
			if (!form.secondaryLocation.trim()) {
				newErrors.secondaryLocation = "Destination is required.";
			}
			if (!form.duration.trim()) {
				newErrors.duration = "Rental duration is required.";
			}
			if (!form.vehicleType.trim()) {
				newErrors.vehicleType = "Vehicle type is required.";
			}
		} else {
			if (!form.primaryLocation.trim()) {
				newErrors.primaryLocation = `${MODE_CONFIG[mode].fields.primaryLabel} is required.`;
			}
			if (!form.secondaryLocation.trim()) {
				newErrors.secondaryLocation = `${MODE_CONFIG[mode].fields.secondaryLabel} is required.`;
			}
			const cityField =
				mode === "pickup" ? "secondaryLocation" : "primaryLocation";
			const cityValue = form[cityField].trim().toLowerCase();
			if (
				cityValue &&
				!CITY_OPTIONS.some((city) => city.toLowerCase() === cityValue)
			) {
				newErrors[cityField] = "Please select a valid city.";
			}
			if (!form.date.trim()) {
				newErrors.date = "Date is required.";
			} else if (!isValidDateValue(form.date)) {
				newErrors.date = "Please choose a valid date.";
			} else if (form.date < minTransferDate) {
				newErrors.date = "Date cannot be in the past.";
			}
			if (!form.time.trim()) {
				newErrors.time = "Time is required.";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (isFormDisabled) {
			return;
		}

		if (!validateForm()) {
			return;
		}

		if (typeof window !== "undefined") {
			const bookingData =
				mode === "hire"
					? {
							type: String(mode),
							origin: String(form.primaryLocation.trim()),
							destination: String(form.secondaryLocation.trim()),
							duration: String(form.duration),
							vehicleType: String(form.vehicleType),
						}
					: {
							type: String(mode),
							firstLocation: String(form.primaryLocation.trim()),
							secondLocation: String(form.secondaryLocation.trim()),
							date: String(form.date),
							time: String(form.time),
						};

			sessionStorage.setItem(
				"quantum_car_booking",
				JSON.stringify(bookingData),
			);
		}

		setIsSubmitting(true);
		startTransition(() => {
			router.push(config.route);
		});
	}

	return (
		<form
			onSubmit={handleSubmit}
			aria-busy={isFormDisabled}
			className={[
				"rounded-[10px] bg-white shadow-[0px_2px_8px_1px_rgba(0,0,0,0.08)]",
				isHeroVariant
					? "px-4 pt-5 pb-6 sm:px-6 md:px-8 lg:px-[28px] lg:pt-[18px] lg:pb-[18px]"
					: "px-[18px] pt-[22px] pb-[27px] md:px-[47px] md:pt-8 md:pb-6",
			].join(" ")}
		>
			<div className={isHeroVariant ? "lg:hidden" : "xl:hidden"}>
				<div className="flex flex-wrap gap-2.5">
					<ModeTab
						active={mode === "pickup"}
						compact
						disabled={isFormDisabled}
						label={MODE_CONFIG.pickup.label}
						onClick={() => handleModeChange("pickup")}
					/>
					<ModeTab
						active={mode === "dropoff"}
						compact
						disabled={isFormDisabled}
						label={MODE_CONFIG.dropoff.label}
						onClick={() => handleModeChange("dropoff")}
					/>
					<ModeTab
						active={mode === "hire"}
						compact
						disabled={isFormDisabled}
						label={MODE_CONFIG.hire.label}
						onClick={() => handleModeChange("hire")}
					/>
				</div>

				<div className="mt-5 space-y-4">
					{mode === "dropoff" ? (
						<>
							{/* Drop Off At Airport (Secondary Location) first */}
							<div className="relative w-full">
								<FloatingInput
									disabled={isFormDisabled}
									label={config.fields.secondaryLabel}
									value={form.secondaryLocation}
									error={errors.secondaryLocation}
									readOnly={isCityField("secondaryLocation")}
									onFocus={() => handleLocationFocus("secondaryLocation")}
									onChange={(event) =>
										handleLocationChange(
											"secondaryLocation",
											event.target.value,
										)
									}
									onBlur={() => {
										setTimeout(() => {
											if (activeSearchField === "secondary") {
												setActiveSearchField(null);
												setAirportSuggestions([]);
											}
										}, 200);
									}}
									trailingIcon={<MapPin className="size-[18px]" />}
									className="h-12 pr-11 text-sm md:h-[54px] md:text-sm"
								/>
								{activeSearchField === "secondary" &&
									airportSuggestions.length > 0 && (
										<div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-black/10 rounded-[5px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto py-1">
											{airportSuggestions.map((airport) => (
												<button
													key={airport.iata}
													type="button"
													onMouseDown={() => {
														updateField("secondaryLocation", airport.name);
														setAirportSuggestions([]);
														setActiveSearchField(null);
													}}
													className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-text hover:bg-[#9E328A]/5 hover:text-[#9E328A] transition-colors font-light cursor-pointer"
												>
													{airport.name}
												</button>
											))}
										</div>
									)}
							</div>
							{/* Pick Up Address (Primary Location) second */}
							<div className="relative w-full">
								<FloatingInput
									disabled={isFormDisabled}
									label={config.fields.primaryLabel}
									value={form.primaryLocation}
									error={errors.primaryLocation}
									readOnly={isCityField("primaryLocation")}
									onFocus={() => handleLocationFocus("primaryLocation")}
									onChange={(event) =>
										handleLocationChange("primaryLocation", event.target.value)
									}
									onBlur={() => {
										setTimeout(() => {
											if (activeSearchField === "primary") {
												setActiveSearchField(null);
												setAirportSuggestions([]);
											}
										}, 200);
									}}
									trailingIcon={<MapPin className="size-[18px]" />}
									className="h-12 pr-11 text-sm md:h-[54px] md:text-sm"
								/>
								{activeSearchField === "primary" &&
									airportSuggestions.length > 0 && (
										<div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-black/10 rounded-[5px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto py-1">
											{airportSuggestions.map((airport) => (
												<button
													key={airport.iata}
													type="button"
													onMouseDown={() => {
														updateField("primaryLocation", airport.name);
														setAirportSuggestions([]);
														setActiveSearchField(null);
													}}
													className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-text hover:bg-[#9E328A]/5 hover:text-[#9E328A] transition-colors font-light cursor-pointer"
												>
													{airport.name}
												</button>
											))}
										</div>
									)}
							</div>
						</>
					) : (
						<>
							<div className="relative w-full">
								<FloatingInput
									disabled={isFormDisabled}
									label={config.fields.primaryLabel}
									value={form.primaryLocation}
									error={errors.primaryLocation}
									readOnly={isCityField("primaryLocation")}
									onFocus={() => handleLocationFocus("primaryLocation")}
									onChange={(event) =>
										handleLocationChange("primaryLocation", event.target.value)
									}
									onBlur={() => {
										setTimeout(() => {
											if (activeSearchField === "primary") {
												setActiveSearchField(null);
												setAirportSuggestions([]);
											}
										}, 200);
									}}
									trailingIcon={<MapPin className="size-[18px]" />}
									className="h-12 pr-11 text-sm md:h-[54px] md:text-sm"
								/>
								{activeSearchField === "primary" &&
									airportSuggestions.length > 0 && (
										<div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-black/10 rounded-[5px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto py-1">
											{airportSuggestions.map((airport) => (
												<button
													key={airport.iata}
													type="button"
													onMouseDown={() => {
														updateField("primaryLocation", airport.name);
														setAirportSuggestions([]);
														setActiveSearchField(null);
													}}
													className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-text hover:bg-[#9E328A]/5 hover:text-[#9E328A] transition-colors font-light cursor-pointer"
												>
													{airport.name}
												</button>
											))}
										</div>
									)}
							</div>
							<div className="relative w-full">
								<FloatingInput
									disabled={isFormDisabled}
									label={config.fields.secondaryLabel}
									value={form.secondaryLocation}
									error={errors.secondaryLocation}
									readOnly={isCityField("secondaryLocation")}
									onFocus={() => handleLocationFocus("secondaryLocation")}
									onChange={(event) =>
										handleLocationChange(
											"secondaryLocation",
											event.target.value,
										)
									}
									onBlur={() => {
										setTimeout(() => {
											if (activeSearchField === "secondary") {
												setActiveSearchField(null);
												setAirportSuggestions([]);
											}
										}, 200);
									}}
									trailingIcon={<MapPin className="size-[18px]" />}
									className="h-12 pr-11 text-sm md:h-[54px] md:text-sm"
								/>
								{activeSearchField === "secondary" &&
									airportSuggestions.length > 0 && (
										<div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-black/10 rounded-[5px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto py-1">
											{airportSuggestions.map((airport) => (
												<button
													key={airport.iata}
													type="button"
													onMouseDown={() => {
														updateField("secondaryLocation", airport.name);
														setAirportSuggestions([]);
														setActiveSearchField(null);
													}}
													className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-text hover:bg-[#9E328A]/5 hover:text-[#9E328A] transition-colors font-light cursor-pointer"
												>
													{airport.name}
												</button>
											))}
										</div>
									)}
							</div>
						</>
					)}
					<div className="grid grid-cols-2 gap-[9px]">
						{mode === "hire" ? (
							<>
								<FloatingSelect
									disabled={isFormDisabled}
									label={config.fields.thirdLabel}
									value={form.duration}
									error={errors.duration}
									onChange={(event) =>
										updateField("duration", event.target.value)
									}
									trailingIcon={<ChevronsUpDown className="size-[16px]" />}
									hideDefaultChevron
									className="h-12 pr-11 text-sm md:h-[54px] md:text-sm"
								>
									<option value="">{config.fields.thirdLabel}</option>
									{thirdOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</FloatingSelect>
								<FloatingSelect
									disabled={isFormDisabled}
									label={config.fields.fourthLabel}
									value={form.vehicleType}
									error={errors.vehicleType}
									onChange={(event) =>
										updateField("vehicleType", event.target.value)
									}
									trailingIcon={<ChevronsUpDown className="size-[16px]" />}
									hideDefaultChevron
									className="h-12 pr-11 text-sm md:h-[54px] md:text-sm"
								>
									<option value="">{config.fields.fourthLabel}</option>
									{fourthOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</FloatingSelect>
							</>
						) : (
							<>
								<FloatingInput
									disabled={isFormDisabled}
									type="date"
									label={config.fields.thirdLabel}
									value={form.date}
									min={minTransferDate}
									error={errors.date}
									onChange={(event) => updateField("date", event.target.value)}
									trailingIcon={<CalendarDays className="size-[18px]" />}
									forceLabel
									className="h-12 pr-11 text-sm md:h-[54px] md:text-sm"
								/>
								<FloatingSelect
									disabled={isFormDisabled}
									label={config.fields.fourthLabel}
									value={form.time}
									error={errors.time}
									onChange={(event) => updateField("time", event.target.value)}
									trailingIcon={<Clock3 className="size-[16px]" />}
									hideDefaultChevron
									className="h-12 pr-11 text-sm md:h-[54px] md:text-sm"
								>
									<option value="">{config.fields.fourthLabel}</option>
									{fourthOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</FloatingSelect>
							</>
						)}
					</div>
				</div>

				<div className="mt-4 flex items-start gap-3 text-xs leading-[1.3] text-text">
					<Info className="mt-0.5 size-5 shrink-0" />
					<p>
						Please ensure all details provided are correct to ensure a seamless
						experience
					</p>
				</div>

				<button
					type="submit"
					disabled={isFormDisabled}
					className="mx-auto mt-[18px] flex h-[38px] w-36 items-center justify-center rounded-full bg-[#9E328A] px-8 text-xs font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 disabled:cursor-not-allowed disabled:bg-[#8a2b78] disabled:opacity-80"
				>
					{isFormDisabled ? "Submitting..." : "Reserve Now"}
				</button>
			</div>

			<div
				className={`hidden ${isHeroVariant ? "lg:block" : "xl:block"} ${isHeroVariant ? "" : "mt-6"}`}
			>
				<div
					className={`flex flex-wrap ${isHeroVariant ? "gap-2.5" : "gap-3"}`}
				>
					<ModeTab
						active={mode === "pickup"}
						compact={isHeroVariant}
						disabled={isFormDisabled}
						label={MODE_CONFIG.pickup.label}
						onClick={() => handleModeChange("pickup")}
					/>
					<ModeTab
						active={mode === "dropoff"}
						compact={isHeroVariant}
						disabled={isFormDisabled}
						label={MODE_CONFIG.dropoff.label}
						onClick={() => handleModeChange("dropoff")}
					/>
					<ModeTab
						active={mode === "hire"}
						compact={isHeroVariant}
						disabled={isFormDisabled}
						label={MODE_CONFIG.hire.label}
						onClick={() => handleModeChange("hire")}
					/>
				</div>

				<div
					className={`grid gap-[8px] ${isHeroVariant ? "mt-[14px] grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(116px,0.55fr)_minmax(116px,0.55fr)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,0.6fr)_minmax(0,0.6fr)]" : "mt-9 grid-cols-[minmax(0,380px)_minmax(0,380px)_minmax(0,149px)_minmax(0,149px)] gap-[14px]"}`}
				>
					{mode === "dropoff" ? (
						<>
							{/* Drop Off At Airport (Secondary Location) first */}
							<div className="relative w-full">
								<FloatingInput
									disabled={isFormDisabled}
									label={config.fields.secondaryLabel}
									value={form.secondaryLocation}
									error={errors.secondaryLocation}
									readOnly={isCityField("secondaryLocation")}
									onFocus={() => handleLocationFocus("secondaryLocation")}
									onChange={(event) =>
										handleLocationChange(
											"secondaryLocation",
											event.target.value,
										)
									}
									onBlur={() => {
										setTimeout(() => {
											if (activeSearchField === "secondary") {
												setActiveSearchField(null);
												setAirportSuggestions([]);
											}
										}, 200);
									}}
									trailingIcon={
										<MapPin className="size-5 fill-black stroke-black" />
									}
									className={
										isHeroVariant
											? "h-[54px] pr-12 text-sm md:h-[54px] md:text-sm"
											: "pr-12"
									}
								/>
								{activeSearchField === "secondary" &&
									airportSuggestions.length > 0 && (
										<div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-black/10 rounded-[5px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto py-1">
											{airportSuggestions.map((airport) => (
												<button
													key={airport.iata}
													type="button"
													onMouseDown={() => {
														updateField("secondaryLocation", airport.name);
														setAirportSuggestions([]);
														setActiveSearchField(null);
													}}
													className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-text hover:bg-[#9E328A]/5 hover:text-[#9E328A] transition-colors font-light cursor-pointer"
												>
													{airport.name}
												</button>
											))}
										</div>
									)}
							</div>
							{/* Pick Up Address (Primary Location) second */}
							<div className="relative w-full">
								<FloatingInput
									disabled={isFormDisabled}
									label={config.fields.primaryLabel}
									value={form.primaryLocation}
									error={errors.primaryLocation}
									readOnly={isCityField("primaryLocation")}
									onFocus={() => handleLocationFocus("primaryLocation")}
									onChange={(event) =>
										handleLocationChange("primaryLocation", event.target.value)
									}
									onBlur={() => {
										setTimeout(() => {
											if (activeSearchField === "primary") {
												setActiveSearchField(null);
												setAirportSuggestions([]);
											}
										}, 200);
									}}
									trailingIcon={
										<MapPin className="size-5 fill-black stroke-black" />
									}
									className={
										isHeroVariant
											? "h-[54px] pr-12 text-sm md:h-[54px] md:text-sm"
											: "pr-12"
									}
								/>
								{activeSearchField === "primary" &&
									airportSuggestions.length > 0 && (
										<div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-black/10 rounded-[5px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto py-1">
											{airportSuggestions.map((airport) => (
												<button
													key={airport.iata}
													type="button"
													onMouseDown={() => {
														updateField("primaryLocation", airport.name);
														setAirportSuggestions([]);
														setActiveSearchField(null);
													}}
													className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-text hover:bg-[#9E328A]/5 hover:text-[#9E328A] transition-colors font-light cursor-pointer"
												>
													{airport.name}
												</button>
											))}
										</div>
									)}
							</div>
						</>
					) : (
						<>
							<div className="relative w-full">
								<FloatingInput
									disabled={isFormDisabled}
									label={config.fields.primaryLabel}
									value={form.primaryLocation}
									error={errors.primaryLocation}
									readOnly={isCityField("primaryLocation")}
									onFocus={() => handleLocationFocus("primaryLocation")}
									onChange={(event) =>
										handleLocationChange("primaryLocation", event.target.value)
									}
									onBlur={() => {
										setTimeout(() => {
											if (activeSearchField === "primary") {
												setActiveSearchField(null);
												setAirportSuggestions([]);
											}
										}, 200);
									}}
									trailingIcon={
										<MapPin className="size-5 fill-black stroke-black" />
									}
									className={
										isHeroVariant
											? "h-[54px] pr-12 text-sm md:h-[54px] md:text-sm"
											: "pr-12"
									}
								/>
								{activeSearchField === "primary" &&
									airportSuggestions.length > 0 && (
										<div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-black/10 rounded-[5px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto py-1">
											{airportSuggestions.map((airport) => (
												<button
													key={airport.iata}
													type="button"
													onMouseDown={() => {
														updateField("primaryLocation", airport.name);
														setAirportSuggestions([]);
														setActiveSearchField(null);
													}}
													className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-text hover:bg-[#9E328A]/5 hover:text-[#9E328A] transition-colors font-light cursor-pointer"
												>
													{airport.name}
												</button>
											))}
										</div>
									)}
							</div>
							<div className="relative w-full">
								<FloatingInput
									disabled={isFormDisabled}
									label={config.fields.secondaryLabel}
									value={form.secondaryLocation}
									error={errors.secondaryLocation}
									readOnly={isCityField("secondaryLocation")}
									onFocus={() => handleLocationFocus("secondaryLocation")}
									onChange={(event) =>
										handleLocationChange(
											"secondaryLocation",
											event.target.value,
										)
									}
									onBlur={() => {
										setTimeout(() => {
											if (activeSearchField === "secondary") {
												setActiveSearchField(null);
												setAirportSuggestions([]);
											}
										}, 200);
									}}
									trailingIcon={
										<MapPin className="size-5 fill-black stroke-black" />
									}
									className={
										isHeroVariant
											? "h-[54px] pr-12 text-sm md:h-[54px] md:text-sm"
											: "pr-12"
									}
								/>
								{activeSearchField === "secondary" &&
									airportSuggestions.length > 0 && (
										<div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-black/10 rounded-[5px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] max-h-56 overflow-y-auto py-1">
											{airportSuggestions.map((airport) => (
												<button
													key={airport.iata}
													type="button"
													onMouseDown={() => {
														updateField("secondaryLocation", airport.name);
														setAirportSuggestions([]);
														setActiveSearchField(null);
													}}
													className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-text hover:bg-[#9E328A]/5 hover:text-[#9E328A] transition-colors font-light cursor-pointer"
												>
													{airport.name}
												</button>
											))}
										</div>
									)}
							</div>
						</>
					)}
					{mode === "hire" ? (
						<>
							<FloatingSelect
								disabled={isFormDisabled}
								label={config.fields.thirdLabel}
								value={form.duration}
								error={errors.duration}
								onChange={(event) =>
									updateField("duration", event.target.value)
								}
								trailingIcon={<ChevronDown className="size-5" />}
								hideDefaultChevron
								className={
									isHeroVariant
										? "h-[54px] pr-12 text-sm md:h-[54px] md:text-sm"
										: "pr-12"
								}
							>
								<option value="">{config.fields.thirdLabel}</option>
								{thirdOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</FloatingSelect>
							<FloatingSelect
								disabled={isFormDisabled}
								label={config.fields.fourthLabel}
								value={form.vehicleType}
								error={errors.vehicleType}
								onChange={(event) =>
									updateField("vehicleType", event.target.value)
								}
								trailingIcon={<ChevronDown className="size-5" />}
								hideDefaultChevron
								className={
									isHeroVariant
										? "h-[54px] pr-12 text-sm md:h-[54px] md:text-sm"
										: "pr-12"
								}
							>
								<option value="">{config.fields.fourthLabel}</option>
								{fourthOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</FloatingSelect>
						</>
					) : (
						<>
							<FloatingInput
								disabled={isFormDisabled}
								type="date"
								label={config.fields.thirdLabel}
								value={form.date}
								min={minTransferDate}
								error={errors.date}
								onChange={(event) => updateField("date", event.target.value)}
								trailingIcon={<CalendarDays className="size-5" />}
								forceLabel
								className={
									isHeroVariant
										? "h-[54px] pr-12 text-sm md:h-[54px] md:text-sm"
										: "pr-12"
								}
							/>
							<FloatingSelect
								disabled={isFormDisabled}
								label={config.fields.fourthLabel}
								value={form.time}
								error={errors.time}
								onChange={(event) => updateField("time", event.target.value)}
								trailingIcon={
									isHeroVariant ? (
										<Clock3 className="size-4" />
									) : (
										<ChevronDown className="size-5" />
									)
								}
								hideDefaultChevron
								className={
									isHeroVariant
										? "h-[54px] pr-12 text-sm md:h-[54px] md:text-sm"
										: "pr-12"
								}
							>
								<option value="">{config.fields.fourthLabel}</option>
								{fourthOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</FloatingSelect>
						</>
					)}
				</div>

				<div
					className={`flex items-center justify-between gap-6 ${isHeroVariant ? "mt-4" : "mt-[30px]"}`}
				>
					<div
						className={`flex items-center gap-2.5 text-text ${isHeroVariant ? "text-[12px] leading-[1.4]" : "text-base leading-normal"}`}
					>
						<Info
							className={`${isHeroVariant ? "size-4" : "size-6"} shrink-0`}
						/>
						<p>
							Please ensure all details provided are correct to ensure a
							seamless experience
						</p>
					</div>

					<button
						type="submit"
						disabled={isFormDisabled}
						className={`flex shrink-0 items-center justify-center text-nowrap rounded-full bg-[#9E328A] font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 disabled:cursor-not-allowed disabled:bg-[#8a2b78] disabled:opacity-80 ${isHeroVariant ? "h-[44px] w-fit px-6 text-sm" : "h-14 w-[180px] px-8 text-base"}`}
					>
						{isFormDisabled ? "Submitting..." : "Reserve Now"}
					</button>
				</div>
			</div>
		</form>
	);
}
