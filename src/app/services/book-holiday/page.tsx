import { redirect } from "next/navigation";

export const metadata = {
  title: "Book Holiday",
  description: "Explore holiday packages and cruises from Quantum Travels.",
};

export default function Page() {
  redirect("/services/book-holiday/package-holiday");
}
