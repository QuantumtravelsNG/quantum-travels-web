"use client";

import Image from "next/image";
import { FormEvent, useMemo, useRef, useState } from "react";
import { ChevronDown, Info, Paperclip } from "lucide-react";
import { submitAffiliateRegistration } from "@/app/actions";
import SuccessDialog from "@/components/SuccessDialog";
import { FloatingPhoneInput } from "@/components/ui/floating-fields";
import {
	currencyOptions,
	marketOptions,
	productOptions,
} from "@/lib/affiliate-options";
import {
	getCityOptions,
	getCountryOptions,
	getStateOptions,
	isValidCityName,
	isValidCountryCode,
	isValidStateCode,
	toLocationOptions,
	type LocationOption,
} from "@/lib/locations";
import { isValidPhoneNumberValue } from "@/lib/phone";
import { cn } from "@/lib/utils";

const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 1024 * 1024;
const marketSelectOptions = toLocationOptions(marketOptions);
const currencySelectOptions = toLocationOptions(currencyOptions);

type ProductOption = (typeof productOptions)[number];

type FormValues = {
	affiliateName: string;
	email: string;
	phoneNumber: string;
	cacFile: File | null;
	country: string;
	state: string;
	city: string;
	address: string;
	market: string;
	currency: string;
	products: ProductOption[];
	referralCode: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

const initialValues: FormValues = {
	affiliateName: "",
	email: "",
	phoneNumber: "",
	cacFile: null,
	country: "",
	state: "",
	city: "",
	address: "",
	market: "",
	currency: "",
	products: [],
	referralCode: "",
};

function isValidEmail(value: string) {
	const trimmed = value.trim();
	return (
		trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
	);
}

function validateField(name: FieldName, values: FormValues): string {
	switch (name) {
		case "affiliateName":
			return values.affiliateName.trim() ? "" : "Affiliate name is required.";
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
		case "cacFile":
			if (!values.cacFile) return "CAC document is required.";
			if (!ALLOWED_FILE_TYPES.includes(values.cacFile.type)) {
				return "Upload a PDF, JPG, or PNG file.";
			}
			if (values.cacFile.size > MAX_FILE_SIZE) {
				return "CAC document must be 1MB or smaller.";
			}
			return "";
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
		case "address":
			return values.address.trim() ? "" : "Address is required.";
		case "market":
			return values.market ? "" : "Market is required.";
		case "currency":
			return values.currency ? "" : "Currency is required.";
		case "products":
			return values.products.length > 0 ? "" : "Select at least one product.";
		case "referralCode":
			return "";
		default:
			return "";
	}
}

function getAllErrors(values: FormValues): FormErrors {
	return {
		affiliateName: validateField("affiliateName", values),
		email: validateField("email", values),
		phoneNumber: validateField("phoneNumber", values),
		cacFile: validateField("cacFile", values),
		country: validateField("country", values),
		state: validateField("state", values),
		city: validateField("city", values),
		address: validateField("address", values),
		market: validateField("market", values),
		currency: validateField("currency", values),
		products: validateField("products", values),
		referralCode: validateField("referralCode", values),
	};
}

interface FieldWrapperProps {
	label: string;
	showLabel: boolean;
	error?: string;
	children: React.ReactNode;
}

function FieldWrapper({
	label,
	showLabel,
	error,
	children,
}: FieldWrapperProps) {
	return (
		<div className="space-y-2">
			<div className="relative">
				{showLabel ? (
					<span className="pointer-events-none absolute left-4 top-3 z-10 text-xs leading-none font-medium text-black/60">
						{label}
					</span>
				) : null}
				{children}
			</div>
			{error ? (
				<p className="text-xs font-medium text-[#9e328a]" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

interface TextFieldProps {
	name: Exclude<
		FieldName,
		| "cacFile"
		| "country"
		| "state"
		| "city"
		| "market"
		| "currency"
		| "products"
	>;
	label: string;
	type?: "text" | "email" | "tel";
	inputMode?: "text" | "email" | "tel";
	autoComplete?: string;
	value: string;
	error?: string;
	touched?: boolean;
	focused?: boolean;
	onFocus: () => void;
	onBlur: () => void;
	onChange: (value: string) => void;
}

function TextField({
	label,
	type = "text",
	inputMode = "text",
	autoComplete,
	value,
	error,
	touched,
	focused,
	onFocus,
	onBlur,
	onChange,
}: TextFieldProps) {
	const showLabel = Boolean(focused || touched || value);

	return (
		<FieldWrapper label={label} showLabel={showLabel} error={error}>
			<input
				type={type}
				inputMode={inputMode}
				autoComplete={autoComplete}
				value={value}
				onFocus={onFocus}
				onBlur={onBlur}
				onChange={(event) => onChange(event.target.value)}
				placeholder={showLabel ? "" : label}
				className={cn(
					"h-12 w-full rounded-[5px] border border-black/20 bg-white px-4 text-sm text-text outline-none transition-shadow placeholder:text-black/80 md:h-16 md:text-lg",
					showLabel ? "pt-5 pb-2" : "",
					error
						? "border-[#9e328a]"
						: "focus-visible:ring-2 focus-visible:ring-primary/20",
				)}
			/>
		</FieldWrapper>
	);
}

interface SelectFieldProps {
	name: "country" | "state" | "city" | "market" | "currency";
	label: string;
	value: string;
	options: readonly LocationOption[];
	error?: string;
	touched?: boolean;
	focused?: boolean;
	disabled?: boolean;
	onFocus: () => void;
	onBlur: () => void;
	onChange: (value: string) => void;
}

function SelectField({
	label,
	value,
	options,
	error,
	touched,
	focused,
	disabled,
	onFocus,
	onBlur,
	onChange,
}: SelectFieldProps) {
	const showLabel = Boolean(focused || touched || value);

	return (
		<FieldWrapper label={label} showLabel={showLabel} error={error}>
			<div className="relative">
				<select
					value={value}
					disabled={disabled}
					onFocus={onFocus}
					onBlur={onBlur}
					onChange={(event) => onChange(event.target.value)}
					className={cn(
						"h-12 w-full appearance-none rounded-[5px] border border-black/20 bg-white px-4 pr-10 text-sm text-text outline-none transition-shadow md:h-16 md:text-lg",
						showLabel ? "pt-5 pb-2" : "",
						disabled ? "cursor-not-allowed text-black/40" : "",
						error
							? "border-[#9e328a]"
							: "focus-visible:ring-2 focus-visible:ring-primary/20",
					)}
				>
					<option value="">{showLabel ? "Select" : label}</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text md:size-5" />
			</div>
		</FieldWrapper>
	);
}

interface FileFieldProps {
	label: string;
	file: File | null;
	error?: string;
	touched?: boolean;
	focused?: boolean;
	onFocus: () => void;
	onBlur: () => void;
	onChange: (file: File | null) => void;
}

function FileField({
	label,
	file,
	error,
	touched,
	focused,
	onFocus,
	onBlur,
	onChange,
}: FileFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const showLabel = Boolean(focused || touched || file);

	return (
		<FieldWrapper label={label} showLabel={showLabel} error={error}>
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				onFocus={onFocus}
				onBlur={onBlur}
				className={cn(
					"flex h-12 w-full items-center justify-between rounded-[5px] border border-black/20 bg-white px-4 text-left text-sm text-text outline-none transition-shadow md:h-16 md:text-lg",
					showLabel ? "pt-5 pb-2" : "",
					error
						? "border-[#9e328a]"
						: "focus-visible:ring-2 focus-visible:ring-primary/20",
				)}
			>
				<span className={file ? "truncate" : "text-black/80"}>
					{file ? file.name : showLabel ? "" : label}
				</span>
				<Paperclip className="size-4 shrink-0 text-text md:size-5" />
			</button>
			<input
				ref={inputRef}
				type="file"
				accept=".pdf,.jpg,.jpeg,.png"
				className="sr-only"
				onChange={(event) => onChange(event.target.files?.[0] ?? null)}
			/>
		</FieldWrapper>
	);
}

function HelperText({ text, error }: { text: string; error?: string }) {
	return (
		<div className="flex items-start gap-2 text-text">
			<Info className="mt-0.5 size-4 shrink-0 md:size-5" />
			<p className="text-xs md:text-base">{error || text}</p>
		</div>
	);
}

export default function AffiliatePortalRegisterForm() {
	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<TouchedFields>({});
	const [focusedField, setFocusedField] = useState<FieldName | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [fileInputResetKey, setFileInputResetKey] = useState(0);

	const countries = useMemo(() => getCountryOptions(), []);
	const states = useMemo(() => {
		if (!values.country) return [];
		return getStateOptions(values.country);
	}, [values.country]);
	const cities = useMemo(() => {
		if (!values.country || !values.state) return [];
		return getCityOptions(values.country, values.state);
	}, [values.country, values.state]);

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

	const handleTextChange = (name: FieldName, value: string) => {
		setFieldValue(name as never, value as never);
	};

	const handleCountryChange = (value: string) => {
		if (submitError) setSubmitError("");

		const nextValues = {
			...values,
			country: value,
			state: "",
			city: "",
		};
		setValues(nextValues);
		if (touched.country) {
			setErrors((current) => ({
				...current,
				country: validateField("country", nextValues),
				state: touched.state
					? validateField("state", nextValues)
					: current.state,
				city: touched.city ? validateField("city", nextValues) : current.city,
			}));
		}
	};

	const handleStateChange = (value: string) => {
		if (submitError) setSubmitError("");

		const nextValues = {
			...values,
			state: value,
			city: "",
		};
		setValues(nextValues);
		if (touched.state || touched.city) {
			setErrors((current) => ({
				...current,
				state: touched.state
					? validateField("state", nextValues)
					: current.state,
				city: touched.city ? validateField("city", nextValues) : current.city,
			}));
		}
	};

	const handleProductToggle = (product: ProductOption) => {
		if (submitError) setSubmitError("");

		const nextProducts = values.products.includes(product)
			? values.products.filter((item) => item !== product)
			: [...values.products, product];
		const nextValues = { ...values, products: nextProducts };
		setValues(nextValues);
		if (touched.products) {
			setErrors((current) => ({
				...current,
				products: validateField("products", nextValues),
			}));
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitting) return;

		const nextErrors = getAllErrors(values);
		const hasErrors = Object.values(nextErrors).some(Boolean);

		setErrors(nextErrors);
		setTouched({
			affiliateName: true,
			email: true,
			phoneNumber: true,
			cacFile: true,
			country: true,
			state: true,
			city: true,
			address: true,
			market: true,
			currency: true,
			products: true,
			referralCode: true,
		});

		if (hasErrors) {
			return;
		}

		const payload = new FormData();
		payload.append("affiliateName", values.affiliateName.trim());
		payload.append("email", values.email.trim().toLowerCase());
		payload.append("phoneNumber", values.phoneNumber.trim());
		payload.append("country", values.country);
		payload.append("state", values.state);
		payload.append("city", values.city);
		payload.append("address", values.address.trim());
		payload.append("market", values.market);
		payload.append("currency", values.currency);
		values.products.forEach((product) => payload.append("products", product));
		if (values.referralCode.trim()) {
			payload.append("referralCode", values.referralCode.trim());
		}
		if (values.cacFile) {
			payload.append("cacFile", values.cacFile);
		}

		setSubmitError("");
		setIsSubmitting(true);
		const result = await submitAffiliateRegistration(payload);
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
		setFocusedField(null);
		setSubmitError("");
		setFileInputResetKey((current) => current + 1);
	};

	const desktopSectionHeading = "Register as an Affiliate";
	const desktopSectionCopy =
		"Complete your registration to get started as a Quantum Travels associate.";

	return (
		<>
			<SuccessDialog
				open={submitted}
				onClose={handleCloseDialog}
				title="Registration Successful"
				description="Your affiliate registration has been received successfully. We will review your details and get in touch shortly."
				buttonLabel="Close"
			/>

			<section
				className="bg-white pb-10 md:pb-16"
				aria-label="Affiliate registration form"
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
							<div className="relative z-10 p-10 text-white">
								<h1 className="text-4xl font-black leading-normal">
									{desktopSectionHeading}
								</h1>
								<p className="mt-4 text-[20px] leading-[1.4] font-medium text-balance">
									Complete your registration to get started as a Quantum Travels
									Affiliate.
								</p>
							</div>
						</div>

						<div className="p-5 md:p-10">
							<div className="mb-8 text-text md:hidden">
								<h1 className="text-2xl font-black leading-normal">
									{desktopSectionHeading}
								</h1>
								<p className="mt-2 text-base leading-normal font-medium">
									{desktopSectionCopy}
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								noValidate
								aria-busy={isSubmitting}
								className="space-y-10"
							>
								<section className="space-y-4">
									<div>
										<h2 className="text-sm font-medium text-text md:text-[20px]">
											Basic Details
										</h2>
										<div className="mt-2 h-px w-full bg-black/20">
											<div className="h-px w-[87px] bg-black md:w-[138px]" />
										</div>
									</div>

									<TextField
										name="affiliateName"
										label="Enter Affiliate Name"
										value={values.affiliateName}
										error={errors.affiliateName}
										touched={touched.affiliateName}
										focused={focusedField === "affiliateName"}
										onFocus={() => setFocusedField("affiliateName")}
										onBlur={() => {
											setFocusedField(null);
											markTouched("affiliateName");
										}}
										onChange={(value) =>
											handleTextChange("affiliateName", value)
										}
									/>

									<div className="grid gap-4 md:grid-cols-2">
										<TextField
											name="email"
											label="Enter Email Address"
											type="email"
											inputMode="email"
											autoComplete="email"
											value={values.email}
											error={errors.email}
											touched={touched.email}
											focused={focusedField === "email"}
											onFocus={() => setFocusedField("email")}
											onBlur={() => {
												setFocusedField(null);
												markTouched("email");
											}}
											onChange={(value) => handleTextChange("email", value)}
										/>
										<FloatingPhoneInput
											id="affiliate-phone"
											name="phoneNumber"
											label="Enter Phone Number"
											autoComplete="tel"
											value={values.phoneNumber}
											error={errors.phoneNumber}
											forceLabel={
												focusedField === "phoneNumber" || touched.phoneNumber
											}
											onFocus={() => setFocusedField("phoneNumber")}
											onBlur={() => {
												setFocusedField(null);
												markTouched("phoneNumber");
											}}
											onChange={(value) =>
												handleTextChange("phoneNumber", value)
											}
										/>
									</div>

									<HelperText
										text="Please enter a valid email address & phone number"
										error={errors.email || errors.phoneNumber}
									/>

									<FileField
										key={fileInputResetKey}
										label="Upload Certificate of Business (CAC)"
										file={values.cacFile}
										error={errors.cacFile}
										touched={touched.cacFile}
										focused={focusedField === "cacFile"}
										onFocus={() => setFocusedField("cacFile")}
										onBlur={() => {
											setFocusedField(null);
											markTouched("cacFile");
										}}
										onChange={(file) => {
											setFieldValue("cacFile", file);
											setTouched((current) => ({ ...current, cacFile: true }));
											setErrors((current) => ({
												...current,
												cacFile: validateField("cacFile", {
													...values,
													cacFile: file,
												}),
											}));
										}}
									/>

									<HelperText
										text="Please ensure all details on the certificate are visible. Upload a PDF, JPG, or PNG file. Max size: 1MB"
										error={errors.cacFile}
									/>
								</section>

								<section className="space-y-4">
									<div>
										<h2 className="text-sm font-medium text-text md:text-[20px]">
											Additional Details
										</h2>
										<div className="mt-2 h-px w-full bg-black/20">
											<div className="h-px w-[87px] bg-black md:w-[138px]" />
										</div>
									</div>

									<div className="grid gap-4 md:grid-cols-3">
										<SelectField
											name="country"
											label="Country"
											value={values.country}
											options={countries}
											error={errors.country}
											touched={touched.country}
											focused={focusedField === "country"}
											onFocus={() => setFocusedField("country")}
											onBlur={() => {
												setFocusedField(null);
												markTouched("country");
											}}
											onChange={handleCountryChange}
										/>
										<SelectField
											name="state"
											label="State"
											value={values.state}
											options={states}
											error={errors.state}
											touched={touched.state}
											focused={focusedField === "state"}
											disabled={!values.country}
											onFocus={() => setFocusedField("state")}
											onBlur={() => {
												setFocusedField(null);
												markTouched("state");
											}}
											onChange={handleStateChange}
										/>
										<SelectField
											name="city"
											label="City"
											value={values.city}
											options={cities}
											error={errors.city}
											touched={touched.city}
											focused={focusedField === "city"}
											disabled={!values.state}
											onFocus={() => setFocusedField("city")}
											onBlur={() => {
												setFocusedField(null);
												markTouched("city");
											}}
											onChange={(value) => setFieldValue("city", value)}
										/>
									</div>

									<TextField
										name="address"
										label="Address"
										value={values.address}
										error={errors.address}
										touched={touched.address}
										focused={focusedField === "address"}
										onFocus={() => setFocusedField("address")}
										onBlur={() => {
											setFocusedField(null);
											markTouched("address");
										}}
										onChange={(value) => handleTextChange("address", value)}
									/>

									<div className="grid gap-4 md:grid-cols-2">
										<SelectField
											name="market"
											label="Market"
											value={values.market}
											options={marketSelectOptions}
											error={errors.market}
											touched={touched.market}
											focused={focusedField === "market"}
											onFocus={() => setFocusedField("market")}
											onBlur={() => {
												setFocusedField(null);
												markTouched("market");
											}}
											onChange={(value) => setFieldValue("market", value)}
										/>
										<SelectField
											name="currency"
											label="Currencies"
											value={values.currency}
											options={currencySelectOptions}
											error={errors.currency}
											touched={touched.currency}
											focused={focusedField === "currency"}
											onFocus={() => setFocusedField("currency")}
											onBlur={() => {
												setFocusedField(null);
												markTouched("currency");
											}}
											onChange={(value) => setFieldValue("currency", value)}
										/>
									</div>

									<HelperText
										text="Please select the right market and currencies"
										error={errors.market || errors.currency}
									/>
								</section>

								<section className="space-y-4">
									<div>
										<h2 className="text-sm font-medium text-text md:text-[20px]">
											Select Products
										</h2>
										<div className="mt-2 h-px w-full bg-black/20">
											<div className="h-px w-[87px] bg-black md:w-[138px]" />
										</div>
									</div>

									<div className="grid gap-4 md:grid-cols-4">
										{productOptions.map((product) => {
											const checked = values.products.includes(product);
											return (
												<label
													key={product}
													className="flex cursor-pointer items-center gap-2 text-xs text-text md:text-base"
												>
													<input
														type="checkbox"
														checked={checked}
														onChange={() => handleProductToggle(product)}
														onBlur={() => markTouched("products")}
														className="size-6 rounded-[5px] border border-black/20 accent-primary md:size-8"
													/>
													<span>{product}</span>
												</label>
											);
										})}
									</div>

									{errors.products && touched.products ? (
										<p
											className="text-xs font-medium text-[#9e328a]"
											role="alert"
										>
											{errors.products}
										</p>
									) : null}

									<div className="max-w-[291px]">
										<TextField
											name="referralCode"
											label="Referral Code"
											value={values.referralCode}
											error={errors.referralCode}
											touched={touched.referralCode}
											focused={focusedField === "referralCode"}
											onFocus={() => setFocusedField("referralCode")}
											onBlur={() => {
												setFocusedField(null);
												setTouched((current) => ({
													...current,
													referralCode: true,
												}));
											}}
											onChange={(value) =>
												handleTextChange("referralCode", value)
											}
										/>
									</div>
								</section>

								<div className="flex justify-center">
									<button
										type="submit"
										disabled={isSubmitting}
										className="h-[38px] w-[124px] rounded-[50px] bg-primary text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-99 disabled:cursor-not-allowed disabled:opacity-80 md:h-14 md:w-[227px] md:text-base"
									>
										{isSubmitting ? "Submitting..." : "Submit"}
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
							</form>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
