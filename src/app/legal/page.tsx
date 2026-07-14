import Link from "next/link";
import { ShieldCheck, Cookie, FileText } from "lucide-react";

export const metadata = {
	title: "Legal Information & Policies",
	description:
		"Review Quantum Travels legal information, policies, cookie guidelines, and terms of service.",
};

const policies = [
	{
		title: "Privacy Policy",
		href: "/legal/privacy-policy",
		description:
			"Understand how we collect, use, process, and safeguard your personal details and travel data in compliance with NDPR.",
		icon: ShieldCheck,
	},
	{
		title: "Cookie Policy",
		href: "/legal/cookie-policy",
		description:
			"Read about our usage of cookies, local identifiers, and sessionStorage parameters that optimize your booking experience.",
		icon: Cookie,
	},
	{
		title: "Terms & Conditions",
		href: "/legal/terms-conditions",
		description:
			"Review the payment terms, cancellation deadlines, supplier liabilities, and rules governing all travel bookings.",
		icon: FileText,
	},
];

export default function LegalPage() {
	return (
		<main className="min-h-screen w-full bg-[#F8F8F8] py-12 md:py-24">
			<div className="mx-auto max-w-[1440px] px-4 md:px-16 text-center">
				{/* Header Section */}
				<div className="max-w-3xl mx-auto mb-16">
					<h1 className="text-3xl md:text-5xl font-black text-text tracking-tight uppercase">
						Legal &amp; Policies
					</h1>
					<p className="text-base md:text-lg text-neutral-500 font-light mt-4 leading-relaxed">
						Review the operational terms, data compliance standards, and cookies
						guidelines governing your relationship with Quantum Travels Nigeria.
					</p>
					<div className="h-1.5 w-16 bg-[#9E328A] mt-6 mx-auto rounded-full" />
				</div>

				{/* Directory Grid */}
				<div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-[1130px] mx-auto text-left">
					{policies.map((policy) => {
						const Icon = policy.icon;
						return (
							<Link
								key={policy.title}
								href={policy.href}
								className="group block rounded-[10px] bg-white p-6 md:p-8  hover:border-[#9E328A]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_20px_rgba(158,50,138,0.08)] cursor-pointer"
							>
								<div className="inline-flex size-12 items-center justify-center rounded-full bg-[#9E328A]/10 text-[#9E328A] mb-6 group-hover:bg-[#9E328A] group-hover:text-white transition-all duration-300">
									<Icon className="size-6" />
								</div>
								<h2 className="text-xl font-bold text-text group-hover:text-[#9E328A] transition-colors mb-3">
									{policy.title}
								</h2>
								<p className="text-neutral-500 font-light text-sm leading-relaxed">
									{policy.description}
								</p>
								<div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#9E328A] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
									<span>Read Policy</span>
									<span>&rarr;</span>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</main>
	);
}
