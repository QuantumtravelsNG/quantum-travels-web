"use client";

import { useMemo, useState, FormEvent } from "react";
import Image from "next/image";
import { CalendarDays, Info } from "lucide-react";
import { submitCarHireBooking } from "@/app/actions";
import {
	FloatingInput,
	FloatingPhoneInput,
	FloatingSelect,
	FloatingTextarea,
} from "@/components/ui/floating-fields";
import { getTodayDateValue, isValidDateValue } from "@/lib/date-values";
import { getStateOptions } from "@/lib/locations";
import { isValidPhoneNumberValue } from "@/lib/phone";
import BookingSuccessDialog from "@/components/services/carServices/BookingSuccessDialog";

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

type FormValues = {
	pickUpState: string;
	destinationState: string;
	destinationAddress: string;
	pickUpDate: string;
	returnDate: string;
	duration: string;
	vehicleType: string;
	passengers: string;
	tripType: string;
	numberOfVehicles: string;
	addons: string[];
	fullName: string;
	companyName: string;
	email: string;
	phone: string;
	additionalComment: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

type StoredHireBooking = {
	type?: string;
	origin?: string;
	destination?: string;
	duration?: string;
	vehicleType?: string;
};

const initialValues: FormValues = {
	pickUpState: "",
	destinationState: "",
	destinationAddress: "",
	pickUpDate: "",
	returnDate: "",
	duration: "",
	vehicleType: "",
	passengers: "",
	tripType: "",
	numberOfVehicles: "",
	addons: [],
	fullName: "",
	companyName: "",
	email: "",
	phone: "",
	additionalComment: "",
};

function isValidEmail(value: string) {
	const trimmed = value.trim();
	return (
		trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
	);
}

const DURATION_OPTIONS = [
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

const PASSENGERS_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const TRIP_TYPE_OPTIONS = ["Intra-State", "Inter-State"];

const VEHICLE_COUNT_OPTIONS = ["1", "2", "3", "4", "5", "5+"];
const ADDON_OPTIONS = [
	"Additional Security",
	"Booking for Event",
	"Chauffeur Service",
];
const NIGERIAN_STATES = getStateOptions("NG");

function getInitialValues(): FormValues {
	const storedBooking = getStoredHireBooking();
	if (!storedBooking) return initialValues;

	return {
		...initialValues,
		pickUpState: findStateValue(storedBooking.origin),
		destinationState: findStateValue(storedBooking.destination),
		destinationAddress: storedBooking.destination?.trim() || "",
		duration: findDurationValue(storedBooking.duration),
		vehicleType: storedBooking.vehicleType?.trim() || "",
	};
}

function getStoredHireBooking(): StoredHireBooking | null {
	if (typeof window === "undefined") {
		return null;
	}

	const stored = window.sessionStorage.getItem("quantum_car_booking");
	if (!stored) return null;

	try {
		const parsed = JSON.parse(stored) as StoredHireBooking;
		return parsed.type === "hire" ? parsed : null;
	} catch (error) {
		console.error("Error parsing stored car hire booking details", error);
		return null;
	}
}

function findStateValue(value: string | undefined) {
	const normalized = value?.trim().toLowerCase();
	if (!normalized) return "";

	return (
		NIGERIAN_STATES.find(
			(state) =>
				state.value.toLowerCase() === normalized ||
				state.label.toLowerCase() === normalized,
		)?.value ?? ""
	);
}

function findDurationValue(value: string | undefined) {
	const normalized = value?.trim().toLowerCase();
	if (!normalized) return "";

	return (
		DURATION_OPTIONS.find(
			(duration) => duration.toLowerCase() === normalized,
		) ?? ""
	);
}

function getStateLabel(value: string) {
	return (
		NIGERIAN_STATES.find((state) => state.value === value)?.label ??
		value.trim()
	);
}

export default function CarServicesHireForm() {
	const [values, setValues] = useState<FormValues>(getInitialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<TouchedFields>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");

	// Load Nigerian states dynamically
	const states = useMemo(() => NIGERIAN_STATES, []);

	const minDate = useMemo(() => {
		return getTodayDateValue();
	}, []);

	const validateField = (name: FieldName, formValues: FormValues): string => {
		switch (name) {
			case "pickUpState":
				return formValues.pickUpState ? "" : "Pick up state is required.";
			case "destinationState":
				return formValues.destinationState
					? ""
					: "Destination state is required.";
			case "destinationAddress":
				return formValues.destinationAddress.trim()
					? ""
					: "Destination address is required.";
			case "pickUpDate":
				if (!formValues.pickUpDate) return "Pick up date is required.";
				if (!isValidDateValue(formValues.pickUpDate)) {
					return "Please choose a valid pick up date.";
				}
				if (formValues.pickUpDate < minDate)
					return "Date cannot be in the past.";
				return "";
			case "returnDate":
				if (!formValues.returnDate) return "Return date is required.";
				if (!isValidDateValue(formValues.returnDate)) {
					return "Please choose a valid return date.";
				}
				if (!formValues.pickUpDate) return "Select a pick up date first.";
				if (formValues.returnDate < formValues.pickUpDate) {
					return "Return date must be on or after pick up date.";
				}
				return "";
			case "duration":
				return formValues.duration ? "" : "Duration is required.";
			case "vehicleType":
				return formValues.vehicleType ? "" : "Vehicle type is required.";
			case "passengers":
				return formValues.passengers ? "" : "Number of passengers is required.";
			case "tripType":
				return formValues.tripType ? "" : "Trip type is required.";
			case "numberOfVehicles":
				return formValues.numberOfVehicles
					? ""
					: "Number of vehicles is required.";
			case "fullName":
				if (!formValues.fullName.trim()) return "Full name is required.";
				if (formValues.fullName.trim().length > 100)
					return "Full name must be 100 characters or fewer.";
				return "";
			case "companyName":
				return formValues.companyName.trim().length <= 120
					? ""
					: "Company or group name must be 120 characters or fewer.";
			case "email":
				if (!formValues.email.trim()) return "Email address is required.";
				return isValidEmail(formValues.email)
					? ""
					: "Please enter a valid email address.";
			case "phone":
				if (!formValues.phone.trim()) return "Phone number is required.";
				return isValidPhoneNumberValue(formValues.phone)
					? ""
					: "Please enter a valid phone number.";
			case "additionalComment":
				return formValues.additionalComment.trim().length <= 500
					? ""
					: "Additional comment must be 500 characters or fewer.";
			default:
				return "";
		}
	};

	const markTouched = (name: FieldName) => {
		setTouched((current) => ({ ...current, [name]: true }));
		setErrors((current) => ({
			...current,
			[name]: validateField(name, values),
		}));
	};

	const setFieldValue = <K extends FieldName>(
		name: K,
		value: FormValues[K],
	) => {
		if (submitError) setSubmitError("");

		setValues((current) => {
			const nextValues = { ...current, [name]: value };

			if (touched[name]) {
				setErrors((currentErrors) => ({
					...currentErrors,
					[name]: validateField(name, nextValues),
				}));
			}

			// Proactively validate related date fields
			if (
				name === "pickUpDate" &&
				touched.returnDate &&
				nextValues.returnDate
			) {
				setErrors((currentErrors) => ({
					...currentErrors,
					returnDate: validateField("returnDate", nextValues),
				}));
			}

			return nextValues;
		});
	};

	const toggleAddon = (addon: string, checked: boolean) => {
		if (submitError) setSubmitError("");

		setValues((current) => ({
			...current,
			addons: checked
				? Array.from(new Set([...current.addons, addon]))
				: current.addons.filter((selectedAddon) => selectedAddon !== addon),
		}));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitting) return;

		const nextErrors: FormErrors = {};
		let hasErrors = false;

		// Check all fields
		const fieldsToValidate: FieldName[] = [
			"pickUpState",
			"destinationState",
			"destinationAddress",
			"pickUpDate",
			"returnDate",
			"duration",
			"vehicleType",
			"passengers",
			"tripType",
			"numberOfVehicles",
			"companyName",
			"fullName",
			"email",
			"phone",
			"additionalComment",
		];

		fieldsToValidate.forEach((name) => {
			const errorMsg = validateField(name, values);
			if (errorMsg) {
				nextErrors[name] = errorMsg;
				hasErrors = true;
			}
		});

		setErrors(nextErrors);
		setTouched(
			fieldsToValidate.reduce((acc, field) => {
				acc[field] = true;
				return acc;
			}, {} as TouchedFields),
		);

		if (hasErrors) {
			// Scroll to the first error
			const firstErrorKey = Object.keys(nextErrors)[0];
			const element = document.getElementsByName(firstErrorKey)[0];
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			return;
		}

		setIsSubmitting(true);

		const payload = {
			pickUpState: getStateLabel(values.pickUpState),
			destinationState: getStateLabel(values.destinationState),
			destinationAddress: values.destinationAddress.trim(),
			pickUpDate: values.pickUpDate,
			returnDate: values.returnDate,
			duration: values.duration,
			vehicleType: values.vehicleType,
			passengers: values.passengers,
			tripType: values.tripType,
			numberOfVehicles: values.numberOfVehicles,
			addons: values.addons,
			fullName: values.fullName.trim(),
			companyName: values.companyName.trim(),
			email: values.email.trim(),
			phone: values.phone.trim(),
			additionalComment: values.additionalComment.trim(),
		};

		const result = await submitCarHireBooking(payload);
		setIsSubmitting(false);

		if (!result.ok) {
			setSubmitError(result.message);
			return;
		}

		setSubmitted(true);
	};

	const handleCloseDialog = () => {
		setSubmitted(false);
		setValues(initialValues);
		setErrors({});
		setTouched({});
		setSubmitError("");
		sessionStorage.removeItem("quantum_car_booking");
	};

	const desktopSectionHeading = "Reserve Your Car";
	const desktopSectionCopy =
		"Complete your booking and let's get you all squared away.";

	return (
		<>
			<BookingSuccessDialog
				open={submitted}
				onClose={handleCloseDialog}
				title="Request Received"
				description="Your car hire request has been received. Our team will review your details and contact you shortly."
			/>

			<section
				className="bg-white pb-10 md:pb-16 w-full"
				aria-label="Car Hire booking form"
			>
				{/* Banner image */}
				<div className="relative h-[124px] w-full md:h-[200px]">
					<Image
						src="/ourServices/carServices/carBookingBanner.jpg"
						alt="Car Booking Banner"
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
				</div>

				{/* Main form card content container */}
				<div className="relative z-10 mx-auto -mt-[62px] max-w-[1086px] px-5 md:-mt-[136px] md:px-0">
					<div className="overflow-hidden rounded-[8px] bg-[#f9f9f9] md:grid md:grid-cols-[360px_1fr] md:rounded-[10px]">
						{/* Sidebar (Desktop only) */}
						<div className="relative hidden min-h-[960px] md:block">
							<Image
								src="/assets/quantumBg.png"
								alt="Form Sidebar Cover"
								fill
								className="object-cover"
								sizes="360px"
							/>
							<div className="absolute inset-0 bg-[#9e328a]/40" />
							<div className="relative z-10 p-10 text-white">
								<h1 className="text-4xl font-black leading-normal font-sans">
									{desktopSectionHeading}
								</h1>
								<p className="mt-4 text-[20px] leading-[1.4] font-medium font-sans">
									{desktopSectionCopy}
								</p>
							</div>
						</div>

						{/* Form body */}
						<div className="p-5 md:p-10 bg-[#f9f9f9]">
							{/* Header (Mobile only) */}
							<div className="mb-8 text-text md:hidden">
								<h1 className="text-2xl font-black leading-normal">
									{desktopSectionHeading}
								</h1>
								<p className="mt-2 text-base leading-normal font-medium opacity-80">
									{desktopSectionCopy}
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								noValidate
								aria-busy={isSubmitting}
								className="space-y-10"
							>
								{/* 1. Rental Details Section */}
								<section className="space-y-6">
									<div>
										<h2 className="text-sm font-medium text-text md:text-[20px]">
											Rental Details
										</h2>
										<div className="mt-2 h-px w-full bg-black/25 relative">
											<div className="absolute left-0 top-0 h-px w-[87px] bg-[#9E328A] md:w-[138px]" />
										</div>
									</div>

									{/* Pick Up & Destination State row */}
									<div className="grid gap-4 sm:grid-cols-2">
										<FloatingSelect
											id="pickUpState"
											name="pickUpState"
											label="Pick Up State"
											value={values.pickUpState}
											error={errors.pickUpState}
											onChange={(e) =>
												setFieldValue("pickUpState", e.target.value)
											}
											onBlur={() => markTouched("pickUpState")}
										>
											<option value="">Select State</option>
											{states.map((state) => (
												<option key={state.value} value={state.value}>
													{state.label}
												</option>
											))}
										</FloatingSelect>

										<FloatingSelect
											id="destinationState"
											name="destinationState"
											label="Destination State"
											value={values.destinationState}
											error={errors.destinationState}
											onChange={(e) =>
												setFieldValue("destinationState", e.target.value)
											}
											onBlur={() => markTouched("destinationState")}
										>
											<option value="">Select State</option>
											{states.map((state) => (
												<option key={state.value} value={state.value}>
													{state.label}
												</option>
											))}
										</FloatingSelect>
									</div>

									{/* Destination Address row */}
									<FloatingInput
										id="destinationAddress"
										name="destinationAddress"
										label="Destination (Full Address)"
										value={values.destinationAddress}
										error={errors.destinationAddress}
										onChange={(e) =>
											setFieldValue("destinationAddress", e.target.value)
										}
										onBlur={() => markTouched("destinationAddress")}
									/>

									{/* Pick Up & Return Date row */}
									<div className="grid gap-4 sm:grid-cols-2">
										<FloatingInput
											id="pickUpDate"
											name="pickUpDate"
											type="date"
											min={minDate}
											label="Pick Up Date"
											value={values.pickUpDate}
											error={errors.pickUpDate}
											forceLabel
											trailingIcon={
												<CalendarDays className="size-5 text-black/55" />
											}
											onChange={(e) =>
												setFieldValue("pickUpDate", e.target.value)
											}
											onBlur={() => markTouched("pickUpDate")}
										/>

										<FloatingInput
											id="returnDate"
											name="returnDate"
											type="date"
											min={values.pickUpDate || minDate}
											label="Return Date"
											value={values.returnDate}
											error={errors.returnDate}
											forceLabel
											trailingIcon={
												<CalendarDays className="size-5 text-black/55" />
											}
											onChange={(e) =>
												setFieldValue("returnDate", e.target.value)
											}
											onBlur={() => markTouched("returnDate")}
										/>
									</div>

									{/* Duration, Vehicle Type, Passengers row */}
									<div className="grid gap-4 sm:grid-cols-3">
										<FloatingSelect
											id="duration"
											name="duration"
											label="Duration"
											value={values.duration}
											error={errors.duration}
											onChange={(e) =>
												setFieldValue("duration", e.target.value)
											}
											onBlur={() => markTouched("duration")}
										>
											<option value="">Select Duration</option>
											{DURATION_OPTIONS.map((opt) => (
												<option key={opt} value={opt}>
													{opt}
												</option>
											))}
										</FloatingSelect>

										<FloatingSelect
											id="vehicleType"
											name="vehicleType"
											label="Vehicle Type"
											value={values.vehicleType}
											error={errors.vehicleType}
											onChange={(e) =>
												setFieldValue("vehicleType", e.target.value)
											}
											onBlur={() => markTouched("vehicleType")}
										>
											<option value="">Select Type</option>
											{VEHICLE_TYPE_OPTIONS.map((opt) => (
												<option key={opt} value={opt}>
													{opt}
												</option>
											))}
										</FloatingSelect>

										<FloatingSelect
											id="passengers"
											name="passengers"
											label="Passengers"
											value={values.passengers}
											error={errors.passengers}
											onChange={(e) =>
												setFieldValue("passengers", e.target.value)
											}
											onBlur={() => markTouched("passengers")}
										>
											<option value="">Select Passengers</option>
											{PASSENGERS_OPTIONS.map((opt) => (
												<option key={opt} value={opt}>
													{opt}
												</option>
											))}
										</FloatingSelect>
									</div>

									{/* Trip Type & Number of Vehicles row */}
									<div className="grid gap-4 sm:grid-cols-2">
										<FloatingSelect
											id="tripType"
											name="tripType"
											label="Trip Type"
											value={values.tripType}
											error={errors.tripType}
											onChange={(e) =>
												setFieldValue("tripType", e.target.value)
											}
											onBlur={() => markTouched("tripType")}
										>
											<option value="">Select Trip Type</option>
											{TRIP_TYPE_OPTIONS.map((opt) => (
												<option key={opt} value={opt}>
													{opt}
												</option>
											))}
										</FloatingSelect>

										<FloatingSelect
											id="numberOfVehicles"
											name="numberOfVehicles"
											label="Number of Vehicles"
											value={values.numberOfVehicles}
											error={errors.numberOfVehicles}
											onChange={(e) =>
												setFieldValue("numberOfVehicles", e.target.value)
											}
											onBlur={() => markTouched("numberOfVehicles")}
										>
											<option value="">Select Number</option>
											{VEHICLE_COUNT_OPTIONS.map((opt) => (
												<option key={opt} value={opt}>
													{opt}
												</option>
											))}
										</FloatingSelect>
									</div>
								</section>

								{/* 2. Preferences & Add-ons Section */}
								<section className="space-y-6">
									<div>
										<h2 className="text-sm font-medium text-text md:text-[20px]">
											Preferences & Add-ons
										</h2>
										<div className="mt-2 h-px w-full bg-black/25 relative">
											<div className="absolute left-0 top-0 h-px w-[87px] bg-[#9E328A] md:w-[138px]" />
										</div>
									</div>

									<div className="grid gap-6 sm:grid-cols-3 pt-2">
										{ADDON_OPTIONS.map((addon) => (
											<label
												key={addon}
												className="flex cursor-pointer items-center gap-3 text-sm text-text md:text-base select-none"
											>
												<input
													name="addons"
													type="checkbox"
													value={addon}
													checked={values.addons.includes(addon)}
													onChange={(e) => toggleAddon(addon, e.target.checked)}
													className="size-6 rounded-[5px] border border-black/20 accent-[#9E328A] cursor-pointer md:size-8 transition-all"
												/>
												<span className="font-light text-text">{addon}</span>
											</label>
										))}
									</div>
								</section>

								{/* 3. Contact Details Section */}
								<section className="space-y-6">
									<div>
										<h2 className="text-sm font-medium text-text md:text-[20px]">
											Contact Details
										</h2>
										<div className="mt-2 h-px w-full bg-black/25 relative">
											<div className="absolute left-0 top-0 h-px w-[87px] bg-[#9E328A] md:w-[138px]" />
										</div>
									</div>

									{/* Full Name */}
									<FloatingInput
										id="fullName"
										name="fullName"
										label="Full Name"
										autoComplete="name"
										value={values.fullName}
										error={errors.fullName}
										onChange={(e) => setFieldValue("fullName", e.target.value)}
										onBlur={() => markTouched("fullName")}
									/>

									{/* Company/Group Name (Optional) */}
									<FloatingInput
										id="companyName"
										name="companyName"
										label="Company/Group Name (Optional)"
										value={values.companyName}
										error={errors.companyName}
										onChange={(e) =>
											setFieldValue("companyName", e.target.value)
										}
										onBlur={() => markTouched("companyName")}
									/>

									{/* Email & Phone Number row */}
									<div className="grid gap-4 sm:grid-cols-2">
										<FloatingInput
											id="email"
											name="email"
											type="email"
											inputMode="email"
											autoComplete="email"
											label="Email Address"
											value={values.email}
											error={errors.email}
											onChange={(e) => setFieldValue("email", e.target.value)}
											onBlur={() => markTouched("email")}
										/>

										<FloatingPhoneInput
											id="phone"
											name="phone"
											label="Phone Number"
											value={values.phone}
											error={errors.phone}
											onChange={(val) => setFieldValue("phone", val)}
											onBlur={() => markTouched("phone")}
										/>
									</div>

									<div className="flex items-start gap-2 text-black/50 pl-1 py-1">
										<Info className="size-4 shrink-0 mt-0.5" />
										<span className="text-xs font-light">
											Please enter a valid email address & phone number
										</span>
									</div>

									{/* Additional Comment */}
									<FloatingTextarea
										id="additionalComment"
										name="additionalComment"
										label="Additional Comment"
										value={values.additionalComment}
										error={errors.additionalComment}
										onChange={(e) =>
											setFieldValue("additionalComment", e.target.value)
										}
										onBlur={() => markTouched("additionalComment")}
										className="!min-h-[100px] !resize-none"
									/>
								</section>

								{submitError ? (
									<p
										className="rounded-[5px] bg-[#9E328A]/10 px-4 py-3 text-sm font-medium text-[#9E328A]"
										role="alert"
									>
										{submitError}
									</p>
								) : null}

								{/* Submission CTA */}
								<div className="flex justify-center pt-4">
									<button
										type="submit"
										disabled={isSubmitting}
										className="flex h-12 md:h-14 w-full sm:w-[227px] items-center justify-center rounded-full bg-[#9E328A] text-sm md:text-base font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 shadow-[0px_4px_12px_rgba(158,50,138,0.25)] disabled:cursor-not-allowed disabled:opacity-80 cursor-pointer"
									>
										{isSubmitting ? "Processing..." : "Submit"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
