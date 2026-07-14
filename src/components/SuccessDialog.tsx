"use client";

interface SuccessDialogProps {
	open: boolean;
	onClose: () => void;
	title: string;
	description: string;
	buttonLabel?: string;
}

export default function SuccessDialog({
	open,
	onClose,
	title,
	description,
	buttonLabel = "Ok, I Understand",
}: SuccessDialogProps) {
	if (!open) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
			onClick={onClose}
			aria-modal="true"
			role="dialog"
			aria-labelledby="success-dialog-title"
		>
			<div
				className="flex w-full max-w-[440px] flex-col items-center rounded-xl bg-white px-8 py-10 text-center shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="mb-6 flex size-16 items-center justify-center">
					<svg
						viewBox="0 0 64 64"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="size-full"
						aria-hidden="true"
					>
						<path
							d="M32 4 L37.5 14.5 L49.5 12 L50 24.5 L60 31 L50 37.5 L49.5 50 L37.5 47.5 L32 58 L26.5 47.5 L14.5 50 L14 37.5 L4 31 L14 24.5 L14.5 12 L26.5 14.5 Z"
							fill="#9E328A"
						/>
						<path
							d="M22 32 L28.5 38.5 L42 25"
							stroke="white"
							strokeWidth="3.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>

				<h2
					id="success-dialog-title"
					className="mb-3 text-xl leading-normal font-bold text-text"
				>
					{title}
				</h2>

				<p className="mb-8 text-lg leading-normal font-light text-text">
					{description}
				</p>

				<button
					type="button"
					onClick={onClose}
					className="flex h-14 w-[260px] items-center justify-center rounded-full bg-[#9e328a] text-base font-bold text-white transition-opacity hover:opacity-90 active:scale-99 focus-visible:ring-2 focus-visible:ring-[#9e328a] focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					{buttonLabel}
				</button>
			</div>
		</div>
	);
}
