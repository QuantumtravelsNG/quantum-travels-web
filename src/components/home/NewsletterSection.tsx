"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import SuccessDialog from "@/components/SuccessDialog";
import { submitNewsletterSubscription } from "@/app/actions";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return EMAIL_REGEX.test(trimmed);
}

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = email.trim();

    if (!trimmed) {
      setError("Please enter your email address.");
      inputRef.current?.focus();
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError("Please enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    setIsSubmitting(true);
    const result = await submitNewsletterSubscription({ email: trimmed });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setEmail("");
  };

  return (
    <>
      <SuccessDialog
        open={submitted}
        onClose={handleClose}
        title="Welcome Aboard"
        description="Thanks for subscribing. We'll keep you updated with news, offers, and useful insights."
      />

      <section
        className="hidden md:flex w-full max-w-[1200px] mx-auto h-[360px] rounded-[20px] overflow-hidden my-10"
        aria-label="Newsletter sign-up"
      >
        <div className="relative w-1/2 shrink-0">
          <Image
            src="/home/newletterImage.png"
            alt="Person using a smartphone"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw"
            priority
          />
        </div>

        <div className="w-1/2 bg-[#9e328a] flex flex-col justify-center px-10 gap-5">
          <div>
            <h2 className="text-white text-[28px] font-bold leading-normal mb-2">
              Let&apos;s Keep You In The Loop !
            </h2>
            <p className="text-white text-lg font-medium leading-[1.8]">
              Sign up for our newsletter and you&apos;ll never miss an update.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting}
            className="flex flex-col gap-2"
          >
            <div className="relative flex items-center bg-white/20 border border-white rounded-xl h-16 pl-4 pr-2">
              <label htmlFor="newsletter-email-desktop" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email-desktop"
                ref={inputRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                value={email}
                disabled={isSubmitting}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter Your Email Address"
                className="qt-newsletter-input flex-1 bg-transparent text-white placeholder:text-white text-sm font-medium outline-none"
                aria-describedby={
                  error ? "newsletter-error-desktop" : undefined
                }
                aria-invalid={!!error}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 bg-white text-[#9e328a] text-sm font-bold rounded-full h-12 px-6 shrink-0 transition-opacity hover:opacity-90 active:scale-99 disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#9e328a]"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {error && (
              <p
                id="newsletter-error-desktop"
                role="alert"
                className="text-white/90 text-xs font-medium pl-1"
              >
                {error}
              </p>
            )}
          </form>
        </div>
      </section>

      <section
        className="flex md:hidden flex-col rounded-[8px] overflow-hidden my-8 mx-4"
        aria-label="Newsletter sign-up"
      >
        <div className="relative w-full h-[220px]">
          <Image
            src="/home/newletterImage.png"
            alt="Person using a smartphone"
            fill
            className="object-cover"
            sizes="370px"
            priority
          />
        </div>

        <div className="bg-[#9e328a] flex flex-col justify-center px-5 py-6 gap-4">
          <div>
            <h2 className="text-white text-lg font-bold leading-normal mb-1">
              Let&apos;s Keep You In The Loop !
            </h2>
            <p className="text-white text-xs font-medium leading-[1.8]">
              Sign up for our newsletter and you&apos;ll never miss an update.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting}
            className="flex flex-col gap-2"
          >
            <div className="relative flex items-center bg-white/20 border border-white rounded-xl h-14 px-3">
              <label htmlFor="newsletter-email-mobile" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email-mobile"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                value={email}
                disabled={isSubmitting}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter Your Email Address"
                className="qt-newsletter-input flex-1 min-w-0 bg-transparent text-white placeholder:text-white text-xs font-medium outline-none"
                aria-describedby={error ? "newsletter-error-mobile" : undefined}
                aria-invalid={!!error}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-2 bg-white text-[#9e328a] text-xs font-bold rounded-full h-10 px-4 flex-shrink-0 transition-opacity hover:opacity-90 active:scale-99 disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isSubmitting ? "Sending..." : "Subscribe"}
              </button>
            </div>

            {error && (
              <p
                id="newsletter-error-mobile"
                role="alert"
                className="text-white/90 text-xs font-medium pl-1"
              >
                {error}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
