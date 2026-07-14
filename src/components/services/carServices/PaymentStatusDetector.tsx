"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingSuccessDialog from "./BookingSuccessDialog";
import { verifyCarPaymentAction } from "@/app/actions";

const PAYMENT_VERIFICATION_FAILURE_COPY =
	"We could not verify your payment. If you completed payment, please contact Quantum Travels with your payment details so our team can confirm your booking.";

function clearPaymentReferenceFromUrl() {
	if (typeof window === "undefined") return;

	const url = new URL(window.location.href);
	url.searchParams.delete("reference");
	url.searchParams.delete("trxref");
	window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

export default function PaymentStatusDetector() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [showSuccess, setShowSuccess] = useState(false);
	const [showFailure, setShowFailure] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [verifiedReference, setVerifiedReference] = useState("");
	const [verificationMessage, setVerificationMessage] = useState("");
	const [failureMessage, setFailureMessage] = useState("");
	const reference = searchParams.get("reference") || searchParams.get("trxref");

	useEffect(() => {
		if (reference && verifiedReference !== reference && !isVerifying) {
			const verifyPayment = async () => {
				setIsVerifying(true);
				try {
					const res = await verifyCarPaymentAction(reference);
					if (res.ok) {
						setVerificationMessage(res.message);
						setShowSuccess(true);
					} else {
						setFailureMessage(PAYMENT_VERIFICATION_FAILURE_COPY);
						setShowFailure(true);
						console.error("Payment verification returned not ok:", res.message);
					}
					clearPaymentReferenceFromUrl();
				} catch (error) {
					setFailureMessage(PAYMENT_VERIFICATION_FAILURE_COPY);
					setShowFailure(true);
					console.error("Error verifying payment:", error);
				} finally {
					setIsVerifying(false);
					setVerifiedReference(reference);
				}
			};

			verifyPayment();
		}
	}, [reference, isVerifying, verifiedReference]);

	const handleClose = () => {
		setShowSuccess(false);
		setShowFailure(false);
		setVerificationMessage("");
		setFailureMessage("");
		clearPaymentReferenceFromUrl();
		router.replace("/services/car-services");
	};

	return (
		<>
			<BookingSuccessDialog
				open={showSuccess}
				onClose={handleClose}
				title="Payment Verified"
				description={
					verificationMessage ||
					"Your booking payment has been verified. You will receive additional details via email shortly."
				}
			/>

			<BookingSuccessDialog
				open={showFailure}
				onClose={handleClose}
				title="Payment Verification Needed"
				description={failureMessage || PAYMENT_VERIFICATION_FAILURE_COPY}
				variant="warning"
			/>

			{/* Loading overlay during background verification */}
			{isVerifying && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
					<div className="flex flex-col items-center rounded-[10px] bg-white p-8 shadow-2xl">
						<div className="w-10 h-10 border-4 border-[#9E328A] border-t-transparent rounded-full animate-spin"></div>
						<p className="mt-4 text-sm font-medium text-text">
							Verifying booking payment...
						</p>
					</div>
				</div>
			)}
		</>
	);
}
