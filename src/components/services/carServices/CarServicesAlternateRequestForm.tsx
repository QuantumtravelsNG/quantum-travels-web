"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { CalendarDays, ChevronDown, Info } from "lucide-react";
import { submitAirportAlternateRequest } from "@/app/actions";
import {
	FloatingInput,
	FloatingPhoneInput,
	FloatingTextarea,
} from "@/components/ui/floating-fields";
import BookingSuccessDialog from "@/components/services/carServices/BookingSuccessDialog";
import { getTodayDateValue, isValidDateValue } from "@/lib/date-values";
import { isValidPhoneNumberValue } from "@/lib/phone";
import { airports } from "@/lib/airports";

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

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

type ServiceType = "airport_pickup" | "airport_dropoff";

type FormValues = {
	airport: string;
	address: string;
	pickupDate: string;
	pickupTime: string;
	fullName: string;
	email: string;
	phone: string;
	alternativePhone: string;
	// whatsappNumber: string;
	flightNumber: string;
	additionalComment: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

type StoredTransferBooking = {
	type?: string;
	firstLocation?: string;
	secondLocation?: string;
	date?: string;
	time?: string;
};

const initialValues: FormValues = {
	airport: "",
	address: "",
	pickupDate: "",
	pickupTime: "",
	fullName: "",
	email: "",
	phone: "",
	alternativePhone: "",
	// whatsappNumber: "",
	flightNumber: "",
	additionalComment: "",
};

function isValidEmail(value: string) {
	const trimmed = value.trim();
	return (
		trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
	);
}

function getInitialValues(serviceType: ServiceType): FormValues {
	if (typeof window === "undefined") return initialValues;

	const stored = window.sessionStorage.getItem("quantum_car_booking");
	if (!stored) return initialValues;

	try {
		const parsed = JSON.parse(stored) as StoredTransferBooking;
		const firstLocation = parsed.firstLocation?.trim() ?? "";
		const secondLocation = parsed.secondLocation?.trim() ?? "";

		return {
			...initialValues,
			airport:
				serviceType === "airport_pickup" ? firstLocation : secondLocation,
			address:
				serviceType === "airport_pickup" ? secondLocation : firstLocation,
			pickupDate: parsed.date?.trim() ?? "",
			pickupTime: parsed.time?.trim() ?? "",
		};
	} catch (error) {
		console.error("Error parsing stored airport request details", error);
		return initialValues;
	}
}

function SectionHeading({ title }: { title: string }) {
	return (
		<div>
			<h2 className="text-sm font-medium text-text md:text-[20px]">{title}</h2>
			<div className="relative mt-2 h-px w-full bg-black/25">
				<div className="absolute top-0 left-0 h-px w-[87px] bg-black md:w-[138px]" />
			</div>
		</div>
	);
}

function AutocompleteField({
	id,
	name,
	label,
	value,
	error,
	options,
	onBlur,
	onChange,
}: {
	id: string;
	name: FieldName;
	label: string;
	value: string;
	error?: string;
	options: readonly (string | { label: string; keyword: readonly string[] })[];
	onBlur: () => void;
	onChange: (value: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const matches = useMemo(() => {
		const query = value.trim().toLowerCase();
		return options
			.map((option) =>
				typeof option === "string" ? { label: option, keyword: [] } : option,
			)
			.filter(
				(option) =>
					!query ||
					[option.label, ...option.keyword].some((term) =>
						term.toLowerCase().includes(query),
					),
			)
			.slice(0, 8);
	}, [options, value]);

	return (
		<div className="relative">
			<FloatingInput
				id={id}
				name={name}
				label={label}
				value={value}
				error={error}
				trailingIcon={<ChevronDown className="size-5 text-text" />}
				onFocus={() => setOpen(true)}
				onBlur={() => {
					window.setTimeout(() => setOpen(false), 150);
					onBlur();
				}}
				onChange={(event) => {
					onChange(event.target.value);
					setOpen(true);
				}}
				className="pr-12"
			/>
			{open && matches.length > 0 ? (
				<div className="absolute z-50 top-[calc(100%+4px)] right-0 left-0 max-h-56 overflow-y-auto rounded-[5px] border border-black/10 bg-white py-1 shadow-[0px_4px_16px_rgba(0,0,0,0.1)]">
					{matches.map((option) => (
						<button
							key={option.label}
							type="button"
							onMouseDown={(event) => {
								event.preventDefault();
								onChange(option.label);
								setOpen(false);
							}}
							className="w-full cursor-pointer px-4 py-2.5 text-left text-xs font-light text-text transition-colors hover:bg-[#9E328A]/5 hover:text-[#9E328A] md:text-sm"
						>
							{option.label}
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}

export default function CarServicesAlternateRequestForm({
	serviceType,
}: {
	serviceType: ServiceType;
}) {
	const [values, setValues] = useState(() => getInitialValues(serviceType));
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<TouchedFields>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");

	const minDate = useMemo(() => getTodayDateValue(), []);
	const airportOptions = useMemo(
		() =>
			airports.map((airport) => ({
				label: airport.name,
				keyword: airport.keyword,
			})),
		[],
	);
	const isPickup = serviceType === "airport_pickup";

	const validateField = (name: FieldName, formValues: FormValues): string => {
		switch (name) {
			case "airport":
				return formValues.airport.trim() ? "" : "Airport is required.";
			case "address":
				if (!formValues.address.trim()) return "Address is required.";
				return formValues.address.trim().length <= 180
					? ""
					: "Address must be 180 characters or fewer.";
			case "pickupDate":
				if (!formValues.pickupDate) return "Pick up date is required.";
				if (!isValidDateValue(formValues.pickupDate)) {
					return "Please choose a valid pick up date.";
				}
				return formValues.pickupDate < minDate
					? "Date cannot be in the past."
					: "";
			case "pickupTime":
				return formValues.pickupTime.trim() ? "" : "Pick up time is required.";
			case "fullName":
				if (!formValues.fullName.trim()) return "Full name is required.";
				return formValues.fullName.trim().length <= 100
					? ""
					: "Full name must be 100 characters or fewer.";
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
			case "alternativePhone":
				return !formValues.alternativePhone ||
					isValidPhoneNumberValue(formValues.alternativePhone)
					? ""
					: "Please enter a valid alternative phone number.";
			// case "whatsappNumber":
			// 	return !formValues.whatsappNumber ||
			// 		isValidPhoneNumberValue(formValues.whatsappNumber)
			// 		? ""
			// 		: "Please enter a valid WhatsApp number.";
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
			return nextValues;
		});
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitting) return;

		const fields: FieldName[] = [
			"airport",
			"address",
			"pickupDate",
			"pickupTime",
			"fullName",
			"email",
			"phone",
			"alternativePhone",
			// "whatsappNumber",
			"additionalComment",
		];
		const nextErrors = fields.reduce((acc, field) => {
			const error = validateField(field, values);
			if (error) acc[field] = error;
			return acc;
		}, {} as FormErrors);

		setErrors(nextErrors);
		setTouched(
			fields.reduce((acc, field) => {
				acc[field] = true;
				return acc;
			}, {} as TouchedFields),
		);

		if (Object.keys(nextErrors).length > 0) return;

		setIsSubmitting(true);
		setSubmitError("");

		const result = await submitAirportAlternateRequest({
			airportDetails: {
				airport: values.airport.trim(),
				address: values.address.trim(),
				pickupDate: values.pickupDate,
				pickupTime: values.pickupTime.trim(),
			},
			passengerDetails: {
				fullName: values.fullName.trim(),
				email: values.email.trim(),
				phone: values.phone.trim(),
				alternativePhone: values.alternativePhone.trim(),
				whatsappNumber: "",
				flightNumber: values.flightNumber.trim(),
				additionalComment: values.additionalComment.trim(),
			},
		});

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

	const renderAirportField = () => (
		<AutocompleteField
			id="alternate-airport"
			name="airport"
			label={isPickup ? "Pick Up From Airport" : "Drop Off At Airport"}
			value={values.airport}
			error={errors.airport}
			options={airportOptions}
			onBlur={() => markTouched("airport")}
			onChange={(value) => setFieldValue("airport", value)}
		/>
	);

	const renderAddressField = () => (
		<AutocompleteField
			id="alternate-address"
			name="address"
			label={isPickup ? "Drop Off Address" : "Pick Up Address"}
			value={values.address}
			error={errors.address}
			options={CITY_OPTIONS}
			onBlur={() => markTouched("address")}
			onChange={(value) => setFieldValue("address", value)}
		/>
	);

	return (
		<>
			<BookingSuccessDialog
				open={submitted}
				onClose={handleCloseDialog}
				title="Request Received"
				description="Your request has been received. Our team will review your details and contact you shortly."
			/>

			<section
				className="w-full bg-white pb-10 md:pb-16"
				aria-label="Airport transfer request form"
			>
				<div className="relative h-[124px] w-full md:h-[200px]">
					<Image
						src="/ourServices/carServices/carBookingBanner.jpg"
						alt=""
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
				</div>

				<div className="relative z-10 mx-auto -mt-[62px] max-w-[1086px] px-5 md:-mt-[136px] md:px-0">
					<div className="overflow-hidden rounded-[8px] bg-[#f9f9f9] md:grid md:grid-cols-[360px_1fr] md:rounded-[10px]">
						<div className="relative hidden min-h-[1080px] md:block">
							<Image
								src="/assets/quantumBg.png"
								alt=""
								fill
								className="object-cover"
								sizes="360px"
							/>
							<div className="absolute inset-0 bg-[#9e328a]/40" />
							<div className="relative z-10 p-10 pt-16 text-white">
								<h1 className="text-2xl font-black leading-normal">
									Reserve Your Car
								</h1>
								<p className="mt-3 text-[20px] leading-[1.4] font-medium">
									Complete your booking and let&apos;s get you all squared away.
								</p>
							</div>
						</div>

						<div className="bg-[#f9f9f9] p-5 md:p-10 md:pt-20">
							<div className="mb-8 text-text md:hidden">
								<h1 className="text-2xl font-black leading-normal">
									Reserve Your Car
								</h1>
								<p className="mt-2 text-base leading-normal font-medium opacity-80">
									Complete your booking and let&apos;s get you all squared away.
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								noValidate
								aria-busy={isSubmitting}
								className="space-y-8"
							>
								<section className="space-y-4">
									<SectionHeading title="Details" />

									{isPickup ? renderAirportField() : renderAddressField()}
									{isPickup ? renderAddressField() : renderAirportField()}

									<div className="grid gap-4 sm:grid-cols-2">
										<FloatingInput
											id="alternate-pickup-date"
											name="pickupDate"
											type="date"
											min={minDate}
											label="Pick Up Date"
											value={values.pickupDate}
											error={errors.pickupDate}
											forceLabel
											trailingIcon={
												<CalendarDays className="size-5 text-black/55" />
											}
											onChange={(event) =>
												setFieldValue("pickupDate", event.target.value)
											}
											onBlur={() => markTouched("pickupDate")}
										/>

										<AutocompleteField
											id="alternate-pickup-time"
											name="pickupTime"
											label="Pick Up Time"
											value={values.pickupTime}
											error={errors.pickupTime}
											options={PICKUP_TIME_OPTIONS}
											onBlur={() => markTouched("pickupTime")}
											onChange={(value) => setFieldValue("pickupTime", value)}
										/>
									</div>
								</section>

								<section className="space-y-4">
									<SectionHeading title="Contact Details" />

									<FloatingInput
										id="alternate-full-name"
										name="fullName"
										label="Enter Full Name"
										autoComplete="name"
										value={values.fullName}
										error={errors.fullName}
										onChange={(event) =>
											setFieldValue("fullName", event.target.value)
										}
										onBlur={() => markTouched("fullName")}
									/>

									<FloatingInput
										id="alternate-email"
										name="email"
										type="email"
										inputMode="email"
										autoComplete="email"
										label="Enter Email Address"
										value={values.email}
										error={errors.email}
										onChange={(event) =>
											setFieldValue("email", event.target.value)
										}
										onBlur={() => markTouched("email")}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FloatingPhoneInput
											id="alternate-phone"
											name="phone"
											label="Enter Phone Number"
											value={values.phone}
											error={errors.phone}
											onChange={(value) => setFieldValue("phone", value)}
											onBlur={() => markTouched("phone")}
										/>

										<FloatingPhoneInput
											id="alternate-alt-phone"
											name="alternativePhone"
											label="Enter Alternative Number"
											value={values.alternativePhone}
											error={errors.alternativePhone}
											onChange={(value) =>
												setFieldValue("alternativePhone", value)
											}
											onBlur={() => markTouched("alternativePhone")}
										/>
									</div>

									{/* <div className="grid gap-4 sm:grid-cols-2">
										<FloatingPhoneInput
											id="alternate-whatsapp"
											name="whatsappNumber"
											label="Enter WhatsApp Number"
											value={values.whatsappNumber}
											error={errors.whatsappNumber}
											onChange={(value) =>
												setFieldValue("whatsappNumber", value)
											}
											onBlur={() => markTouched("whatsappNumber")}
										/>
									</div> */}

									<FloatingInput
										id="alternate-flight-number"
										name="flightNumber"
										label="Enter Flight Number (Optional)"
										value={values.flightNumber}
										onChange={(event) =>
											setFieldValue("flightNumber", event.target.value)
										}
									/>

									<div className="flex items-start gap-2 text-black pl-1 py-1">
										<Info className="mt-0.5 size-4 shrink-0" />
										<span className="text-xs font-light">
											Driver can track your arrival and be ready to pick you up
											when you land.
										</span>
									</div>

									<FloatingTextarea
										id="alternate-comment"
										name="additionalComment"
										label="Additional Comment"
										value={values.additionalComment}
										error={errors.additionalComment}
										onChange={(event) =>
											setFieldValue("additionalComment", event.target.value)
										}
										onBlur={() => markTouched("additionalComment")}
										className="!min-h-[96px] !resize-none"
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

								<div className="flex justify-center pt-2">
									<button
										type="submit"
										disabled={isSubmitting}
										className="flex h-12 w-full items-center justify-center rounded-full bg-[#9E328A] text-sm font-bold text-white shadow-[0px_4px_12px_rgba(158,50,138,0.25)] transition-colors hover:bg-[#8a2b78] active:scale-99 disabled:cursor-not-allowed disabled:opacity-80 sm:w-[227px] md:h-14 md:text-base"
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
