import GalleryContent from "@/components/gallery/GalleryContent";
import { getGalleryFolders } from "@/lib/quantum-api";

export const metadata = {
  title: "Gallery",
  description: "View travel moments and experiences from Quantum Travels.",
};

export default async function GalleryPage() {
  const folders = await getGalleryFolders();

  return (
    <main className="pt-15 md:pt-22">
      <GalleryContent folders={folders} />
    </main>
  );
}
