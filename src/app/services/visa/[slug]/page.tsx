import { getVisaBySlug, getVisaPackages } from "@/lib/quantum-api";
import VisaApplicationDetails from "@/components/services/visa/VisaApplicationDetails";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateStaticParams() {
  const visas = await getVisaPackages();

  return visas
    .filter((visa) => visa.slug)
    .map((visa) => ({
      slug: visa.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const visa = await getVisaBySlug(slug);

  if (!visa) return {};

  return {
    title: visa.name,
    description: visa.description,
  };
}

export default async function OurServicesVisaSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const visa = await getVisaBySlug(slug);

  if (!visa) notFound();

  return (
    <main className="w-full pt-20 md:pt-28">
      <VisaApplicationDetails visa={visa} />
    </main>
  );
}
