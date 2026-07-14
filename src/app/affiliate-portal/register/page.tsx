import AffiliatePortalRegisterForm from "@/components/affiliate/AffiliatePortalRegisterForm";

export const metadata = {
  title: "Affiliate Registration",
  description:
    "Register as a Quantum Travels affiliate partner and start offering seamless travel solutions to your clients.",
};

export default function AffiliatePortalRegisterPage() {
  return (
    <main className="pt-15 md:pt-22">
      <AffiliatePortalRegisterForm />
    </main>
  );
}
