export interface Airport {
  name: string;
  iata?: string;
  terminals: readonly string[];
  keyword: readonly string[];
}

export const airports: readonly Airport[] = [
  {
    name: "Nnamdi Azikiwe International Airport (ABV)",
    iata: "ABV",
    terminals: ["International Terminal", "Domestic Terminal"],
    keyword: ["Abuja", "FCT", "Federal Capital Territory", "Abuja Airport"],
  },
  {
    name: "Victor Attah International Airport (QUO)",
    iata: "QUO",
    terminals: ["Main Terminal"],
    keyword: ["Uyo", "Akwa Ibom", "Akwa Ibom International Airport"],
  },
  {
    name: "Chinua Achebe International Airport (ANA)",
    iata: "ANA",
    terminals: ["Main Terminal"],
    keyword: [
      "Anambra",
      "Awka",
      "Onitsha",
      "Umueri",
      "Anambra International Cargo and Passenger Airport",
    ],
  },
  {
    name: "Margaret Ekpo International Airport (CBQ)",
    iata: "CBQ",
    terminals: ["Main Terminal"],
    keyword: ["Calabar", "Cross River", "Calabar Airport"],
  },
  {
    name: "Ebonyi State International Airport",
    terminals: ["Main Terminal"],
    keyword: [
      "Abakaliki",
      "Ebonyi",
      "Onueke",
      "Wilberforce Chuba Okadigbo International Airport",
    ],
  },
  {
    name: "Akanu Ibiam International Airport (ENU)",
    iata: "ENU",
    terminals: ["Main Terminal"],
    keyword: ["Enugu", "Enugu State", "Enugu Airport", "Nsukka"],
  },
  {
    name: "General Tunde Idiagbon International Airport (ILR)",
    iata: "ILR",
    terminals: ["Main Terminal"],
    keyword: [
      "Ilorin",
      "Kwara",
      "Ilorin Airport",
      "Ilorin International Airport",
    ],
  },
  {
    name: "Kaduna International Airport (KAD)",
    iata: "KAD",
    terminals: ["Main Terminal"],
    keyword: ["Kaduna", "Kaduna State", "Hassan Usman Katsina Airport"],
  },
  {
    name: "Mallam Aminu Kano International Airport (KAN)",
    iata: "KAN",
    terminals: ["Main Terminal"],
    keyword: ["Kano", "Kano State", "Aminu Kano Airport", "Kano Airport"],
  },
  {
    name: "Murtala Muhammed International Airport (LOS)",
    iata: "LOS",
    terminals: ["International Terminal", "Domestic Terminal"],
    keyword: [
      "Lagos",
      "Lagos State",
      "Ikeja",
      "Lagos Airport",
      "MMA",
      "MMIA",
      "MMA2",
      "General Aviation Terminal",
    ],
  },
  {
    name: "Port Harcourt International Airport (PHC)",
    iata: "PHC",
    terminals: ["International Terminal", "Domestic Terminal"],
    keyword: [
      "Port Harcourt",
      "Rivers",
      "Rivers State",
      "Omagwa",
      "Obafemi Jeremiah Awolowo Airport",
    ],
  },
  {
    name: "Gateway International Airport (GWI)",
    iata: "GWI",
    terminals: ["Main Terminal"],
    keyword: [
      "Iperu Remo",
      "Ilishan Remo",
      "Ogun",
      "Ogun State",
      "Gateway International Agro-Cargo Airport",
    ],
  },
  {
    name: "Sadiq Abubakar III International Airport (SKO)",
    iata: "SKO",
    terminals: ["Main Terminal"],
    keyword: [
      "Sokoto",
      "Sokoto State",
      "Sultan Abubakar III International Airport",
    ],
  },
  {
    name: "Asaba International Airport (ABB)",
    iata: "ABB",
    terminals: ["Main Terminal"],
    keyword: ["Asaba", "Delta", "Delta State", "Asaba Airport"],
  },
  {
    name: "Sir Abubakar Tafawa Balewa Airport (BCU)",
    iata: "BCU",
    terminals: ["Main Terminal"],
    keyword: [
      "Bauchi",
      "Bauchi State",
      "Bauchi Airport",
      "Bauchi State Airport",
    ],
  },
  {
    name: "Benin Airport (BNI)",
    iata: "BNI",
    terminals: ["Main Terminal"],
    keyword: ["Benin City", "Edo", "Edo State", "Oba Akenzua II Airport"],
  },
  {
    name: "Ibadan Airport (IBA)",
    iata: "IBA",
    terminals: ["Main Terminal"],
    keyword: [
      "Ibadan",
      "Oyo",
      "Oyo State",
      "Alakia",
      "Samuel Ladoke Akintola Airport",
    ],
  },
  {
    name: "Yakubu Gowon Airport (JOS)",
    iata: "JOS",
    terminals: ["Main Terminal"],
    keyword: [
      "Jos",
      "Plateau",
      "Plateau State",
      "Jos Airport",
      "Yakubu Gowon International Airport",
    ],
  },
  {
    name: "Maiduguri International Airport (MIU)",
    iata: "MIU",
    terminals: ["Main Terminal"],
    keyword: [
      "Maiduguri",
      "Borno",
      "Borno State",
      "General Muhammadu Buhari Airport",
    ],
  },
  {
    name: "Sam Mbakwe International Cargo Airport (QOW)",
    iata: "QOW",
    terminals: ["Main Terminal"],
    keyword: [
      "Owerri",
      "Imo",
      "Imo State",
      "Sam Mbakwe Airport",
      "Owerri Airport",
      "SMICA",
    ],
  },
  {
    name: "Lamido Aliyu Mustapha Airport (YOL)",
    iata: "YOL",
    terminals: ["Main Terminal"],
    keyword: ["Yola", "Adamawa", "Adamawa State", "Yola Airport"],
  },
  {
    name: "Lafia Cargo Airport",
    terminals: ["Main Terminal"],
    keyword: ["Lafia", "Nasarawa", "Nassarawa", "Nasarawa State"],
  },
  {
    name: "Akure Airport (AKR)",
    iata: "AKR",
    terminals: ["Main Terminal"],
    keyword: ["Akure", "Ondo", "Ondo State", "Olumuyiwa Bernard Aliu Airport"],
  },
  {
    name: "Gombe Lawanti International Airport (GMO)",
    iata: "GMO",
    terminals: ["Main Terminal"],
    keyword: [
      "Gombe",
      "Gombe State",
      "Lawanti",
      "Sani Abacha International Airport",
    ],
  },
  {
    name: "Sir Ahmadu Bello International Airport",
    terminals: ["Main Terminal"],
    keyword: [
      "Birnin Kebbi",
      "Kebbi",
      "Kebbi State",
      "Kebbi International Airport",
    ],
  },
  {
    name: "Dutse International Airport",
    terminals: ["Main Terminal"],
    keyword: ["Dutse", "Jigawa", "Jigawa State", "Dutse Airport"],
  },
  {
    name: "Danbaba Danfulani Suntai Airport",
    terminals: ["Main Terminal"],
    keyword: ["Jalingo", "Taraba", "Taraba State", "Jalingo Airport"],
  },
  {
    name: "Katsina Airport (DKA)",
    iata: "DKA",
    terminals: ["Main Terminal"],
    keyword: [
      "Katsina",
      "Katsina State",
      "Umaru Musa Yar'Adua International Airport",
    ],
  },
  {
    name: "Makurdi Airport (MDI)",
    iata: "MDI",
    terminals: ["Main Terminal"],
    keyword: [
      "Makurdi",
      "Benue",
      "Benue State",
      "Joseph Sarwuan Tarka Airport",
    ],
  },
  {
    name: "Minna Airport (MXJ)",
    iata: "MXJ",
    terminals: ["Main Terminal"],
    keyword: ["Minna", "Niger", "Niger State", "Mallam Abubakar Imam Airport"],
  },
  {
    name: "Osubi Airport (QRW)",
    iata: "QRW",
    terminals: ["Main Terminal"],
    keyword: [
      "Warri",
      "Osubi",
      "Delta",
      "Delta State",
      "Warri Airport",
      "Alfred Diete-Spiff International Airport",
    ],
  },
  {
    name: "Bayelsa International Airport",
    terminals: ["Main Terminal"],
    keyword: ["Yenagoa", "Bayelsa", "Bayelsa State"],
  },
  {
    name: "Zaria Airport (ZAR)",
    iata: "ZAR",
    terminals: ["Main Terminal"],
    keyword: ["Zaria", "Kaduna", "Kaduna State"],
  },
  {
    name: "Damaturu Cargo Airport",
    terminals: ["Main Terminal"],
    keyword: ["Damaturu", "Yobe", "Yobe State"],
  },
  {
    name: "Ekiti Agro-Allied International Cargo Airport",
    terminals: ["Main Terminal"],
    keyword: [
      "Ado Ekiti",
      "Ado-Ekiti",
      "Ekiti",
      "Ekiti State",
      "Ekiti Airport",
    ],
  },
];

export function searchAirports(query: string, limit = 10) {
  const normalizedQuery = query.trim().toLowerCase();

  return airports
    .filter(
      (airport) =>
        !normalizedQuery ||
        [airport.name, airport.iata, ...airport.keyword].some((value) =>
          value?.toLowerCase().includes(normalizedQuery),
        ),
    )
    .slice(0, limit);
}
