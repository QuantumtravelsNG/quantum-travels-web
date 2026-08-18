import Image from "next/image";
import SectionBadge from "@/components/ui/SectionBadge";

const LEADERS = [
	{
		name: "Mr. Michael Otubu",
		position: "Managing Director",
		image: "/about/michealOtubu.png",
	},
	{
		name: "Mr. Charles Obioha",
		position: "Executive Director",
		image: "/about/charlesObioha.png",
	},
	{
		name: "Olamide Babayemi",
		position: "General Manager",
		image: "/about/olamideBabayemi.png",
	},
	{
		name: "Barakah Olaleye",
		position: "Group Head, Northern Branch Operations",
		image: "/about/barakahOlaleye.png",
	},
	{
		name: "Wealth Arumemi",
		position: "Head, Corporate Sales",
		image: "/about/wealthArumemi.png",
	},
	{
		name: "Israel Ademola",
		position: "Manager, Internal Audits & Control",
		image: "/about/israelAdemola.png",
	},
	{
		name: "Omotoyosi Otemoye",
		position: "Group Head, Quantum Holidays",
		image: "/about/omotoyosiOtemoye.png",
	},
	{
		name: "Oluwakanyinsola Savage",
		position: "Head, Human Capital Management",
		image: "/about/oluwakanyinsolaSavage.png",
	},
	{
		name: "Lanre Olanipekun",
		position: "Head, Corporate Operations",
		image: "/about/lanreOlanipekun.png",
	},
	{
		name: "Adeyinka Aro",
		position: "Group Head, Finance & Accounts",
		image: "/about/adeyinkaAro.jpg",
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
		<div className="bg-[#f9f9f9] rounded-[12px] p-4 flex flex-col group hover:shadow-xl shadow-black/5 transition-all duration-500">
			<div className="relative w-full h-[290px] rounded-[8px] overflow-hidden mb-3 shrink-0 ">
				<Image
					src={image}
					alt={name}
					fill
					className="object-cover object-top group-hover:scale-105 transition-all duration-500"
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
