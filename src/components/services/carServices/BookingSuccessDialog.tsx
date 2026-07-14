"use client";

interface BookingSuccessDialogProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	variant?: "success" | "warning";
}

export default function BookingSuccessDialog({
	open,
	onClose,
	title = "Booking Confirmed",
	description = "Your booking is confirmed. You will receive additional details via email shortly.",
	variant = "success",
}: BookingSuccessDialogProps) {
	if (!open) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
			onClick={onClose}
			aria-modal="true"
			role="dialog"
			aria-labelledby="booking-success-dialog-title"
		>
			<div
				className="relative flex w-full max-w-[440px] min-h-[340px] flex-col items-center bg-white rounded-[10px] pt-10 pb-10 px-6 shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				{/* Status Badge */}
				<div className="w-[64px] h-[64px] flex items-center justify-center shrink-0">
					{variant === "warning" ? (
						<svg
							width="60"
							height="60"
							viewBox="0 0 60 60"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-full"
						>
							<circle cx="30" cy="30" r="30" fill="#9E328A" />
							<path
								d="M30 15C31.795 15 33.2204 16.5084 33.1192 18.3505L32.2985 33.277C32.2348 34.4361 31.2758 35.3438 30.115 35.3438H29.885C28.7242 35.3438 27.7652 34.4361 27.7015 33.277L26.8808 18.3505C26.7796 16.5084 28.205 15 30 15Z"
								fill="#FFFCEE"
							/>
							<circle cx="30" cy="43" r="3.5" fill="#FFFCEE" />
						</svg>
					) : (
						<svg
							width="60"
							height="60"
							viewBox="0 0 60 60"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-full"
						>
							<g id="Group">
								<path
									id="Vector"
									d="M60 30C60 32.56 56.855 34.67 56.225 37.03C55.575 39.47 57.22 42.87 55.985 45.005C54.73 47.175 50.955 47.435 49.195 49.195C47.435 50.955 47.175 54.73 45.005 55.985C42.87 57.22 39.47 55.575 37.03 56.225C34.67 56.855 32.56 60 30 60C27.44 60 25.33 56.855 22.97 56.225C20.53 55.575 17.13 57.22 14.995 55.985C12.825 54.73 12.565 50.955 10.805 49.195C9.045 47.435 5.27 47.175 4.015 45.005C2.78 42.87 4.425 39.47 3.775 37.03C3.145 34.67 0 32.56 0 30C0 27.44 3.145 25.33 3.775 22.97C4.425 20.53 2.78 17.13 4.015 14.995C5.27 12.825 9.045 12.565 10.805 10.805C12.565 9.045 12.825 5.27 14.995 4.015C17.13 2.78 20.53 4.425 22.97 3.775C25.33 3.145 27.44 0 30 0C32.56 0 34.67 3.145 37.03 3.775C39.47 4.425 42.87 2.78 45.005 4.015C47.175 5.27 47.435 9.045 49.195 10.805C50.955 12.565 54.73 12.825 55.985 14.995C57.22 17.13 55.575 20.53 56.225 22.97C56.855 25.33 60 27.44 60 30Z"
									fill="#9E328A"
								/>
								<path
									id="Vector_2"
									d="M38.67 21.06L27.25 32.48L21.33 26.565C20.7126 25.9479 19.8754 25.6013 19.0025 25.6013C18.1296 25.6013 17.2924 25.9479 16.675 26.565C16.0579 27.1824 15.7113 28.0196 15.7113 28.8925C15.7113 29.7654 16.0579 30.6026 16.675 31.22L24.98 39.525C25.5809 40.1253 26.3956 40.4624 27.245 40.4624C28.0944 40.4624 28.909 40.1253 29.51 39.525L43.32 25.715C43.9371 25.0976 44.2837 24.2604 44.2837 23.3875C44.2837 22.5146 43.9371 21.6774 43.32 21.06C43.0148 20.7545 42.6523 20.5121 42.2534 20.3468C41.8545 20.1814 41.4268 20.0963 40.995 20.0963C40.5631 20.0963 40.1355 20.1814 39.7366 20.3468C39.3377 20.5121 38.9752 20.7545 38.67 21.06Z"
									fill="#FFFCEE"
								/>
							</g>
						</svg>
					)}
				</div>

				{/* Title */}
				<h2
					id="booking-success-dialog-title"
					className="text-[20px] font-bold text-text mt-8 text-center leading-none"
				>
					{title}
				</h2>

				{/* Description */}
				<p className="text-[16px] md:text-[18px] font-light text-text text-center mt-2 leading-[1.4] max-w-[320px]">
					{description}
				</p>

				{/* Action Button */}
				<button
					type="button"
					onClick={onClose}
					className="mt-auto flex h-[56px] w-[260px] items-center justify-center rounded-full bg-[#9e328a] text-[16px] font-bold text-white transition-all hover:bg-[#8a2b78] active:scale-99 shadow-[0px_4px_12px_rgba(158,50,138,0.25)] focus-visible:ring-2 focus-visible:ring-[#9e328a] focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer"
				>
					Continue
				</button>
			</div>
		</div>
	);
}
