interface SectionBadgeProps {
  label: string;
}

export default function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-1.5">
        <span className="block h-[2px] w-14 bg-gradient-to-r from-transparent to-[#9e328a]" />
        <span className="block size-2 rounded-full bg-[#9e328a] shrink-0" />
      </div>

      <div className="border-2 border-black/10 rounded-[50px] px-8 py-1.5 shrink-0">
        <span className="text-sm md:text-base font-medium text-text whitespace-nowrap">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="block size-2 rounded-full bg-[#9e328a] shrink-0" />
        <span className="block h-[2px] w-14 bg-gradient-to-l from-transparent to-[#9e328a]" />
      </div>
    </div>
  );
}
