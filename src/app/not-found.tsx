import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "404",
  description: "Destination not found.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-16 text-center md:px-10 md:py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <Image
          src="/assets/logomark.svg"
          alt=""
          width={72}
          height={72}
          className="mb-8 h-16 w-16 md:h-[72px] md:w-[72px]"
          priority
        />
        <h1 className="text-8xl font-semibold leading-none text-primary md:text-9xl">
          404
        </h1>
        <p className="mt-6 text-3xl font-bold leading-tight text-text md:text-5xl">
          destination not found :(
        </p>
        <p className="mt-4 max-w-lg text-base leading-7 text-black/70 md:text-xl">
          Let&apos;s put you back on the right path.
        </p>
        <Link
          href="/"
          className="inline-flex h-[38px] items-center justify-center rounded-[9999px] bg-[#9E328A] px-8 text-xs font-bold text-white transition-colors hover:bg-[#8a2b78] active:scale-99 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/50 md:h-[56px] md:px-8 md:text-base mt-4"
        >
          Go back home
        </Link>
      </section>
    </main>
  );
}
