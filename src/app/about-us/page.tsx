import AboutHero from "@/components/about/AboutHero";
import OurHistory from "@/components/about/OurHistory";
import MissionVision from "@/components/about/MissionVision";
import Leadership from "@/components/about/Leadership";

export const metadata = {
  title: "About Us",
  description:
    "Learn more about the history and business of Quantum Travels Nigeria — Nigeria's number one corporate travel consolidator.",
};

export default function AboutUsPage() {
  return (
    <main className="pt-15 md:pt-22 pb-10 md:pb-16">
      <AboutHero />
      <OurHistory />
      <MissionVision />
      <Leadership />
    </main>
  );
}
