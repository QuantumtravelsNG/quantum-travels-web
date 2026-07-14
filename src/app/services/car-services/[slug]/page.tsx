import type { Metadata } from "next";

function formatSlugTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = formatSlugTitle(slug);

  return {
    title,
    description: `Learn more about ${title.toLowerCase()} car services from Quantum Travels.`,
  };
}

export default async function OurServicesCarServicesSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">/services/car-services/[slug]</h1>
      <p>Slug: {resolvedParams.slug}</p>
    </main>
  );
}
