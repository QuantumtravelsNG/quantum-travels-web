"use client";

import SuccessDialog from "@/components/SuccessDialog";
import {
	FloatingInput,
	FloatingPhoneInput,
	FloatingTextarea,
} from "@/components/ui/floating-fields";
import { submitContactSupport } from "@/app/actions";
import { faqs, type FaqAnswer as FaqAnswerContent } from "@/lib/faq";
import { isValidPhoneNumberValue } from "@/lib/phone";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

type FormValues = {
	fullName: string;
	email: string;
	phoneNumber: string;
	message: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

const initialValues: FormValues = {
	fullName: "",
	email: "",
	phoneNumber: "",
	message: "",
};

const branchContacts = [
	{
		label: "Head Office",
		address: "35 Corporation Drive, Dolphin Estate, Ikoyi",
		phones: ["0700 QUANTUM", "0700 782 6886"],
	},
	{
		label: "Lagos Island",
		address:
			"Block 12, Suites 22, Sura Shopping Complex, Simpson Street, Lagos Island",
		phones: ["+234 701 412 2465"],
	},
	{
		label: "Ikorodu",
		address: "3rd Floor, 62 Owolowo Street, Ikorodu, Lagos.",
		phones: ["+234 916 743 3181"],
	},
	{
		label: "Ikeja",
		address: "+234 803 438 0545",
		phones: [""],
	},
	{
		label: "Abuja",
		address:
			"Gwandal Center, Plot 1015, Fria Close, Off Adetokunbo Ademola Way, Wuse 2, Abuja",
		phones: ["+234 701 412 2465"],
	},
	{
		label: "Quantum Logistics",
		address: "+234 812 293 4216, logistics@quantumtravelsng.com",
		phones: [""],
	},
	{
		label: " Quantum Affiliates Desk",
		address: "b2b@quantumtravelsng.com",
		phones: [""],
	},
	{
		label: "Quantum Holidays",
		address: "Call/Whatsapp: +234 908 719 4783, Call: +234 816 742 8469",
		phones: [""],
	},
	{
		label: "Visa Desk",
		address: "Call/Whatsapp: +234 911 844 9843",
		phones: [""],
	},
] as const;

function isValidEmail(value: string) {
	const trimmed = value.trim();
	return (
		trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
	);
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
		case "message":
			if (!values.message.trim()) return "Message is required.";
			return values.message.trim().length <= 2000
				? ""
				: "Message must be 2000 characters or fewer.";
		default:
			return "";
	}
}

function getAllErrors(values: FormValues): FormErrors {
	return {
		fullName: validateField("fullName", values),
		email: validateField("email", values),
		phoneNumber: validateField("phoneNumber", values),
		message: validateField("message", values),
	};
}

function ContactBlock({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div>
			<p className="text-xs font-medium text-black/50 md:text-base">{label}</p>
			<div className="mt-2 text-sm leading-[1.45] font-medium text-text md:mt-3 md:text-[20px]">
				{children}
			</div>
		</div>
	);
}

function SectionHeading() {
	return (
		<div>
			<h2 className="text-sm font-medium text-text md:text-[20px]">
				Please fill the form below
			</h2>
			<div className="mt-2 h-px w-full bg-black/20">
				<div className="h-px w-[92px] bg-black md:w-[138px]" />
			</div>
		</div>
	);
}

function ContactForm() {
	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<TouchedFields>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");

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
		setValues((current) => {
			const nextValues = { ...current, [name]: value };
			if (submitError) setSubmitError("");

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
		setFieldValue(name, value);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (isSubmitting) return;

		const nextErrors = getAllErrors(values);
		const hasErrors = Object.values(nextErrors).some(Boolean);

		setErrors(nextErrors);
		setTouched({
			fullName: true,
			email: true,
			phoneNumber: true,
			message: true,
		});

		if (hasErrors) return;

		setIsSubmitting(true);
		const result = await submitContactSupport({
			fullName: values.fullName.trim(),
			email: values.email.trim().toLowerCase(),
			phoneNumber: values.phoneNumber.trim(),
			message: values.message.trim(),
		});
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
				title="Enquiry Sent"
				description="Your enquiry has been successfully submitted. Our team will review it and get back to you shortly."
				buttonLabel="Ok, I Understand"
			/>

			<form
				onSubmit={handleSubmit}
				noValidate
				aria-busy={isSubmitting}
				className="overflow-hidden rounded-[10px] bg-[#f9f9f9]"
			>
				<div className="relative h-[180px] overflow-hidden rounded-t-[10px] md:h-[280px]">
					<Image
						src="/contact/formBanner.jpg"
						alt=""
						fill
						sizes="(max-width: 1024px) 100vw, 680px"
						className="object-cover object-center"
						priority
					/>
					<div className="absolute inset-0 bg-[#9e328a]/40" />
					<div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
						<h2 className="text-[26px] leading-normal font-bold md:text-[32px]">
							Need Some Help ?
						</h2>
						<p className="mt-1 text-sm font-medium md:text-[20px]">
							Talk to a member of our dedicated staff
						</p>
					</div>
				</div>

				<div className="space-y-4 px-5 py-6 md:px-[37px] md:pt-8 md:pb-11">
					<SectionHeading />

					<FloatingInput
						id="contact-full-name"
						label="Enter Full Name"
						value={values.fullName}
						disabled={isSubmitting}
						error={errors.fullName}
						maxLength={100}
						autoComplete="name"
						onBlur={() => markTouched("fullName")}
						onChange={(event) =>
							handleTextChange("fullName", event.target.value)
						}
						className={disabledFieldClassName}
					/>

					<div className="grid gap-4 md:grid-cols-2">
						<FloatingInput
							id="contact-email"
							type="email"
							inputMode="email"
							label="Enter Email Address"
							value={values.email}
							disabled={isSubmitting}
							error={errors.email}
							autoComplete="email"
							onBlur={() => markTouched("email")}
							onChange={(event) =>
								handleTextChange("email", event.target.value)
							}
							className={disabledFieldClassName}
						/>

						<FloatingPhoneInput
							id="contact-phone"
							label="Enter Phone Number"
							value={values.phoneNumber}
							disabled={isSubmitting}
							error={errors.phoneNumber}
							autoComplete="tel"
							onBlur={() => markTouched("phoneNumber")}
							onChange={(value) => handleTextChange("phoneNumber", value)}
							className={disabledFieldClassName}
						/>
					</div>

					<FloatingTextarea
						id="contact-message"
						label="Write your message"
						value={values.message}
						disabled={isSubmitting}
						error={errors.message}
						maxLength={2000}
						onBlur={() => markTouched("message")}
						onChange={(event) =>
							handleTextChange("message", event.target.value)
						}
						className={`${disabledFieldClassName} !min-h-[150px] !resize-none md:!min-h-[190px]`}
					/>

					<div className="flex justify-center pt-2 md:pt-6">
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex h-[46px] w-[220px] items-center justify-center rounded-[50px] bg-[#9e328a] px-8 text-sm font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 disabled:cursor-not-allowed disabled:bg-[#8a2b78] disabled:opacity-80 md:h-14 md:w-[260px] md:text-base"
						>
							{isSubmitting ? "Sending..." : "Send Enquiry"}
						</button>
					</div>

					{submitError ? (
						<p
							className="text-center text-sm font-medium text-[#9e328a]"
							role="alert"
						>
							{submitError}
						</p>
					) : null}
				</div>
			</form>
		</>
	);
}

function FaqSection() {
	const [openIndex, setOpenIndex] = useState(0);

	return (
		<section className="relative mx-auto mt-12 max-w-[608px] md:mt-16" id="faq">
			<h2 className="text-center text-2xl leading-normal font-black text-text md:text-[32px]">
				Frequently Asked Questions
			</h2>

			<div className="mt-6 overflow-hidden rounded-[10px] border border-black/10 bg-white">
				{faqs.map((faq, index) => {
					const isOpen = openIndex === index;
					const answerId = `faq-answer-${index}`;

					return (
						<div
							key={faq.question}
							className={
								index === faqs.length - 1 ? "" : "border-b border-black/10"
							}
						>
							<button
								type="button"
								aria-expanded={isOpen}
								aria-controls={answerId}
								onClick={() => setOpenIndex(isOpen ? -1 : index)}
								className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left text-sm font-medium text-text transition-[background-color,transform] duration-150 ease-out hover:bg-black/[0.02] active:scale-[0.99] motion-reduce:transition-none md:px-6 md:text-base"
							>
								<span>{faq.question}</span>
								<span className="relative size-4 shrink-0 text-[#9e328a]">
									<Plus
										className={`absolute inset-0 size-4 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
									/>
									<Minus
										className={`absolute inset-0 size-4 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
									/>
								</span>
							</button>

							<div
								id={answerId}
								aria-hidden={!isOpen}
								className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
							>
								<div className="overflow-hidden">
									<FaqAnswer answer={faq.answer} />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<Image
				src="/contact/sticker.svg"
				alt=""
				width={240}
				height={240}
				className="pointer-events-none absolute -right-[220px] top-[105px] hidden rotate-[23deg] xl:block"
			/>
		</section>
	);
}

function FaqAnswer({ answer }: { answer: FaqAnswerContent }) {
	return (
		<div className="space-y-3 px-5 pb-4 text-xs leading-[1.5] font-light text-text md:px-6 md:text-base">
			{answer.map((block, blockIndex) => (
				<p className="whitespace-pre-line" key={blockIndex}>
					{block.map((part, partIndex) => {
						if (typeof part === "string") return part;
						if ("strong" in part) {
							return <strong key={partIndex}>{part.strong}</strong>;
						}
						return <em key={partIndex}>{part.em}</em>;
					})}
				</p>
			))}
		</div>
	);
}

export default function ContactUsContent() {
	return (
		<div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-10 md:px-10 md:pb-20 md:pt-[74px]">
			<div className="grid gap-10 lg:grid-cols-[minmax(0,617px)_minmax(0,680px)] lg:items-start lg:justify-between">
				<section>
					<h1 className="text-[36px] leading-normal font-bold text-text md:text-[44px]">
						Contact Us
					</h1>

					<div className="mt-6 border-l-4 border-[#9e328a] pl-4 md:mt-7 md:border-l-8 md:pl-8">
						<div className="space-y-5 md:space-y-6">
							<ContactBlock label="Opening Hours">
								8:00AM -5:00PM, Saturday & Sunday Close
							</ContactBlock>

							<ContactBlock label="Contact">
								<div className="flex flex-wrap gap-x-2 gap-y-2">
									<span>0700 QUANTUM</span>
									<span className="text-black/40">|</span>
									<span>0700 782 6886</span>
									<span className="text-black/40">|</span>
									<span>+234 908 719 4783</span>
								</div>
								<div className="mt-2 flex flex-wrap gap-x-2 gap-y-2">
									<a href="mailto:info@quantumtravelsng.com">
										info@quantumtravelsng.com
									</a>
									<span className="text-black/40">|</span>
									<a href="mailto:holidays@quantumtravelsng.com">
										holidays@quantumtravelsng.com
									</a>
								</div>
							</ContactBlock>

							{branchContacts.map((branch) => (
								<ContactBlock key={branch.label} label={branch.label}>
									<p>{branch.address}</p>
									<div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[13px] font-normal md:text-lg">
										{branch.phones.map((phone, index) => (
											<span key={phone} className="contents">
												{index > 0 ? (
													<span className="text-black/40">|</span>
												) : null}
												<span>{phone}</span>
											</span>
										))}
									</div>
								</ContactBlock>
							))}
						</div>
					</div>
				</section>

				<ContactForm />
			</div>

			<FaqSection />
		</div>
	);
}
