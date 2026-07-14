"use client";

import React, { useState } from "react";
import PhoneInput, { type Country } from "react-phone-number-input";
import enLabels from "react-phone-number-input/locale/en.json";

import { cn } from "@/lib/utils";

export function FloatingInput({
	label,
	error,
	className,
	containerClassName,
	labelClassName,
	trailingIcon,
	forceLabel,
	placeholder,
	onFocus,
	onBlur,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	error?: string;
	containerClassName?: string;
	labelClassName?: string;
	trailingIcon?: React.ReactNode;
	forceLabel?: boolean;
}) {
	const [focused, setFocused] = useState(false);
	const hasValue =
		props.type === "number"
			? props.value !== "" && props.value != null
			: Boolean(props.value);
	const showLabel = Boolean(forceLabel || focused || hasValue);

	return (
		<div className={`space-y-2 w-full ${containerClassName || ""}`}>
			<div className="relative">
				{showLabel ? (
					<span
						className={`pointer-events-none absolute left-4 top-3 z-10 text-[12px] leading-none font-medium text-black/60 ${labelClassName || ""}`}
					>
						{label}
					</span>
				) : null}
				<input
					{...props}
					onFocus={(e) => {
						setFocused(true);
						onFocus?.(e);
					}}
					onBlur={(e) => {
						setFocused(false);
						onBlur?.(e);
					}}
					placeholder={showLabel ? placeholder : (placeholder ?? label)}
					className={`h-12 w-full rounded-[5px] border bg-white px-4 text-sm text-text outline-none transition-shadow placeholder:text-black/80 md:h-16 md:text-lg [appearance:textfield] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
						showLabel ? "pt-5 pb-2" : ""
					} ${
						error
							? "border-[#9E328A]"
							: "border-black/20 focus-visible:ring-2 focus-visible:ring-[#9E328A]/20"
					} ${className || ""}`}
				/>
				{trailingIcon ? (
					<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ">
						{trailingIcon}
					</div>
				) : null}
			</div>
			{error ? (
				<p className="text-[12px] font-medium text-[#9E328A]" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

export function FloatingPhoneInput({
	label,
	error,
	className,
	containerClassName,
	labelClassName,
	forceLabel,
	defaultCountry = "NG",
	value,
	onChange,
	onFocus,
	onBlur,
	disabled,
	autoComplete = "tel",
	...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
	label: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	containerClassName?: string;
	labelClassName?: string;
	forceLabel?: boolean;
	defaultCountry?: Country;
}) {
	const showLabel = forceLabel !== false;
	const errorId = error && props.id ? `${props.id}-error` : undefined;

	return (
		<div className={cn("space-y-2 w-full", containerClassName)}>
			<div
				className="relative"
				onFocusCapture={(event) => {
					onFocus?.(event as unknown as React.FocusEvent<HTMLInputElement>);
				}}
				onBlurCapture={(event) => {
					if (
						event.currentTarget.contains(event.relatedTarget as Node | null)
					) {
						return;
					}

					onBlur?.(event as unknown as React.FocusEvent<HTMLInputElement>);
				}}
			>
				{showLabel ? (
					<span
						className={cn(
							"pointer-events-none absolute left-[72px] top-3 z-10 text-[12px] leading-none font-medium text-black/60",
							labelClassName,
						)}
					>
						{label}
					</span>
				) : null}
				<PhoneInput
					{...props}
					labels={enLabels}
					defaultCountry={defaultCountry}
					value={value || undefined}
					onChange={(nextValue) => onChange(nextValue ?? "")}
					disabled={disabled}
					autoComplete={autoComplete}
					placeholder={showLabel ? "" : label}
					aria-invalid={error ? true : undefined}
					aria-describedby={errorId}
					countrySelectProps={{
						"aria-label": "Country calling code",
					}}
					numberInputProps={{
						className:
							"min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-black/80 disabled:cursor-not-allowed disabled:text-black/40 md:text-lg",
					}}
					className={cn(
						"qt-phone-input h-12 w-full rounded-[5px] border bg-white px-4 text-sm text-text outline-none transition-shadow md:h-16 md:text-lg",
						showLabel ? "pt-5 pb-2" : "",
						disabled ? "cursor-not-allowed opacity-40" : "",
						error
							? "border-[#9E328A]"
							: "border-black/20 focus-within:ring-2 focus-within:ring-[#9E328A]/20",
						className,
					)}
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

export function FloatingSelect({
	label,
	className,
	containerClassName,
	labelClassName,
	trailingIcon,
	hideDefaultChevron,
	onFocus,
	onBlur,
	children,
	error,
	...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
	label: string;
	error?: string;
	containerClassName?: string;
	labelClassName?: string;
	trailingIcon?: React.ReactNode;
	hideDefaultChevron?: boolean;
}) {
	const [focused, setFocused] = useState(false);
	const hasValue = props.value !== "" && props.value != null;
	const showLabel = Boolean(focused || hasValue);

	return (
		<div className={`space-y-2 w-full ${containerClassName || ""}`}>
			<div className="relative">
				{!showLabel ? (
					<span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-text md:text-lg">
						{label}
					</span>
				) : null}
				{showLabel ? (
					<span
						className={`pointer-events-none absolute left-4 top-3 z-10 text-[12px] leading-none font-medium text-black/60 ${labelClassName || ""}`}
					>
						{label}
					</span>
				) : null}
				<select
					{...props}
					onFocus={(e) => {
						setFocused(true);
						onFocus?.(e);
					}}
					onBlur={(e) => {
						setFocused(false);
						onBlur?.(e);
					}}
					className={`h-12 w-full appearance-none rounded-[5px] border bg-white px-4 pr-10 text-sm text-text outline-none transition-shadow md:h-16 md:text-lg ${
						showLabel ? "pt-5 pb-2" : ""
					} ${
						props.disabled ? "cursor-not-allowed opacity-40 text-black/40" : ""
					} ${!showLabel ? "text-transparent" : ""} ${
						error
							? "border-[#9E328A]"
							: "border-black/20 focus-visible:ring-2 focus-visible:ring-[#9E328A]/20"
					} ${className || ""}`}
				>
					{children}
				</select>
				{trailingIcon ? (
					<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text">
						{trailingIcon}
					</div>
				) : hideDefaultChevron ? null : (
					<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="black"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</div>
				)}
			</div>
			{error ? (
				<p className="text-[12px] font-medium text-[#9E328A]" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

export function FloatingTextarea({
	label,
	error,
	className,
	containerClassName,
	labelClassName,
	onFocus,
	onBlur,
	...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label: string;
	error?: string;
	containerClassName?: string;
	labelClassName?: string;
}) {
	const [focused, setFocused] = useState(false);
	const showLabel = Boolean(focused || props.value);

	return (
		<div className={`space-y-2 w-full ${containerClassName || ""}`}>
			<div className="relative">
				{showLabel ? (
					<span
						className={`pointer-events-none absolute left-4 top-3 z-10 text-[12px] leading-none font-medium text-black/60 ${labelClassName || ""}`}
					>
						{label}
					</span>
				) : null}
				<textarea
					{...props}
					onFocus={(e) => {
						setFocused(true);
						onFocus?.(e);
					}}
					onBlur={(e) => {
						setFocused(false);
						onBlur?.(e);
					}}
					placeholder={showLabel ? "" : label}
					className={`min-h-[150px] w-full rounded-[5px] border bg-white px-4 py-3 text-sm text-text outline-none transition-shadow placeholder:text-black/80 md:text-lg resize-y ${
						showLabel ? "pt-8" : "" // Push text down further in textarea to clear the floating label vertically
					} ${
						error
							? "border-[#9E328A]"
							: "border-black/20 focus-visible:ring-2 focus-visible:ring-[#9E328A]/20"
					} ${className || ""}`}
				/>
			</div>
			{error ? (
				<p className="text-[12px] font-medium text-[#9E328A]" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}
