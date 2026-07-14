import PageCTA from "@/components/PageCTA";

export default function BookHolidayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-15 md:pt-22">
      {children}
      <div className="mx-4 md:mx-16 my-10 md:my-16">
        <PageCTA
          title={"Want to know more about our offers & packages?"}
          subtitle="Ask us anything."
          btnVariant="light"
          btnLabel="Make an Enquiry"
          btnHref="/contact-us"
          image="/ourServices/book-holiday/bookholidayCTA.jpg"
          className="from-[#9E328A] to-[#D4A2C6]"
        />
      </div>
    </div>
  );
}
