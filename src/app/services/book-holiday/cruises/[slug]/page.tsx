import { notFound } from "next/navigation";
import TourDetailView from "@/components/TourDetailView";
import { getTourPackageBySlug, getTourPackages } from "@/lib/quantum-api";

export const revalidate = 300;

export async function generateStaticParams() {
  const tours = await getTourPackages("cruise");

  return tours
    .filter((tour) => tour.slug)
    .map((tour) => ({
      slug: tour.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourPackageBySlug("cruise", slug);

  if (!tour) return {};

  return {
    title: tour.title,
    description: tour.about.slice(0, 160),
  };
}

export default async function CruiseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourPackageBySlug("cruise", slug);

  if (!tour) notFound();

  return <TourDetailView tour={tour} />;
}
