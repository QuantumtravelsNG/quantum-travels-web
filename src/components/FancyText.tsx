type FancyTextProps = {
	backdrop: string;
	foreground: string;
};
export default function FancyText({ backdrop, foreground }: FancyTextProps) {
	return (
		<div>
			<div className=" text-center px-5 mx-auto">
				<div className="pointer-events-none  uppercase">
					<p className="leading-none text-3xl md:text-6xl lg:text-8xl bg-linear-to-b from-[#d1d3d460] to-[#66666600] bg-clip-text text-transparent font-black">
						{backdrop}
					</p>
				</div>
				<p className="leading-none text-lg md:text-[2rem] font-bold uppercase text-primary -mt-2 md:-mt-8">
					{foreground}
				</p>
			</div>
		</div>
	);
}
