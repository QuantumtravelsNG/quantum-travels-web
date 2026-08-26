"use client";

import { useState } from "react";
import { submitCorporateTravelEnquiry } from "@/app/actions";
import SuccessDialog from "@/components/SuccessDialog";
import {
	FloatingInput,
	FloatingPhoneInput,
	FloatingSelect,
	FloatingTextarea,
} from "@/components/ui/floating-fields";
import { isValidPhoneNumberValue } from "@/lib/phone";

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const corporateTravelCategories = [
	"Request a Proposal",
	"Consultation",
	"Partnership",
	"Other",
] as const;

type CorporateTravelCategory = (typeof corporateTravelCategories)[number];

type FormState = {
	fullName: string;
	email: string;
	phoneNumber: string;
	category: string;
	message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
	fullName: "",
	email: "",
	phoneNumber: "",
	category: "",
	message: "",
};

function isValidEmail(value: string) {
	const trimmed = value.trim();
	return (
		trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
	);
}

function validate(form: FormState): FormErrors {
	const errors: FormErrors = {};

	if (!form.fullName.trim()) errors.fullName = "Full name is required.";
	else if (form.fullName.trim().length > 120)
		errors.fullName = "Full name must be 120 characters or fewer.";

	if (!form.email.trim()) errors.email = "Email address is required.";
	else if (!isValidEmail(form.email))
		errors.email = "Please enter a valid email address.";

	if (!form.phoneNumber.trim())
		errors.phoneNumber = "Phone number is required.";
	else if (!isValidPhoneNumberValue(form.phoneNumber))
		errors.phoneNumber = "Please enter a valid phone number.";

	if (
		!corporateTravelCategories.includes(
			form.category as CorporateTravelCategory,
		)
	) {
		errors.category = "Select a valid category.";
	}

	if (!form.message.trim()) errors.message = "Message is required.";
	else if (form.message.trim().length > 2000)
		errors.message = "Message must be 2000 characters or fewer.";

	return errors;
}

export default function CorporateTravelForm() {
	const [form, setForm] = useState<FormState>(initialForm);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");

	const handleChange = (field: keyof FormState, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
		if (submitError) setSubmitError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;

		const nextErrors = validate(form);
		setErrors(nextErrors);
		if (Object.values(nextErrors).some(Boolean)) return;

		setIsSubmitting(true);
		const result = await submitCorporateTravelEnquiry({
			fullName: form.fullName.trim(),
			email: form.email.trim().toLowerCase(),
			phoneNumber: form.phoneNumber.trim(),
			category: form.category as CorporateTravelCategory,
			message: form.message.trim(),
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
		setForm(initialForm);
		setErrors({});
		setSubmitError("");
	};

	return (
		<>
			<SuccessDialog
				open={submitted}
				onClose={handleCloseDialog}
				title="Enquiry Sent"
				description="Your corporate travel enquiry has been submitted successfully. Our team will review it and get back to you shortly."
			/>

			<div id="corporate-contact" className="w-full bg-[#f8f8f8] md:bg-white">
				<div className="flex min-h-[700px] flex-col md:flex-row">
					<div className="flex w-full flex-col items-end bg-[url('/assets/quantumBg.png')] bg-cover bg-center text-white md:w-1/2">
						<div className="w-full max-w-[720px] px-4 py-8 md:px-20 md:py-16">
							<h2 className="mb-6 w-full text-[32px] font-bold md:text-[44px]">
								Access More
							</h2>
							<p className="mb-8 w-full max-w-[480px] text-[15px] leading-[1.8] font-light md:text-[18px]">
								Spearheading all our objectives is our drive to provide cost
								savings. In addition to our general travel management services,
								we provide the following services to all corporate accounts:
							</p>

							<ul className="mb-16 w-full list-inside space-y-4">
								{[
									"Account Management",
									"Report Management",
									"Policy Compliance",
									"Mobile Itinerary Management Solutions",
									"Travel Risk Management Solutions",
								].map((item) => (
									<li
										key={item}
										className="flex items-start text-[14px] font-light md:text-[16px]"
									>
										<span className="mt-[8px] mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white" />
										{item}
									</li>
								))}
							</ul>

							<div className="mt-auto w-full border-t border-white/20 pt-8">
								<p className="mb-3 text-[12px] font-medium md:text-[14px]">
									Contact
								</p>
								<p className="mb-4 text-[16px] font-medium tracking-wide md:text-[20px]">
									+234 810 926 4805 | 0700 782 6886
								</p>
								<a
									href="mailto:info@quantumtravelsng.com"
									className="text-[14px] font-medium text-white transition-all hover:underline md:text-[18px]"
								>
									info@quantumtravelsng.com
								</a>
							</div>
						</div>
					</div>

					<div
						id="corporate-contact-form"
						className="w-full scroll-mt-[60px] bg-[#f9f9f9] md:w-1/2 md:scroll-mt-[88px] md:bg-[#FAFAFA]"
					>
						<div className="max-w-[720px] px-4 py-8 md:px-20 md:py-16">
							<h2 className="mb-6 text-[28px] font-bold text-text md:text-[36px]">
								Get In Contact With Us
							</h2>

							<div className="mb-8">
								<p className="mb-2 hidden text-[15px] font-semibold text-text md:block">
									Please fill the form below
								</p>
								<p className="mb-2 block text-[15px] font-semibold text-text md:hidden">
									Details
								</p>
								<div className="flex">
									<div className="h-0.5 w-20 bg-[#9E328A]" />
									<div className="h-0.5 flex-1 bg-black/10" />
								</div>
							</div>

							<form
								onSubmit={handleSubmit}
								noValidate
								aria-busy={isSubmitting}
								className="flex flex-col gap-5"
							>
								<FloatingInput
									id="corp-name"
									type="text"
									label="Enter Full Name"
									value={form.fullName}
									error={errors.fullName}
									disabled={isSubmitting}
									maxLength={120}
									onChange={(e) => handleChange("fullName", e.target.value)}
								/>

								<div className="flex flex-col gap-5 md:flex-row">
									<FloatingInput
										id="corp-email"
										type="email"
										inputMode="email"
										label="Enter Email Address"
										value={form.email}
										error={errors.email}
										disabled={isSubmitting}
										onChange={(e) => handleChange("email", e.target.value)}
									/>
									<FloatingPhoneInput
										id="corp-phone"
										label="Enter Phone Number"
										value={form.phoneNumber}
										error={errors.phoneNumber}
										disabled={isSubmitting}
										onChange={(value) => handleChange("phoneNumber", value)}
									/>
								</div>

								<FloatingSelect
									id="corp-category"
									label="Category"
									value={form.category}
									error={errors.category}
									disabled={isSubmitting}
									onChange={(e) => handleChange("category", e.target.value)}
								>
									<option value="">Category</option>
									{corporateTravelCategories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</FloatingSelect>

								<FloatingTextarea
									id="corp-message"
									label="Write your message"
									value={form.message}
									error={errors.message}
									disabled={isSubmitting}
									maxLength={2000}
									onChange={(e) => handleChange("message", e.target.value)}
								/>

								{submitError ? (
									<p
										className="text-sm font-medium text-[#9E328A]"
										role="alert"
									>
										{submitError}
									</p>
								) : null}

								<div className="mt-4 flex justify-center">
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full min-w-[200px] rounded-[50px] bg-[#9E328A] px-10 py-4 text-[16px] font-bold text-white transition-colors hover:bg-[#8B2C7A] active:scale-99 disabled:cursor-not-allowed disabled:opacity-80 md:w-auto"
									>
										{isSubmitting ? "Sending..." : "Send Enquiry"}
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
