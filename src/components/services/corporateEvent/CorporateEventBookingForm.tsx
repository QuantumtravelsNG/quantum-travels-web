"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import DateRangePicker, {
	type DateRangePickerProps,
} from "@wojtekmaj/react-daterange-picker";
import { CalendarDays, Clock3 } from "lucide-react";
import SuccessDialog from "@/components/SuccessDialog";
import { submitCorporateEventReservation } from "@/app/actions";
import {
	FloatingInput,
	FloatingPhoneInput,
	FloatingSelect,
	FloatingTextarea,
} from "@/components/ui/floating-fields";
import { isValidPhoneNumberValue } from "@/lib/phone";
import {
	getCityOptions,
	getCountryOptions,
	getStateOptions,
	isValidCityName,
	isValidCountryCode,
	isValidStateCode,
} from "@/lib/locations";
import {
	formatDateValue,
	getTodayDateValue,
	isValidDateValue,
	parseDateValue,
} from "@/lib/date-values";

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const eventTypeOptions = [
	"Conference",
	"Seminar",
	"Exhibition",
	"Corporate Retreat",
	"Product Launch",
	"Award Ceremony",
	"Other",
] as const;

type FormValues = {
	eventType: string;
	eventTitle: string;
	startDate: string;
	endDate: string;
	time: string;
	country: string;
	state: string;
	city: string;
	venueAddress: string;
	numberOfGuests: string;
	eventTheme: string;
	fullName: string;
	companyGroupName: string;
	email: string;
	phoneNumber: string;
	additionalComment: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

const initialValues: FormValues = {
	eventType: "",
	eventTitle: "",
	startDate: "",
	endDate: "",
	time: "",
	country: "",
	state: "",
	city: "",
	venueAddress: "",
	numberOfGuests: "",
	eventTheme: "",
	fullName: "",
	companyGroupName: "",
	email: "",
	phoneNumber: "",
	additionalComment: "",
};

function formatGuests(value: string) {
	return value.replace(/\D/g, "").slice(0, 6);
}

function isValidEmail(value: string) {
	const trimmed = value.trim();
	return (
		trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
	);
}

function isValidTime(value: string) {
	return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function validateField(name: FieldName, values: FormValues): string {
	switch (name) {
		case "eventType":
			return eventTypeOptions.includes(
				values.eventType as (typeof eventTypeOptions)[number],
			)
				? ""
				: "Select a valid event type.";
		case "eventTitle":
			if (!values.eventTitle.trim()) return "Event title is required.";
			return values.eventTitle.trim().length <= 120
				? ""
				: "Event title must be 120 characters or fewer.";
		case "startDate":
			if (!values.startDate) return "Start date is required.";
			if (!isValidDateValue(values.startDate)) {
				return "Select a valid start date.";
			}
			return values.startDate >= getTodayDateValue()
				? ""
				: "Start date cannot be in the past.";
		case "endDate":
			if (!values.endDate) return "End date is required.";
			if (!isValidDateValue(values.endDate)) {
				return "Select a valid end date.";
			}
			if (!values.startDate) return "Select a start date first.";
			if (!isValidDateValue(values.startDate)) {
				return "Select a valid start date first.";
			}
			return values.endDate >= values.startDate
				? ""
				: "End date must be on or after the start date.";
		case "time":
			if (!values.time) return "Time is required.";
			return isValidTime(values.time) ? "" : "Select a valid time.";
		case "country":
			return isValidCountryCode(values.country)
				? ""
				: "Select a valid country.";
		case "state":
			return isValidStateCode(values.country, values.state)
				? ""
				: "Select a valid state.";
		case "city":
			return isValidCityName(values.country, values.state, values.city)
				? ""
				: "Select a valid city.";
		case "venueAddress":
			return values.venueAddress.trim().length <= 180
				? ""
				: "Venue address must be 180 characters or fewer.";
		case "numberOfGuests": {
			const guests = Number(values.numberOfGuests);
			if (!values.numberOfGuests) return "Number of guests is required.";
			return Number.isInteger(guests) && guests > 0 && guests <= 100000
				? ""
				: "Enter a valid number of guests.";
		}
		case "eventTheme":
			if (!values.eventTheme.trim()) return "Event theme is required.";
			return values.eventTheme.trim().length <= 80
				? ""
				: "Event theme must be 80 characters or fewer.";
		case "fullName":
			if (!values.fullName.trim()) return "Full name is required.";
			return values.fullName.trim().length <= 100
				? ""
				: "Full name must be 100 characters or fewer.";
		case "companyGroupName":
			return values.companyGroupName.trim().length <= 120
				? ""
				: "Company or group name must be 120 characters or fewer.";
		case "email":
			if (!values.email.trim()) return "Email address is required.";
			return isValidEmail(values.email)
				? ""
				: "Please enter a valid email address.";
		case "phoneNumber":
			if (!values.phoneNumber.trim()) return "Phone number is required.";
			return isValidPhoneNumberValue(values.phoneNumber)
				? ""
				: "Please enter a valid phone number.";
		case "additionalComment":
			return values.additionalComment.trim().length <= 500
				? ""
				: "Additional comment must be 500 characters or fewer.";
		default:
			return "";
	}
}

function getAllErrors(values: FormValues): FormErrors {
	return {
		eventType: validateField("eventType", values),
		eventTitle: validateField("eventTitle", values),
		startDate: validateField("startDate", values),
		endDate: validateField("endDate", values),
		time: validateField("time", values),
		country: validateField("country", values),
		state: validateField("state", values),
		city: validateField("city", values),
		venueAddress: validateField("venueAddress", values),
		numberOfGuests: validateField("numberOfGuests", values),
		eventTheme: validateField("eventTheme", values),
		fullName: validateField("fullName", values),
		companyGroupName: validateField("companyGroupName", values),
		email: validateField("email", values),
		phoneNumber: validateField("phoneNumber", values),
		additionalComment: validateField("additionalComment", values),
	};
}

function createPayload(values: FormValues) {
	return {
		eventType: values.eventType as (typeof eventTypeOptions)[number],
		eventTitle: values.eventTitle.trim(),
		startDate: values.startDate,
		endDate: values.endDate,
		time: values.time,
		country: values.country,
		state: values.state,
		city: values.city,
		numberOfGuests: Number(values.numberOfGuests),
		eventTheme: values.eventTheme.trim(),
		fullName: values.fullName.trim(),
		email: values.email.trim().toLowerCase(),
		phoneNumber: values.phoneNumber.trim(),
		...(values.venueAddress.trim()
			? { venueAddress: values.venueAddress.trim() }
			: {}),
		...(values.companyGroupName.trim()
			? { companyGroupName: values.companyGroupName.trim() }
			: {}),
		...(values.additionalComment.trim()
			? { additionalComment: values.additionalComment.trim() }
			: {}),
	};
}

type DateRangePickerValue = Parameters<
	NonNullable<DateRangePickerProps["onChange"]>
>[0];

function CorporateEventDateRangeField({
	disabled,
	endDate,
	error,
	minDate,
	onBlur,
	onChange,
	startDate,
}: {
	disabled: boolean;
	endDate: string;
	error?: string;
	minDate: string;
	onBlur: () => void;
	onChange: (startDate: string, endDate: string) => void;
	startDate: string;
}) {
	const start = parseDateValue(startDate);
	const end = parseDateValue(endDate);
	const min = parseDateValue(minDate) ?? new Date();
	const hasValue = Boolean(startDate || endDate);
	const errorId = error ? "event-date-range-error" : undefined;

	function handleChange(value: DateRangePickerValue) {
		if (Array.isArray(value)) {
			const [nextStart, nextEnd] = value;
			onChange(
				nextStart ? formatDateValue(nextStart) : "",
				nextEnd ? formatDateValue(nextEnd) : "",
			);
			return;
		}

		if (value instanceof Date) {
			const dateValue = formatDateValue(value);
			onChange(dateValue, dateValue);
			return;
		}

		onChange("", "");
	}

	return (
		<div className="space-y-2 w-full">
			<div className="relative">
				{hasValue ? (
					<span className="pointer-events-none absolute left-4 top-3 z-10 text-[12px] leading-none font-medium text-black/60">
						Start & End Date
					</span>
				) : (
					<span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-text md:text-lg">
						Start & End Date
					</span>
				)}
				<DateRangePicker
					id="event-date-range"
					name="eventDateRange"
					className={[
						"qt-date-range-picker",
						hasValue ? "qt-date-range-picker--has-value" : "",
						error ? "qt-date-range-picker--error" : "",
					].join(" ")}
					aria-describedby={errorId}
					calendarAriaLabel="Open start and end date calendar"
					calendarIcon={<CalendarDays className="size-5 text-text" />}
					clearIcon={null}
					dayAriaLabel="Day"
					disabled={disabled}
					format="dd-MM-y"
					locale="en-US"
					maxDetail="month"
					minDate={min}
					monthAriaLabel="Month"
					nativeInputAriaLabel="Start and end date"
					onBlur={onBlur}
					onChange={handleChange}
					onInvalidChange={onBlur}
					openCalendarOnFocus
					rangeDivider={<span className="px-1 text-black/45">to</span>}
					required
					showLeadingZeros
					value={[start, end]}
					yearAriaLabel="Year"
				/>
			</div>
			{error ? (
				<p
					id={errorId}
					className="text-[12px] font-medium text-[#9E328A]"
					role="alert"
				>
					{error}
				</p>
			) : null}
		</div>
	);
}

function SectionHeading({ title }: { title: string }) {
	return (
		<div>
			<h2 className="text-sm font-medium text-text md:text-[20px]">{title}</h2>
			<div className="mt-2 h-px w-full bg-black/20">
				<div className="h-px w-[87px] bg-black md:w-[138px]" />
			</div>
		</div>
	);
}

export default function CorporateEventBookingForm() {
	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<TouchedFields>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");

	const countries = useMemo(() => getCountryOptions(), []);
	const states = useMemo(
		() => getStateOptions(values.country),
		[values.country],
	);
	const cities = useMemo(
		() => getCityOptions(values.country, values.state),
		[values.country, values.state],
	);
	const minEventDate = useMemo(() => getTodayDateValue(), []);

	const isFormDisabled = isSubmitting || submitted;
	const disabledClassName =
		"disabled:cursor-not-allowed disabled:text-black/40 disabled:opacity-40";

	function markTouched(name: FieldName) {
		setTouched((current) => ({ ...current, [name]: true }));
		setErrors((current) => ({
			...current,
			[name]: validateField(name, values),
		}));
	}

	function setFieldValue<K extends FieldName>(name: K, value: FormValues[K]) {
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
	}

	function handleTextChange(name: FieldName, value: string) {
		const nextValue = name === "numberOfGuests" ? formatGuests(value) : value;

		setFieldValue(name, nextValue);
		if (submitError) setSubmitError("");
	}

	function markDateRangeTouched() {
		setTouched((current) => ({
			...current,
			startDate: true,
			endDate: true,
		}));
		setErrors((current) => ({
			...current,
			startDate: validateField("startDate", values),
			endDate: validateField("endDate", values),
		}));
	}

	function handleDateRangeChange(startDate: string, endDate: string) {
		if (submitError) setSubmitError("");

		setValues((current) => {
			const normalizedEndDate =
				startDate && endDate && endDate < startDate ? startDate : endDate;
			const nextValues = {
				...current,
				startDate,
				endDate: normalizedEndDate,
			};

			setErrors((currentErrors) => ({
				...currentErrors,
				startDate: touched.startDate
					? validateField("startDate", nextValues)
					: currentErrors.startDate,
				endDate: touched.endDate
					? validateField("endDate", nextValues)
					: currentErrors.endDate,
			}));

			return nextValues;
		});
	}

	function handleCountryChange(value: string) {
		if (submitError) setSubmitError("");

		const nextValues = {
			...values,
			country: value,
			state: "",
			city: "",
		};

		setValues(nextValues);
		setErrors((current) => ({
			...current,
			country: touched.country
				? validateField("country", nextValues)
				: current.country,
			state: touched.state ? validateField("state", nextValues) : current.state,
			city: touched.city ? validateField("city", nextValues) : current.city,
		}));
	}

	function handleStateChange(value: string) {
		if (submitError) setSubmitError("");

		const nextValues = {
			...values,
			state: value,
			city: "",
		};

		setValues(nextValues);
		setErrors((current) => ({
			...current,
			state: touched.state ? validateField("state", nextValues) : current.state,
			city: touched.city ? validateField("city", nextValues) : current.city,
		}));
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (isFormDisabled) {
			return;
		}

		const nextErrors = getAllErrors(values);
		const hasErrors = Object.values(nextErrors).some(Boolean);

		setErrors(nextErrors);
		setTouched({
			eventType: true,
			eventTitle: true,
			startDate: true,
			endDate: true,
			time: true,
			country: true,
			state: true,
			city: true,
			venueAddress: true,
			numberOfGuests: true,
			eventTheme: true,
			fullName: true,
			companyGroupName: true,
			email: true,
			phoneNumber: true,
			additionalComment: true,
		});

		if (hasErrors) {
			return;
		}

		const payload = createPayload(values);

		setIsSubmitting(true);
		const result = await submitCorporateEventReservation(payload);
		setIsSubmitting(false);

		if (!result.ok) {
			setSubmitError(result.message);
			return;
		}

		setSubmitted(true);
	}

	function handleCloseDialog() {
		setSubmitted(false);
		setValues(initialValues);
		setErrors({});
		setTouched({});
		setSubmitError("");
	}

	return (
		<>
			<SuccessDialog
				open={submitted}
				onClose={handleCloseDialog}
				title="Booking Request Submitted"
				description="Thank you for your request. Our team will assess your requirements, verify availability, and share a confirmed quote. Once reviewed, you'll be guided through the next steps to finalize your reservation."
				buttonLabel="Ok, I Understand"
			/>

			<section
				className="bg-white pb-10 md:pb-16"
				aria-label="Corporate event reservation form"
			>
				<div className="relative h-[124px] w-full md:h-[200px]">
					<Image
						src="/assets/quantumBg.png"
						alt=""
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
				</div>

				<div className="relative z-10 mx-auto -mt-[62px] max-w-[1086px] px-5 md:-mt-[136px] md:px-0">
					<div className="overflow-hidden rounded-[8px] bg-[#f9f9f9] shadow-[0px_8px_24px_rgba(0,0,0,0.06)] md:grid md:grid-cols-[360px_1fr] md:rounded-[10px]">
						<div className="relative hidden min-h-[1200px] md:block">
							<Image
								src="/assets/quantumBg.png"
								alt=""
								fill
								className="object-cover"
								sizes="360px"
							/>
							<div className="absolute inset-0 bg-[#9e328a]/40" />
							<div className="relative z-10 px-10 pt-[65px] text-white">
								<h1 className="text-2xl leading-normal font-black">
									Make Reservation
								</h1>
								<p className="mt-1 text-[20px] leading-[1.4] font-medium">
									Complete your booking and let&apos;s get you all squared away.
								</p>
							</div>
						</div>

						<div className="p-5 md:px-16 md:pt-20 md:pb-14">
							<div className="mb-8 text-text md:hidden">
								<h1 className="text-2xl leading-normal font-black">
									Make Reservation
								</h1>
								<p className="mt-2 text-base leading-normal font-medium">
									Complete your booking and let&apos;s get you all squared away.
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								noValidate
								aria-busy={isFormDisabled}
								className="space-y-10"
							>
								<section className="space-y-4">
									<SectionHeading title="Event Details" />

									<FloatingSelect
										id="event-type"
										label="Event Type"
										value={values.eventType}
										disabled={isFormDisabled}
										error={errors.eventType}
										onBlur={() => markTouched("eventType")}
										onChange={(event) =>
											setFieldValue("eventType", event.target.value)
										}
										className={disabledClassName}
									>
										<option value="">Event Type</option>
										{eventTypeOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</FloatingSelect>

									<FloatingInput
										id="event-title"
										type="text"
										label="Event Title"
										value={values.eventTitle}
										disabled={isFormDisabled}
										error={errors.eventTitle}
										maxLength={120}
										autoComplete="off"
										onBlur={() => markTouched("eventTitle")}
										onChange={(event) =>
											handleTextChange("eventTitle", event.target.value)
										}
										className={disabledClassName}
									/>

									<div className="grid gap-4 md:grid-cols-2">
										<CorporateEventDateRangeField
											disabled={isFormDisabled}
											startDate={values.startDate}
											endDate={values.endDate}
											minDate={minEventDate}
											error={errors.startDate || errors.endDate}
											onBlur={markDateRangeTouched}
											onChange={handleDateRangeChange}
										/>

										<FloatingInput
											id="event-time"
											type="time"
											label="Time"
											value={values.time}
											disabled={isFormDisabled}
											error={errors.time}
											trailingIcon={<Clock3 className="size-5" />}
											forceLabel
											onBlur={() => markTouched("time")}
											onChange={(event) =>
												setFieldValue("time", event.target.value)
											}
											className={`${disabledClassName} pr-12`}
										/>
									</div>

									<div className="grid gap-4 md:grid-cols-3">
										<FloatingSelect
											id="event-country"
											label="Country"
											value={values.country}
											disabled={isFormDisabled}
											error={errors.country}
											onBlur={() => markTouched("country")}
											onChange={(event) =>
												handleCountryChange(event.target.value)
											}
											className={disabledClassName}
										>
											<option value="">Country</option>
											{countries.map((country) => (
												<option key={country.value} value={country.value}>
													{country.label}
												</option>
											))}
										</FloatingSelect>

										<FloatingSelect
											id="event-state"
											label="State"
											value={values.state}
											disabled={isFormDisabled || !values.country}
											error={errors.state}
											onBlur={() => markTouched("state")}
											onChange={(event) =>
												handleStateChange(event.target.value)
											}
											className={disabledClassName}
										>
											<option value="">State</option>
											{states.map((state) => (
												<option key={state.value} value={state.value}>
													{state.label}
												</option>
											))}
										</FloatingSelect>

										<FloatingSelect
											id="event-city"
											label="City"
											value={values.city}
											disabled={isFormDisabled || !values.state}
											error={errors.city}
											onBlur={() => markTouched("city")}
											onChange={(event) =>
												setFieldValue("city", event.target.value)
											}
											className={disabledClassName}
										>
											<option value="">City</option>
											{cities.map((city) => (
												<option key={city.value} value={city.value}>
													{city.label}
												</option>
											))}
										</FloatingSelect>
									</div>

									<FloatingInput
										id="event-venue-address"
										type="text"
										label="Venue Address (if already selected)"
										value={values.venueAddress}
										disabled={isFormDisabled}
										error={errors.venueAddress}
										maxLength={180}
										autoComplete="street-address"
										onBlur={() => markTouched("venueAddress")}
										onChange={(event) =>
											handleTextChange("venueAddress", event.target.value)
										}
										className={disabledClassName}
									/>

									<div className="grid gap-4 md:grid-cols-2">
										<FloatingInput
											id="event-guests"
											type="text"
											inputMode="numeric"
											label="Number of Guests"
											value={values.numberOfGuests}
											disabled={isFormDisabled}
											error={errors.numberOfGuests}
											onBlur={() => markTouched("numberOfGuests")}
											onChange={(event) =>
												handleTextChange("numberOfGuests", event.target.value)
											}
											className={disabledClassName}
										/>

										<FloatingInput
											id="event-theme"
											type="text"
											label="Event Theme"
											value={values.eventTheme}
											disabled={isFormDisabled}
											error={errors.eventTheme}
											maxLength={80}
											onBlur={() => markTouched("eventTheme")}
											onChange={(event) =>
												handleTextChange("eventTheme", event.target.value)
											}
											className={disabledClassName}
										/>
									</div>
								</section>

								<section className="space-y-4">
									<SectionHeading title="Contact Details" />

									<FloatingInput
										id="event-full-name"
										type="text"
										label="Full Name"
										value={values.fullName}
										disabled={isFormDisabled}
										error={errors.fullName}
										maxLength={100}
										autoComplete="name"
										onBlur={() => markTouched("fullName")}
										onChange={(event) =>
											handleTextChange("fullName", event.target.value)
										}
										className={disabledClassName}
									/>

									<FloatingInput
										id="event-company-name"
										type="text"
										label="Company/Group Name (Optional)"
										value={values.companyGroupName}
										disabled={isFormDisabled}
										error={errors.companyGroupName}
										maxLength={120}
										autoComplete="organization"
										onBlur={() => markTouched("companyGroupName")}
										onChange={(event) =>
											handleTextChange("companyGroupName", event.target.value)
										}
										className={disabledClassName}
									/>

									<div className="grid gap-4 md:grid-cols-2">
										<FloatingInput
											id="event-email"
											type="email"
											inputMode="email"
											label="Email Address"
											value={values.email}
											disabled={isFormDisabled}
											error={errors.email}
											autoComplete="email"
											onBlur={() => markTouched("email")}
											onChange={(event) =>
												handleTextChange("email", event.target.value)
											}
											className={disabledClassName}
										/>

										<FloatingPhoneInput
											id="event-phone"
											label="Phone Number"
											value={values.phoneNumber}
											disabled={isFormDisabled}
											error={errors.phoneNumber}
											autoComplete="tel"
											onBlur={() => markTouched("phoneNumber")}
											onChange={(value) =>
												handleTextChange("phoneNumber", value)
											}
											className={disabledClassName}
										/>
									</div>

									<FloatingTextarea
										id="event-comment"
										label="Additional Comment"
										value={values.additionalComment}
										disabled={isFormDisabled}
										error={errors.additionalComment}
										maxLength={500}
										onBlur={() => markTouched("additionalComment")}
										onChange={(event) =>
											handleTextChange("additionalComment", event.target.value)
										}
										className={`${disabledClassName} !min-h-[96px] !resize-none`}
									/>
								</section>

								<div className="flex flex-col items-center">
									{submitError ? (
										<p
											className="mb-4 text-center text-sm font-medium text-[#9e328a]"
											role="alert"
										>
											{submitError}
										</p>
									) : null}
									<button
										type="submit"
										disabled={isFormDisabled}
										className="flex h-[38px] w-[160px] items-center justify-center rounded-[50px] bg-[#9e328a] px-8 text-xs font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 disabled:cursor-not-allowed disabled:bg-[#8a2b78] disabled:opacity-80 md:h-14 md:w-[227px] md:text-base"
									>
										{isSubmitting ? "Submitting..." : "Submit"}
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
