import Image from "next/image";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 gap-4">
      <div className="relative w-[140px] h-[140px]">
        <Image
          src="/ourServices/emptystate.svg"
          alt="No selections available"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="font-medium text-[20px] text-text text-center leading-[1.4]">
        There are no available selections at the moment
        <br />
        please check back later.
      </h3>
    </div>
  );
}
