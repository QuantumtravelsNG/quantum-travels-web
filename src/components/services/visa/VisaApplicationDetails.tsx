"use client";

import SuccessDialog from "@/components/SuccessDialog";
import {
	FloatingInput,
	FloatingPhoneInput,
	FloatingTextarea,
} from "@/components/ui/floating-fields";
import { submitVisaApplication } from "@/app/actions";
import { isValidPhoneNumberValue } from "@/lib/phone";
import { isRemoteImage } from "@/lib/images";
import { formatVisaPrice, type VisaType } from "@/lib/quantum";
import { BookOpenText, CalendarDays, Clock3, Info } from "lucide-react";
import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

type FormValues = {
	fullName: string;
	email: string;
	phoneNumber: string;
	numberOfApplicants: string;
	travelDate: string;
	additionalComment: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

const initialValues: FormValues = {
	fullName: "",
	email: "",
	phoneNumber: "",
	numberOfApplicants: "",
	travelDate: "",
	additionalComment: "",
};

function formatApplicantCount(value: string) {
	return value.replace(/\D/g, "").slice(0, 3);
}

function isValidEmail(value: string) {
	const trimmed = value.trim();
	return (
		trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
	);
}

function isValidIsoDate(value: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return false;

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const parsed = new Date(year, month - 1, day);

	return (
		parsed.getFullYear() === year &&
		parsed.getMonth() === month - 1 &&
		parsed.getDate() === day
	);
}

function isFutureOrToday(value: string) {
	if (!isValidIsoDate(value)) return false;

	const selected = new Date(`${value}T00:00:00`);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return selected >= today;
}

function validateField(name: FieldName, values: FormValues): string {
	switch (name) {
		case "fullName":
			if (!values.fullName.trim()) return "Full name is required.";
			return values.fullName.trim().length <= 100
				? ""
				: "Full name must be 100 characters or fewer.";
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
		case "numberOfApplicants": {
			const applicants = Number(values.numberOfApplicants);
			if (!values.numberOfApplicants)
				return "Number of applicants is required.";
			return Number.isInteger(applicants) && applicants > 0 && applicants <= 50
				? ""
				: "Enter a valid number of applicants, up to 50.";
		}
		case "travelDate":
			if (!values.travelDate) return "Travel date is required.";
			return isFutureOrToday(values.travelDate)
				? ""
				: "Select today or a future travel date.";
		case "additionalComment":
			return values.additionalComment.trim().length <= 1000
				? ""
				: "Additional comment must be 1000 characters or fewer.";
		default:
			return "";
	}
}

function getAllErrors(values: FormValues): FormErrors {
	return {
		fullName: validateField("fullName", values),
		email: validateField("email", values),
		phoneNumber: validateField("phoneNumber", values),
		numberOfApplicants: validateField("numberOfApplicants", values),
		travelDate: validateField("travelDate", values),
		additionalComment: validateField("additionalComment", values),
	};
}

function createPayload(visa: VisaType, values: FormValues) {
	return {
		visaID: visa.id,
		fullName: values.fullName.trim(),
		email: values.email.trim().toLowerCase(),
		phoneNumber: values.phoneNumber.trim(),
		numberOfApplicants: Number(values.numberOfApplicants),
		travelDate: values.travelDate,
		...(values.additionalComment.trim()
			? { additionalComment: values.additionalComment.trim() }
			: {}),
	};
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
	return (
		<div className="flex items-center gap-2 text-sm leading-normal font-light text-text md:text-lg md:leading-[1.5]">
			<span className="shrink-0 text-text">{icon}</span>
			<span>{text}</span>
		</div>
	);
}

function DetailRule() {
	return <div className="h-px w-full bg-black/20" />;
}

function FormSectionHeading() {
	return (
		<div>
			<h2 className="text-sm font-medium text-text md:text-[20px]">Details</h2>
			<div className="mt-2 h-px w-full bg-black/20">
				<div className="h-px w-[59px] bg-black md:w-[77px]" />
			</div>
		</div>
	);
}

export default function VisaApplicationDetails({ visa }: { visa: VisaType }) {
	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<TouchedFields>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");

	const isFormDisabled = isSubmitting;
	const disabledFieldClassName =
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
		const nextValue =
			name === "numberOfApplicants" ? formatApplicantCount(value) : value;

		setFieldValue(name, nextValue);
		if (submitError) setSubmitError("");
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
			fullName: true,
			email: true,
			phoneNumber: true,
			numberOfApplicants: true,
			travelDate: true,
			additionalComment: true,
		});

		if (hasErrors) {
			return;
		}

		setIsSubmitting(true);
		const result = await submitVisaApplication(createPayload(visa, values));
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
				title="Application Submitted"
				description="Thank you for your request. Our team will assess your requirements, verify availability, and share a confirmed quote. Once reviewed, you'll be guided through the next steps to finalize your application."
				buttonLabel="Ok, I Understand"
			/>

			<section className="mx-auto max-w-[1130px] px-4 pb-12 md:pb-20">
				<div className="rounded-[4px] bg-[#9e328a]/30 px-2.5 py-3 md:rounded-[5px] md:px-7 md:py-4">
					<div className="flex items-start gap-2 text-text">
						<Info className="mt-0.5 size-5 shrink-0 md:size-6" />
						<p className="text-xs leading-normal font-light md:text-base">
							The issuance or denial of a visa, and the processing timeline are
							at the sole discretion of the respective Embassy or Consulate.
						</p>
					</div>
				</div>

				<div className="mt-4 grid gap-4 lg:grid-cols-[520px_minmax(0,594px)] lg:items-start">
					<div className="space-y-4">
						<article className="grid min-h-[140px] grid-cols-[132px_1fr] overflow-hidden rounded-[8px] bg-[#f9f9f9] md:min-h-[220px] md:grid-cols-[200px_1fr] md:rounded-[10px]">
							<div className="relative min-h-[140px] md:min-h-[220px]">
								<Image
									src={visa.image}
									alt={visa.name}
									fill
									priority
									sizes="(max-width: 768px) 132px, 200px"
									className="object-cover"
									unoptimized={isRemoteImage(visa.image)}
								/>
							</div>

							<div className="flex flex-col justify-center gap-2 px-3 py-3 md:gap-4 md:px-6">
								<h1 className="text-base leading-normal font-bold text-text md:text-2xl">
									{visa.name}
								</h1>

								<div className="space-y-2 md:space-y-3">
									<InfoRow
										icon={<BookOpenText className="size-4 fill-black" />}
										text={visa.type}
									/>
									<InfoRow
										icon={<Clock3 className="size-4 fill-black" />}
										text={visa.processingTime}
									/>
									<InfoRow
										icon={<CalendarDays className="size-4 fill-black" />}
										text={visa.validity}
									/>
								</div>
							</div>
						</article>

						<article className="rounded-[8px] bg-[#f9f9f9] px-3 py-5 text-text md:rounded-[10px] md:px-6 md:py-6">
							<h2 className="text-base leading-normal font-bold md:text-2xl">
								Details
							</h2>

							<div className="mt-2">
								<p className="text-xs font-medium md:text-base">
									Required Documents
								</p>
								<p className="mt-2 text-[15px] leading-[1.5] font-light md:text-lg">
									{visa.requiredDocuments}
								</p>
							</div>

							<div className="mt-4 md:mt-5">
								<DetailRule />
							</div>

							<div className="mt-4 md:mt-5">
								<p className="text-xs font-medium md:text-base">24/7 Support</p>
								<p className="mt-3 text-sm leading-[1.5] font-light md:text-lg">
									<span className="font-bold">Phone :</span> {visa.supportPhone}
								</p>
								<p className="mt-2 text-sm leading-[1.5] font-light md:text-lg">
									<span className="font-bold">Email :</span> {visa.supportEmail}
								</p>
								<p className="mt-3 text-xs leading-[1.5] font-light md:text-base">
									{visa.terms}
								</p>
							</div>

							<div className="mt-4 space-y-4 md:mt-6">
								<DetailRule />
								<div>
									<p className="text-lg leading-normal font-bold md:text-[28px]">
										{formatVisaPrice(visa)}
									</p>
									<p className="mt-1 text-xs leading-normal font-light md:text-lg">
										{visa.priceNote}
									</p>
								</div>
								<DetailRule />
							</div>
						</article>
					</div>

					<form
						onSubmit={handleSubmit}
						noValidate
						aria-busy={isFormDisabled}
						className="overflow-hidden rounded-[8px] bg-[#f9f9f9] md:rounded-[10px]"
					>
						<div className="flex h-11 items-center bg-[#9e328a] px-3.5 md:h-16 md:px-5">
							<h2 className="text-sm font-medium text-white md:text-lg">
								Start Your Application
							</h2>
						</div>

						<div className="space-y-4 px-[18px] pt-4 pb-5 md:px-5 md:pt-8 md:pb-7">
							<FormSectionHeading />

							<FloatingInput
								id="visa-full-name"
								label="Enter Full Name"
								value={values.fullName}
								disabled={isFormDisabled}
								error={errors.fullName}
								maxLength={100}
								autoComplete="name"
								onBlur={() => markTouched("fullName")}
								onChange={(event) =>
									handleTextChange("fullName", event.target.value)
								}
								className={disabledFieldClassName}
							/>

							<div className="grid grid-cols-2 gap-2 md:gap-3.5">
								<FloatingInput
									id="visa-email"
									type="email"
									inputMode="email"
									label="Enter Email Address"
									value={values.email}
									disabled={isFormDisabled}
									error={errors.email}
									autoComplete="email"
									onBlur={() => markTouched("email")}
									onChange={(event) =>
										handleTextChange("email", event.target.value)
									}
									className={disabledFieldClassName}
								/>

								<FloatingPhoneInput
									id="visa-phone"
									label="Enter Phone Number"
									value={values.phoneNumber}
									disabled={isFormDisabled}
									error={errors.phoneNumber}
									autoComplete="tel"
									onBlur={() => markTouched("phoneNumber")}
									onChange={(value) => handleTextChange("phoneNumber", value)}
									className={disabledFieldClassName}
								/>
							</div>

							<div className="grid grid-cols-2 gap-2 md:gap-3.5">
								<FloatingInput
									id="visa-applicants"
									type="text"
									inputMode="numeric"
									label="Number of Applicants"
									value={values.numberOfApplicants}
									disabled={isFormDisabled}
									error={errors.numberOfApplicants}
									onBlur={() => markTouched("numberOfApplicants")}
									onChange={(event) =>
										handleTextChange("numberOfApplicants", event.target.value)
									}
									className={disabledFieldClassName}
								/>

								<FloatingInput
									id="visa-travel-date"
									type="date"
									label="Travel Date"
									value={values.travelDate}
									disabled={isFormDisabled}
									error={errors.travelDate}
									trailingIcon={<CalendarDays className="size-5" />}
									forceLabel
									onBlur={() => markTouched("travelDate")}
									onChange={(event) =>
										setFieldValue("travelDate", event.target.value)
									}
									className={`${disabledFieldClassName} pr-12`}
								/>
							</div>

							<div className="flex items-start gap-2 text-text">
								<Info className="mt-0.5 size-5 shrink-0 md:size-6" />
								<p className="text-xs leading-normal font-light md:text-base">
									Please note the number of applicants would determine the quote
									received.
								</p>
							</div>

							<FloatingTextarea
								id="visa-comment"
								label="Additional Comment"
								value={values.additionalComment}
								disabled={isFormDisabled}
								error={errors.additionalComment}
								maxLength={1000}
								onBlur={() => markTouched("additionalComment")}
								onChange={(event) =>
									handleTextChange("additionalComment", event.target.value)
								}
								className={`${disabledFieldClassName} !min-h-[96px] !resize-none md:!min-h-[104px]`}
							/>

							{submitError ? (
								<p
									className="text-center text-sm font-medium text-[#9e328a]"
									role="alert"
								>
									{submitError}
								</p>
							) : null}

							<div className="flex justify-center pt-2 md:pt-6">
								<button
									type="submit"
									disabled={isFormDisabled}
									className="flex h-[38px] w-36 items-center justify-center rounded-[50px] bg-[#9e328a] px-8 text-xs font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 disabled:cursor-not-allowed disabled:bg-[#8a2b78] disabled:opacity-80 md:h-14 md:w-[260px] md:text-base"
								>
									{isSubmitting ? "Submitting..." : "Proceed"}
								</button>
							</div>
						</div>
					</form>
				</div>
			</section>
		</>
	);
}
