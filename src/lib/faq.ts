export type FaqAnswerPart = string | { strong: string } | { em: string };

export type FaqAnswer = readonly (readonly FaqAnswerPart[])[];

export const faqs = [
  {
    question: "Do you handle corporate travel arrangements?",
    answer: [
      [
        { strong: "Yes." },
        " Quantum Travels provides end-to-end corporate travel management for businesses of all sizes. Our services include flight bookings, hotel reservations, airport transfers, visa support, travel insurance, and itinerary planning. Whether it's an executive trip, conference, or team travel, we ensure a seamless and professional experience from start to finish.",
      ],
      [
        "Corporate Travel Desk:\n📞 ",
        { em: "08109264805" },
        "\n📧 info@quantumtravelsng.com",
      ],
    ],
  },
  {
    question: "Can you help plan vacation or holiday trips?",
    answer: [
      [
        "Absolutely! Our Quantum Holidays team specializes in creating unforgettable travel experiences. Whether you are planning a romantic getaway, family vacation, honeymoon, group tour, or luxury escape, we'll handle everything, from flights and accommodation to tours and travel support, so you can travel with ease.",
      ],
      [
        "Quantum Holidays Desk:\n📱 WhatsApp: 0908 719 4783\n📞 Call: 0816 742 8469\n📧 Email: holidays@quantumtravelsng.com",
      ],
    ],
  },
  {
    question: "Do you offer guided tours?",
    answer: [
      [
        "Yes. We offer carefully curated guided tours to exciting local and international destinations. Our tour packages include thoughtfully planned itineraries, comfortable accommodations, exciting excursions, and dedicated support to ensure a memorable travel experience from beginning to end.",
      ],
      [
        "Quantum Holidays Desk:\n📱 WhatsApp: 0908 719 4783\n📞 Call: 0816 742 8469\n📧 Email: holidays@quantumtravelsng.com",
      ],
    ],
  },
  {
    question: "Do you provide airport pickup and drop-off services?",
    answer: [
      [
        "Yes. Through Quantum Logistics, we provide reliable airport transfers, executive chauffeur services, interstate transportation, and premium ground mobility solutions. Our professional drivers and well-maintained vehicles ensure every journey is safe, comfortable, and on schedule.",
      ],
      [
        "Quantum Logistics Desk:\n📞 08122934216\n📧 logistics@quantumtravelsng.com",
      ],
    ],
  },
  {
    question: "Do you assist with visa applications?",
    answer: [
      [
        "Yes. Our Visa Services team provides professional guidance throughout the visa application process. We assist with document reviews, application preparation, appointment scheduling (where applicable), and expert advice to help make your application process as smooth as possible. Please note that visa approval is solely at the discretion of the respective embassy or consulate.",
      ],
      ["Visa Services Desk:\n📞 09118449843\n📧 visas@quantumtravelsng.com"],
    ],
  },
  {
    question: "How do I make a booking?",
    answer: [
      [
        "Booking with Quantum Travels is quick and easy. Simply contact the department that matches your travel needs by phone, WhatsApp, or email. Our travel consultants will guide you through the process, recommend the best options, and confirm your booking promptly.",
      ],
      [
        "Corporate Travel\n📞 Call/WhatsApp: 08109264805\n📧 info@quantumtravelsng.com",
      ],
      [
        "Quantum Holidays\n📱 WhatsApp: 0908 719 4783\n📞 Call: 0816 742 8469\n📧 holidays@quantumtravelsng.com",
      ],
      [
        "Visa Services\n📞 Call/Whatsapp: 09118449843\n📧 visas@quantumtravelsng.com",
      ],
      [
        "Quantum Logistics\n📞 Call/WhatsApp: 08122934216*\n📧 logistics@quantumtravelsng.com",
      ],
    ],
  },
  {
    question: "What payment methods do you accept?",
    answer: [
      [
        "We accept secure payments via bank transfer, debit and credit cards, and other approved payment channels. Available payment options may vary depending on the service you are booking. Once your reservation is confirmed, our team will provide the appropriate payment details and guide you through the payment process securely.",
      ],
    ],
  },
  {
    question: "Can you manage travel for large groups or corporate events?",
    answer: [
      [
        { em: "Yes." },
        " We specialize in managing travel for corporate teams, conferences, meetings, incentive trips, destination events, religious pilgrimages, school excursions, and leisure groups. Our experienced team coordinates flights, accommodation, ground transportation, visas (where required), and logistics to deliver a seamless group travel experience.",
      ],
      ["Corporate Travel:\n📞 08109264805\n📧 info@quantumtravelsng.com"],
      [
        "Meetings & Events:\n📞 Call/Whatsapp: 08109264805\n📧 mice@quantumtravelsng.com",
      ],
    ],
  },
  {
    question: "What services does Quantum Logistics offer?",
    answer: [
      [
        "Quantum Logistics provides premium transportation services, including airport pick-ups and drop-offs, interstate travel, executive chauffeur services, corporate transportation, and event transfers. We are committed to delivering safe, comfortable, and reliable journeys with professional drivers.",
      ],
    ],
  },
  {
    question: "How do I book a ride with Quantum Logistics?",
    answer: [
      [
        "Booking with Quantum Logistics is quick and easy. Simply contact our team or submit your request through our website with your travel details. Once your booking is confirmed, you will receive all the necessary trip information for a seamless travel experience.",
      ],
    ],
  },
] satisfies readonly { question: string; answer: FaqAnswer }[];
