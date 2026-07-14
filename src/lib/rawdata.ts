export interface AdData {
  id: string;
  image: string;
  link: string;
}

export const airports = [
  {
    name: "Murtala Muhammed International Airport (LOS)",
    terminals: ["International Terminal", "Domestic Terminal"],
  },
  {
    name: "Nnamdi Azikiwe International Airport (ABV)",
    terminals: ["International Terminal", "Domestic Terminal"],
  },
  {
    name: "Port Harcourt International Airport (PHC)",
    terminals: ["International Terminal", "Domestic Terminal"],
  },
  {
    name: "Ibadan Airport (IBA)",
    terminals: ["Main Terminal"],
  },
] as const;
