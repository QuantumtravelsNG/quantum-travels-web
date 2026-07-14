import Image from "next/image";
import SectionBadge from "@/components/ui/SectionBadge";

const LEADERS = [
	{
		name: "Mr. Michael Otubu",
		position: "Managing Director",
		image: "/about/michealOtubu.jpg",
	},
	{
		name: "Mr. Charles Obioha",
		position: "Executive Director",
		image: "/about/charlesObioha.jpg",
	},
	{
		name: "Adeyinka Aro",
		position: "Group Head, Finance & Accounts",
		image: "/about/adeyinkaAro.jpg",
	},
	{
		name: "Wealth Arumemi",
		position: "Head, Corporate Sales",
		image: "/about/wealthArumeni.jpg",
	},
	{
		name: "Quantum Managers",
		position: "",
		image: "/about/quantumManagers.jpg",
	},
];

interface LeaderCardProps {
	name: string;
	position: string;
	image: string;
	desktopSize?: "large" | "normal";
}

function LeaderCard({ name, position, image }: LeaderCardProps) {
	return (
		<div className="bg-[#f9f9f9] rounded-md p-4 flex flex-col">
			<div className="relative w-full h-[290px] rounded-lg overflow-hidden mb-3 shrink-0">
				<Image
					src={image}
					alt={name}
					fill
					className="object-cover object-top"
					sizes="(min-width: 768px) 322px, 50vw"
				/>
			</div>

			<p className="text-text font-bold text-xl leading-normal">{name}</p>

			{position && (
				<p className="text-text font-light text-base leading-normal">
					{position}
				</p>
			)}
		</div>
	);
}

function LeaderCardMobile({ name, position, image }: LeaderCardProps) {
	return (
		<div className="bg-[#f9f9f9] rounded-md p-2 flex flex-col">
			<div className="relative w-full h-50 rounded-md overflow-hidden mb-2">
				<Image
					src={image}
					alt={name}
					fill
					className="object-cover object-top"
					sizes="50vw"
				/>
			</div>

			<p className="text-text font-bold text-base leading-normal">{name}</p>

			{position && (
				<p className="text-text font-light text-xs leading-normal">
					{position}
				</p>
			)}
		</div>
	);
}

export default function Leadership() {
	return (
		<section className="mt-10 md:mt-16 px-4 md:px-16 max-w-[1440px] mx-auto">
			<div className="mb-8 md:mb-11">
				<SectionBadge label="Leadership" />
			</div>

			<div className="hidden md:grid grid-cols-4 gap-4">
				{LEADERS.map((leader) => (
					<LeaderCard key={leader.name} {...leader} />
				))}
			</div>

			<div className="grid md:hidden grid-cols-2 gap-3">
				{LEADERS.map((leader) => (
					<LeaderCardMobile key={leader.name} {...leader} />
				))}
			</div>
		</section>
	);
}
