"use client";

interface PoliciesDialogProps {
	open: boolean;
	onClose: () => void;
}

export default function PoliciesDialog({ open, onClose }: PoliciesDialogProps) {
	if (!open) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
			onClick={onClose}
			aria-modal="true"
			role="dialog"
			aria-labelledby="policies-dialog-title"
		>
			<div
				className="flex w-full max-w-[440px] flex-col rounded-[10px] bg-white p-8 shadow-2xl md:p-10"
				onClick={(event) => event.stopPropagation()}
			>
				<h2
					id="policies-dialog-title"
					className="text-[20px] font-bold text-text mb-6"
				>
					Policies
				</h2>

				<ul className="mb-8 space-y-4 text-[18px] font-light text-text list-disc pl-6 leading-relaxed">
					<li>
						<span>Fee is non-refundable after pick up time</span>
					</li>
					<li>
						<span>
							100% cancellation fee applies to cancellations less than 48 hours
							before pick up time
						</span>
					</li>
					<li>
						<span>
							Free cancellation and changes 48 hours before pick up time
						</span>
					</li>
				</ul>

				<div className="flex justify-center">
					<button
						type="button"
						onClick={onClose}
						className="flex h-[56px] w-[260px] items-center justify-center rounded-full bg-[#9e328a] text-[16px] font-bold text-white transition-opacity hover:opacity-90 active:scale-99 focus-visible:ring-2 focus-visible:ring-[#9e328a] focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						Ok, I Understand
					</button>
				</div>
			</div>
		</div>
	);
}
