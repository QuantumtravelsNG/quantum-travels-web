"use client";

import Image from "next/image";
import { XIcon } from "lucide-react";
import {
  type FormEvent,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";

type ResourceKey = "packages" | "visas" | "cars";
type ResourceStatus = "loading" | "ready" | "error";
type DepartmentKey = "corporate" | "holidays" | "visas" | "logistics" | "mice";

type Department = {
  label: string;
  call: string;
  whatsapp: string;
  email: string;
};

type ChatItem = {
  location?: string;
  name?: string;
  title?: string;
  type?: string;
  country?: string;
  processingTime?: string;
  selectionTypes?: Array<{
    prices?: Array<{
      amount?: unknown;
      label?: string;
    }>;
  }>;
};

type ResourceState = {
  status: ResourceStatus;
  items: ChatItem[];
};

type ChatData = Record<ResourceKey, ResourceState>;

type Conversation = {
  topic: string | null;
  matches: ChatItem[];
};

type UserMessage = {
  text: string;
  isUser: true;
  html?: never;
  topic?: never;
};

type AssistantMessage = {
  html: string;
  isUser: false;
  topic: string;
  text?: never;
};

type Message = UserMessage | AssistantMessage;

type Reply = {
  html: string;
  topic: string;
  matches: ChatItem[];
};

type QoraChatWidgetProps = {
  onUnmatched?: (text: string) => void;
};

type DeskOptions = {
  heading?: boolean;
};

type FetchJsonOptions = {
  timeout?: number;
  retries?: number;
};

type ResourceIssueOptions = {
  noun: string;
  deptKey: DepartmentKey;
};

/* ============================================================
   Qora — Quantum Travels Chat Widget
   Brand color: #9e328a

   Key change from the previous version: listings are no longer
   gated behind `array.length > 0`. Each resource now reports its
   own state (loading / ready / error), so a dead API produces an
   honest "can't reach listings right now" reply instead of
   silently collapsing every question into the support fallback.
   ============================================================ */

/* ---------------- Configuration ---------------- */
const API_BASE = "https://quantum.tonyicon.com.ng";

const ENDPOINTS: Record<ResourceKey, string> = {
  packages: "/v1/site/tour-packages/holiday",
  visas: "/v1/site/visa-packages",
  cars: "/v1/site/car-services/cars"
};

const PHONE = "0700 782 6886";
const EMAIL = "info@quantumtravelsng.com";
const AVATAR = "/assets/qora.png";

/* ---------------- Department registry ----------------
   Single source of truth. Previously these numbers were retyped
   inside ten separate HTML strings with inconsistent spacing. */
const DEPARTMENTS: Record<DepartmentKey, Department> = {
  corporate: {
    label: "Corporate Travel",
    call: "0810 926 4805",
    whatsapp: "0810 926 4805",
    email: "info@quantumtravelsng.com"
  },
  holidays: {
    label: "Quantum Holidays",
    call: "0816 742 8469",
    whatsapp: "0908 719 4783",
    email: "holidays@quantumtravelsng.com"
  },
  visas: {
    label: "Visa Services",
    call: "0911 844 9843",
    whatsapp: "0911 844 9843",
    email: "visas@quantumtravelsng.com"
  },
  logistics: {
    label: "Quantum Logistics",
    call: "0812 293 4216",
    whatsapp: "0812 293 4216",
    email: "logistics@quantumtravelsng.com"
  },
  mice: {
    label: "Meetings & Events",
    call: "0810 926 4805",
    whatsapp: "0810 926 4805",
    email: "mice@quantumtravelsng.com"
  }
};

function desk(key: DepartmentKey, { heading = true }: DeskOptions = {}) {
  const d = DEPARTMENTS[key];
  if (!d) return "";
  let out = heading ? `<strong>${d.label} Desk:</strong><br>` : `<strong>${d.label}</strong><br>`;
  if (d.whatsapp && d.whatsapp !== d.call) {
    out += `📱 WhatsApp: ${d.whatsapp}<br>📞 Call: ${d.call}<br>`;
  } else {
    out += `📞 Call/WhatsApp: ${d.call}<br>`;
  }
  out += `📧 ${d.email}`;
  return out;
}

/* Longest-first so "south korea" wins over "korea", and duplicates
   introduced while editing the lists below are harmless. */
function dedupe(list: string[]) {
  return [...new Set(list.map((s) => s.toLowerCase().trim()))].sort(
    (a, b) => b.length - a.length
  );
}

/* ---------------- Keyword groups ----------------
   Matching is word-boundary based (see hasWord), so short entries
   like "uk" or "oman" are safe. Ambiguous everyday English words are
   deliberately NOT listed as destinations — see the note above
   KNOWN_DESTINATIONS. */

const TOUR_WORDS = [
  // core
  "tour", "tours", "cruise", "cruises", "trip", "trips", "travel", "travels",
  "traveling", "travelling", "holiday", "holidays", "vacation", "vacations", "vacay",
  "package", "packages", "getaway", "getaways", "destination", "destinations",
  "honeymoon", "honeymoons", "excursion", "excursions",
  // trip types
  "safari", "safaris", "sightseeing", "tourism", "tourist", "staycation",
  "road trip", "group tour", "solo trip", "family trip", "girls trip", "guys trip",
  "leisure", "resort", "resorts", "island", "islands", "beach", "beaches",
  "adventure", "bucket list", "explore",
  // seasonal phrasing common in Nigerian bookings
  "detty december", "december trip", "christmas trip", "easter trip",
  "summer trip", "summer holiday", "val trip", "valentine trip"
];

const CAR_WORDS = [
  // core
  "car", "cars", "vehicle", "vehicles", "rent", "rental", "rentals", "hire",
  "chauffeur", "chauffeur-driven", "ride", "drive", "self drive", "self-drive",
  "driver", "drivers", "driver hire", "pickup", "pick-up", "transfer", "transfers",
  // vehicle classes customers name directly
  "bus", "buses", "coaster", "shuttle", "shuttles", "van", "vans", "sienna",
  "suv", "suvs", "jeep", "prado", "hilux", "coach", "limo", "limousine", "convoy",
  // service phrasing
  "car hire", "car rental", "airport run", "school run", "ground transport",
  "ground transportation", "mobility", "cab", "cabs", "taxi"
];

const VISA_WORDS = [
  "visa", "visas", "e-visa", "evisa", "visa on arrival",
  "tourist visa", "student visa", "study visa", "work visa", "business visa",
  "transit visa", "schengen", "work permit", "residence permit",
  "embassy", "embassies", "consulate", "consulates",
  "biometric", "biometrics", "visa appointment", "visa interview",
  "invitation letter", "immigration"
];

const GREETING_WORDS = [
  "hi", "hii", "hello", "helo", "hey", "heyy", "hiya", "yo", "howdy", "greetings",
  "good day", "good morning", "good afternoon", "good evening",
  "morning", "afternoon", "evening",
  // Nigerian / West African openers
  "how far", "how you dey", "how are you", "hope you dey", "well done",
  "kedu", "bawo", "bawo ni", "sannu", "e kaaro", "e kaasan", "e kaale",
  // other common openers
  "salam", "salaam", "assalamu alaikum", "asalam alaikum", "hola", "bonjour",
  "what's up", "whats up", "wassup", "sup"
];

const PRICE_WORDS = [
  "how much", "how much is", "how much be", "price", "prices", "pricing",
  "cost", "costs", "e cost", "charge", "charges", "fee", "fees", "amount",
  "rate", "rates", "naira", "dollar", "dollars", "budget", "afford", "affordable",
  "cheap", "cheaper", "cheapest", "discount", "discounts", "deposit",
  "quote", "quotation", "estimate", "total"
];

const DETAIL_WORDS = [
  "more details", "more detail", "tell me more", "details", "more info",
  "more information", "itinerary", "itineraries",
  "what's included", "whats included", "what is included", "what does it include",
  "inclusions", "inclusive", "exclusions",
  "duration", "how long", "how many days", "how many nights", "nights",
  "breakdown", "full details", "send details", "send me details",
  "brochure", "flyer", "requirements", "what do i need",
  "departure", "departure date", "available dates", "schedule", "when is it"
];

const FLIGHT_WORDS = [
  "flight", "flights", "fly", "flying", "flown",
  "airfare", "air fare", "air ticket", "air tickets", "ticket", "tickets",
  "plane", "airplane", "airline", "airlines",
  "one way", "one-way", "round trip", "round-trip", "return ticket",
  "economy class", "premium economy", "business class", "first class",
  "layover", "stopover", "connecting flight", "direct flight", "non-stop",
  "baggage allowance", "excess baggage", "boarding pass", "check-in",
  "reschedule flight", "flight change", "rebooking", "date change",
  // carriers customers name directly
  "emirates", "qatar airways", "etihad", "british airways", "virgin atlantic",
  "air france", "klm", "lufthansa", "turkish airlines", "ethiopian airlines",
  "kenya airways", "rwandair", "delta", "united airlines", "air peace",
  "ibom air", "arik", "value jet"
];

const HOTEL_WORDS = [
  "hotel", "hotels", "accommodation", "accommodations", "lodging",
  "lodge", "lodges", "apartment", "apartments", "airbnb",
  "shortlet", "short let", "short-let", "guest house", "guesthouse",
  "room", "rooms", "suite", "suites", "villa", "villas",
  "bed and breakfast", "half board", "full board", "all inclusive", "all-inclusive",
  "where to stay", "place to stay", "night stay", "check-in date", "check-out"
];

const INSURANCE_WORDS = [
  "insurance", "travel insurance", "medical insurance", "health insurance",
  "travel cover", "medical cover", "coverage", "trip protection",
  "cancellation cover", "schengen insurance", "claim", "claims", "insured"
];

/* ---------------- Destinations ----------------
   Deliberately EXCLUDED because they are ordinary English words and
   would misfire even with word boundaries:
     male (Maldives), nice (France), split (Croatia), reading / bath (UK),
     mali, chad, china town, of, so on.
   If you sell those, add them as longer phrases instead — e.g.
   "male maldives", "nice france". */
const KNOWN_DESTINATIONS = dedupe([
  // West & Central Africa
  "ghana", "accra", "kumasi", "senegal", "dakar", "gambia", "banjul",
  "ivory coast", "cote d'ivoire", "abidjan", "togo", "lome", "benin republic",
  "cotonou", "sierra leone", "freetown", "liberia", "monrovia", "guinea",
  "conakry", "cameroon", "douala", "yaounde", "gabon", "libreville",
  "congo", "brazzaville", "kinshasa", "cape verde",
  // East & Southern Africa
  "kenya", "nairobi", "mombasa", "masai mara", "tanzania", "zanzibar", "arusha",
  "serengeti", "kilimanjaro", "uganda", "kampala", "rwanda", "kigali",
  "ethiopia", "addis ababa", "south africa", "cape town", "johannesburg",
  "pretoria", "durban", "sun city", "botswana", "gaborone", "namibia",
  "windhoek", "zambia", "lusaka", "zimbabwe", "harare", "victoria falls",
  "mozambique", "maputo", "madagascar", "mauritius", "seychelles", "comoros",
  "malawi", "angola", "luanda",
  // North Africa
  "egypt", "cairo", "luxor", "aswan", "sharm el sheikh", "hurghada",
  "morocco", "marrakech", "marrakesh", "casablanca", "rabat", "tangier",
  "tunisia", "tunis", "algeria",
  // Middle East
  "dubai", "abu dhabi", "sharjah", "uae", "qatar", "doha", "oman", "muscat",
  "bahrain", "manama", "kuwait", "saudi arabia", "riyadh", "jeddah",
  "mecca", "makkah", "medina", "madinah", "umrah", "hajj",
  "jordan", "amman", "petra", "israel", "jerusalem", "tel aviv", "lebanon", "beirut",
  // Europe
  "uk", "united kingdom", "england", "london", "manchester", "birmingham",
  "liverpool", "scotland", "edinburgh", "glasgow", "wales", "ireland", "dublin",
  "france", "paris", "marseille", "lyon", "bordeaux", "monaco",
  "italy", "rome", "milan", "venice", "florence", "naples", "sicily", "sardinia",
  "amalfi", "spain", "madrid", "barcelona", "seville", "valencia", "ibiza",
  "portugal", "lisbon", "porto", "algarve",
  "germany", "berlin", "munich", "frankfurt", "hamburg",
  "netherlands", "holland", "amsterdam", "belgium", "brussels", "bruges",
  "switzerland", "zurich", "geneva", "interlaken", "lucerne",
  "austria", "vienna", "salzburg", "czech republic", "prague",
  "hungary", "budapest", "poland", "warsaw", "krakow",
  "greece", "athens", "santorini", "mykonos", "crete",
  "turkey", "istanbul", "antalya", "cappadocia", "bodrum",
  "croatia", "dubrovnik", "cyprus", "malta", "slovenia", "serbia", "romania",
  "bulgaria", "iceland", "reykjavik", "norway", "oslo", "sweden", "stockholm",
  "denmark", "copenhagen", "finland", "helsinki", "estonia", "latvia", "lithuania",
  "russia", "moscow", "st petersburg", "georgia", "tbilisi", "armenia", "yerevan",
  "azerbaijan", "baku", "ukraine",
  // Americas
  "usa", "united states", "america", "new york", "los angeles", "las vegas",
  "miami", "orlando", "washington", "chicago", "houston", "dallas", "atlanta",
  "boston", "san francisco", "hawaii",
  "canada", "toronto", "vancouver", "montreal", "ottawa", "calgary",
  "mexico", "mexico city", "cancun", "brazil", "rio de janeiro", "sao paulo",
  "argentina", "buenos aires", "peru", "lima", "chile", "santiago",
  "colombia", "bogota", "ecuador", "costa rica", "panama",
  "jamaica", "bahamas", "barbados", "cuba", "havana", "trinidad",
  "dominican republic", "punta cana", "aruba", "st lucia", "antigua",
  // Asia & Oceania
  "china", "beijing", "shanghai", "guangzhou", "shenzhen", "hong kong", "macau",
  "taiwan", "japan", "tokyo", "osaka", "kyoto",
  "south korea", "korea", "seoul", "busan",
  "singapore", "sentosa", "malaysia", "kuala lumpur", "langkawi", "penang",
  "thailand", "bangkok", "phuket", "krabi", "pattaya", "chiang mai",
  "indonesia", "bali", "jakarta", "lombok",
  "vietnam", "hanoi", "ho chi minh", "saigon", "da nang",
  "cambodia", "phnom penh", "siem reap", "laos", "myanmar",
  "philippines", "manila", "cebu", "boracay",
  "india", "delhi", "mumbai", "goa", "bangalore", "agra", "kerala",
  "sri lanka", "colombo", "nepal", "kathmandu", "bhutan",
  "maldives", "pakistan", "karachi", "lahore", "islamabad", "bangladesh", "dhaka",
  "kazakhstan", "uzbekistan", "tashkent",
  "australia", "sydney", "melbourne", "brisbane", "perth",
  "new zealand", "auckland", "queenstown", "fiji", "bora bora", "tahiti",
  // Nigeria — domestic leisure & logistics
  "nigeria", "lagos", "abuja", "port harcourt", "calabar", "obudu", "uyo",
  "enugu", "owerri", "benin city", "ibadan", "abeokuta", "akure", "ilorin",
  "jos", "kaduna", "kano", "yankari", "erin ijesha", "idanre", "badagry",
  "olumo rock", "zuma rock", "lekki", "epe", "ikogosi", "gurara"
]);

/* ---------------- FAQ database ---------------- */
const FAQS = [
  {
    id: "book-ride",
    keywords: ["book a ride", "book a car", "book a driver", "book a vehicle"],
    answer:
      "Booking with Quantum Logistics is quick and easy. Simply contact our team or submit your request through our website with your travel details. Once your booking is confirmed, you will receive all the necessary trip information for a seamless travel experience.<br><br>" +
      desk("logistics")
  },
  {
    id: "how-to-book",
    keywords: ["how do i book", "how to book", "how can i book", "make a booking", "booking process", "make a reservation"],
    answer:
      "Booking with Quantum Travels is quick and easy. Simply contact the department that matches your travel needs by phone, WhatsApp, or email. Our travel consultants will guide you through the process, recommend the best options, and confirm your booking promptly.<br><br>" +
      desk("corporate", { heading: false }) + "<br><br>" +
      desk("holidays", { heading: false }) + "<br><br>" +
      desk("visas", { heading: false }) + "<br><br>" +
      desk("logistics", { heading: false })
  },
  {
    id: "groups",
    keywords: ["group", "groups", "corporate event", "corporate events", "corporate team", "corporate teams", "conference", "conferences", "pilgrimage", "school excursion", "incentive trip"],
    answer:
      "Yes. We specialize in managing travel for corporate teams, conferences, meetings, incentive trips, destination events, religious pilgrimages, school excursions, and leisure groups. Our experienced team coordinates flights, accommodation, ground transportation, visas (where required), and logistics to deliver a seamless group travel experience.<br><br>" +
      desk("corporate") + "<br><br>" + desk("mice")
  },
  {
    id: "corporate",
    keywords: ["corporate travel", "corporate", "business travel", "business trip"],
    answer:
      "Yes. Quantum Travels provides end-to-end corporate travel management for businesses of all sizes. Our services include flight bookings, hotel reservations, airport transfers, visa support, travel insurance, and itinerary planning. Whether it's an executive trip, conference, or team travel, we ensure a seamless and professional experience from start to finish.<br><br>" +
      desk("corporate")
  },
  {
    id: "plan-vacation",
    keywords: ["plan a vacation", "plan vacation", "plan my vacation", "plan a holiday", "plan holiday", "plan a trip", "plan my trip", "honeymoon", "romantic getaway", "family vacation", "luxury escape"],
    answer:
      "Absolutely! Our Quantum Holidays team specializes in creating unforgettable travel experiences. Whether you are planning a romantic getaway, family vacation, honeymoon, group tour, or luxury escape, we'll handle everything, from flights and accommodation to tours and travel support, so you can travel with ease.<br><br>" +
      desk("holidays")
  },
  {
    id: "guided-tours",
    keywords: ["guided tour", "guided tours", "tour guide", "tour guides"],
    answer:
      "Yes. We offer carefully curated guided tours to exciting local and international destinations. Our tour packages include thoughtfully planned itineraries, comfortable accommodations, exciting excursions, and dedicated support to ensure a memorable travel experience from beginning to end.<br><br>" +
      desk("holidays")
  },
  {
    id: "airport-transfer",
    keywords: ["airport pickup", "airport pick-up", "airport pick up", "drop-off", "drop off", "airport transfer", "airport transfers"],
    answer:
      "Yes. Through Quantum Logistics, we provide reliable airport transfers, executive chauffeur services, interstate transportation, and premium ground mobility solutions. Our professional drivers and well-maintained vehicles ensure every journey is safe, comfortable, and on schedule.<br><br>" +
      desk("logistics")
  },
  {
    id: "visa-help",
    keywords: ["visa application", "visa applications", "apply for a visa", "apply for visa", "assist with visa", "visa assistance", "visa help", "help with visa", "visa support"],
    answer:
      "Yes. Our Visa Services team provides professional guidance throughout the visa application process. We assist with document reviews, application preparation, appointment scheduling (where applicable), and expert advice to help make your application process as smooth as possible. Please note that visa approval is solely at the discretion of the respective embassy or consulate.<br><br>" +
      desk("visas")
  },
  {
    id: "payments",
    keywords: ["payment", "payments", "payment method", "payment methods", "bank transfer", "debit card", "credit card", "installment", "instalment"],
    answer:
      "We accept secure payments via bank transfer, debit and credit cards, and other approved payment channels. Available payment options may vary depending on the service you are booking. Once your reservation is confirmed, our team will provide the appropriate payment details and guide you through the payment process securely."
  },
  {
    id: "logistics",
    keywords: ["logistics", "quantum logistics", "interstate"],
    answer:
      "Quantum Logistics provides premium transportation services, including airport pick-ups and drop-offs, interstate travel, executive chauffeur services, corporate transportation, and event transfers. We are committed to delivering safe, comfortable, and reliable journeys with professional drivers.<br><br>" +
      desk("logistics")
  }
];

/* ---------------- Quick replies ----------------
   Customers shouldn't have to guess the magic word. Each chip sends
   a phrase the matcher is guaranteed to route correctly. */
const QUICK_REPLIES = [
  { label: "Tour packages", query: "Show me your tour packages" },
  { label: "Flights", query: "I want to book a flight" },
  { label: "Hotels", query: "I need hotel accommodation" },
  { label: "Visas", query: "I need visa assistance" },
  { label: "Car hire", query: "I want to hire a car" },
  { label: "Travel insurance", query: "Do you offer travel insurance" },
  { label: "How to book", query: "How do I book" }
];

const MAX_MESSAGES = 120;

const RESOURCE_LABELS: Record<ResourceKey, string> = {
  packages: "tour packages",
  visas: "visas",
  cars: "vehicles"
};

/* ---------------- Text helpers ---------------- */

// Everything derived from the API passes through this before it
// reaches dangerouslySetInnerHTML.
function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* A single message is tested against ~620 terms. Compiling a fresh
   RegExp for each one every time was the hot path; they're immutable,
   so cache them. */
const RX_CACHE = new Map<string, RegExp>();

function wordRegex(word: string) {
  let rx = RX_CACHE.get(word);
  if (!rx) {
    const safe = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rx = new RegExp("(?:^|[^\\p{L}\\p{N}])" + safe + "(?:$|[^\\p{L}\\p{N}])", "iu");
    RX_CACHE.set(word, rx);
  }
  return rx;
}

function hasWord(text: string, word: string) {
  return wordRegex(word).test(text);
}

function hasAny(text: string, words: string[]) {
  return words.some((w) => hasWord(text, w));
}

/* Acronyms and accented names that titleCase would mangle
   ("uk" -> "Uk", "usa" -> "Usa"). */
const DISPLAY_NAMES: Record<string, string> = {
  uk: "the UK", "united kingdom": "the United Kingdom", usa: "the USA",
  "united states": "the United States", uae: "the UAE",
  "cote d'ivoire": "Côte d'Ivoire", "ho chi minh": "Ho Chi Minh City",
  "sao paulo": "São Paulo", "st petersburg": "St Petersburg",
  "st lucia": "St Lucia", "bed and breakfast": "Bed and Breakfast",
  "netherlands": "the Netherlands", "philippines": "the Philippines",
  "maldives": "the Maldives", "bahamas": "the Bahamas",
  "seychelles": "the Seychelles", "gambia": "the Gambia",
  "dominican republic": "the Dominican Republic",
  "czech republic": "the Czech Republic", "ivory coast": "Ivory Coast"
};

function displayPlace(loc: string) {
  return DISPLAY_NAMES[loc] || titleCase(loc);
}

function titleCase(str: string) {
  return str.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

/* ---------------- Data helpers ---------------- */

// Accepts bare arrays or common envelope shapes so a backend
// standardising on { data: [...] } doesn't break the widget.
function toArray(payload: unknown): ChatItem[] {
  if (Array.isArray(payload)) return payload as ChatItem[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  for (const key of ["data", "items", "results", "packages"]) {
    if (Array.isArray(record[key])) return record[key] as ChatItem[];
  }

  const nested = record.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    const nestedRecord = nested as Record<string, unknown>;
    for (const key of ["items", "results", "data"]) {
      if (Array.isArray(nestedRecord[key])) {
        return nestedRecord[key] as ChatItem[];
      }
    }
  }
  return [];
}

async function fetchJson(
  url: string,
  { timeout = 8000, retries = 1 }: FetchJsonOptions = {}
): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

const EMPTY_RESOURCE: ResourceState = { status: "loading", items: [] };

const LOC_CACHE = new WeakMap<ChatItem[], string[]>();

function availableLocations(packages: ChatItem[]) {
  const cached = LOC_CACHE.get(packages);
  if (cached) return cached;
  const set = new Set<string>();
  packages.forEach((p) => {
    (p.location || "").split(/\s*(?:\band\b|&|,)\s*/i).forEach((part) => {
      const loc = part.trim().toLowerCase();
      if (loc) set.add(loc);
    });
  });
  const out = [...set];
  LOC_CACHE.set(packages, out);
  return out;
}

function formatPrice(p: ChatItem) {
  const sel = (p.selectionTypes || [])[0];
  const price = sel && Array.isArray(sel.prices) ? sel.prices[0] : null;
  if (!price) return "";
  const amount = Number(price.amount);
  if (!Number.isFinite(amount)) return "";
  return ` — from ${esc(price.label || "₦")}${amount.toLocaleString()}`;
}

function listPackages(list: ChatItem[], limit = 8) {
  let str = "";
  list.slice(0, limit).forEach((p) => {
    const title = esc(p.title || p.name || "Untitled package");
    str += `• <strong>${title}</strong>${formatPrice(p)}<br>`;
  });
  if (list.length > limit) {
    str += `<em>…and ${list.length - limit} more.</em><br>`;
  }
  return str;
}

/* ---------------- Resource state replies ----------------
   The bug that produced "every input just shows support details"
   lived here: a failed fetch left an empty array, and every
   listing branch was gated on length > 0. Now each state gets
   its own reply. */
function resourceIssue(
  resource: ResourceState,
  { noun, deptKey }: ResourceIssueOptions
) {
  if (resource.status === "loading") {
    return `One moment — I'm still loading our latest ${noun}. Ask me again in a few seconds, or call <strong>${PHONE}</strong> if you'd rather speak to someone now.`;
  }
  if (resource.status === "error") {
    return (
      `I can't reach our live ${noun} listings at the moment, so I don't want to guess. Our team has the full, current list:<br><br>` +
      desk(deptKey)
    );
  }
  if (resource.items.length === 0) {
    return (
      `We don't have any ${noun} published right now. New options are added regularly — our team can also arrange something custom:<br><br>` +
      desk(deptKey)
    );
  }
  return null;
}

/* ---------------- Reply logic ----------------
   Returns { html, topic, matches } so the component can keep
   light follow-up context ("how much?", "more details"). */
function getReply(msg: string, data: ChatData, convo: Conversation): Reply {
  const l = msg.toLowerCase();
  const { packages, visas, cars } = data;

  /* 0. Intent guard. A place name inside a visa or vehicle question
        must not be read as a package enquiry — otherwise "do I need a
        visa for Dubai?" answers "no package for Dubai", and "car hire
        in Lagos" answers "no package for Lagos". */
  const wantsVisa = hasAny(l, VISA_WORDS);
  const wantsCar = hasAny(l, CAR_WORDS);
  const wantsFlight = hasAny(l, FLIGHT_WORDS);
  const wantsHotel = hasAny(l, HOTEL_WORDS);
  const wantsInsurance = hasAny(l, INSURANCE_WORDS);
  const destinationOk =
    !wantsVisa && !wantsCar && !wantsFlight && !wantsHotel && !wantsInsurance;

  /* 1. Destination match against packages we actually sell.
        Checked before the FAQ so "how do I book a Mauritius trip?"
        answers about Mauritius rather than returning the generic
        department list. */
  if (destinationOk && packages.status === "ready" && packages.items.length > 0) {
    const available = availableLocations(packages.items);
    const mentioned = available.filter((loc) => hasWord(l, loc));
    if (mentioned.length > 0) {
      const matches = packages.items.filter((p) =>
        mentioned.some((loc) => (p.location || "").toLowerCase().includes(loc))
      );
      if (matches.length > 0) {
        const locs = [...new Set(matches.map((p) => p.location))].map(esc).join(", ");
        const html =
          `Great choice! Here's what we have for <strong>${locs}</strong>:<br><br>` +
          listPackages(matches) +
          `<br>Would you like more details, or call <strong>${PHONE}</strong> to book?`;
        return { html, topic: "packages", matches };
      }
    }
  }

  /* 2. FAQ */
  for (const faq of FAQS) {
    if (hasAny(l, faq.keywords)) {
      return { html: faq.answer, topic: faq.id, matches: [] };
    }
  }

  /* 3. Destination we don't currently cover.
        Word-boundary matched, so "woman" no longer triggers Oman. */
  const mentionedKnown = destinationOk
    ? KNOWN_DESTINATIONS.filter((loc) => hasWord(l, loc))
    : [];
  if (mentionedKnown.length > 0) {
    const place = displayPlace(mentionedKnown[0]);
    let html = `We don't have a published package for <strong>${esc(place)}</strong> at the moment 😔<br><br>`;
    if (packages.status === "ready" && packages.items.length > 0) {
      html +=
        "Here's what we do have right now:<br><br>" +
        listPackages(packages.items) +
        `<br>Or call <strong>${PHONE}</strong> — we can often arrange a custom trip.`;
      return { html, topic: "packages", matches: packages.items };
    }
    html += `Call <strong>${PHONE}</strong> — we can often arrange a custom trip.`;
    return { html, topic: "packages", matches: [] };
  }

  /* 4. Visas. Narrowed to the country asked about, when there is one —
        "do I need a visa for Canada?" should not list every country. */
  if (wantsVisa) {
    const issue = resourceIssue(visas, { noun: "visa packages", deptKey: "visas" });
    if (issue) return { html: issue, topic: "visas", matches: [] };

    const asked = KNOWN_DESTINATIONS.filter((loc) => hasWord(l, loc));
    const narrowed = asked.length
      ? visas.items.filter((v) => {
          const hay = `${v.country || ""} ${v.name || ""} ${v.title || ""}`.toLowerCase();
          return asked.some((loc) => hay.includes(loc));
        })
      : [];
    const shown = narrowed.length ? narrowed : visas.items;

    let html = narrowed.length
      ? `Visa packages for <strong>${esc(displayPlace(asked[0]))}</strong>:<br><br>`
      : asked.length
      ? `I don't have a published visa package for <strong>${esc(displayPlace(asked[0]))}</strong> yet — our team handles it directly. Here's what is listed:<br><br>`
      : "Visa packages:<br><br>";

    shown.slice(0, 6).forEach((v) => {
      const name = esc(v.name || v.title || "Visa package");
      const country = v.country ? ` (${esc(v.country)})` : "";
      const time = v.processingTime ? ` — ${esc(v.processingTime)}` : "";
      html += `• <strong>${name}</strong>${country}${time}<br>`;
    });
    html += `<br>Call <strong>${DEPARTMENTS.visas.call}</strong> to start your application.`;
    return { html, topic: "visas", matches: shown };
  }

  /* 5. Car services */
  if (wantsCar) {
    const issue = resourceIssue(cars, { noun: "vehicles", deptKey: "logistics" });
    if (issue) return { html: issue, topic: "cars", matches: [] };
    let html = "Available car services:<br><br>";
    cars.items.slice(0, 8).forEach((c) => {
      html += `• ${esc(c.name || c.type || "Vehicle")}<br>`;
    });
    html += `<br>Contact <strong>${DEPARTMENTS.logistics.call}</strong> to book.`;
    return { html, topic: "cars", matches: cars.items };
  }

  /* 5b. Flights. No live fare feed, so we route rather than guess. */
  if (wantsFlight) {
    return {
      html:
        "Yes — we book local and international flights on all major airlines, including reissues, date changes and group fares.<br><br>" +
        "Fares move constantly, so our consultants will check live availability and send you the best options for your dates. Share your route, travel dates and number of passengers when you reach out.<br><br>" +
        desk("corporate") +
        "<br><br>For leisure and family trips:<br>" +
        desk("holidays", { heading: false }),
      topic: "flights",
      matches: []
    };
  }

  /* 5c. Hotels & accommodation. */
  if (wantsHotel) {
    return {
      html:
        "Yes — we book hotels, serviced apartments and resorts worldwide, either on their own or as part of a full package.<br><br>" +
        "Tell our team your destination, check-in and check-out dates, number of guests and preferred budget, and they'll send you options to choose from.<br><br>" +
        desk("holidays") +
        "<br><br>For corporate and business stays:<br>" +
        desk("corporate", { heading: false }),
      topic: "hotels",
      matches: []
    };
  }

  /* 5d. Travel insurance. Deliberately non-committal on cover terms —
         those are set by the underwriter, not by us. */
  if (wantsInsurance) {
    return {
      html:
        "Yes — we arrange travel insurance, including the medical cover required for Schengen and several other visa applications.<br><br>" +
        "Cover levels, limits and conditions are set by the insurer and vary by policy and destination, so our team will confirm exactly what applies to your trip before you pay.<br><br>" +
        desk("corporate") +
        "<br><br>If it's for a visa application:<br>" +
        desk("visas", { heading: false }),
      topic: "insurance",
      matches: []
    };
  }

  /* 6. Tours / packages, no specific destination */
  if (hasAny(l, TOUR_WORDS)) {
    const issue = resourceIssue(packages, { noun: "tour packages", deptKey: "holidays" });
    if (issue) return { html: issue, topic: "packages", matches: [] };
    const html =
      "Current packages:<br><br>" + listPackages(packages.items) + "<br>Which one interests you?";
    return { html, topic: "packages", matches: packages.items };
  }

  /* 7. Greetings */
  if (hasAny(l, GREETING_WORDS)) {
    return {
      html: "Hi! I'm Qora 👋 Your Quantum Travels assistant. How can I help you today?",
      topic: "greeting",
      matches: []
    };
  }

  /* 8. Follow-up on whatever we last showed.
        Runs late so it never shadows a fresh, explicit question. */
  if (convo.matches.length > 0 && hasAny(l, [...PRICE_WORDS, ...DETAIL_WORDS])) {
    const deptKey = convo.topic === "visas" ? "visas" : convo.topic === "cars" ? "logistics" : "holidays";
    let html = "Here's what I have on those:<br><br>";
    if (convo.topic === "packages") {
      html += listPackages(convo.matches);
    } else {
      convo.matches.slice(0, 8).forEach((m) => {
        html += `• ${esc(m.name || m.title || m.type || "Option")}<br>`;
      });
    }
    html +=
      `<br>For full itineraries, inclusions and exact pricing, our consultants can walk you through it:<br><br>` +
      desk(deptKey);
    return { html, topic: convo.topic ?? "follow-up", matches: convo.matches };
  }

  /* 9. Fallback */
  return {
    html:
      `I can help with tour packages, flights, hotels, visas, travel insurance and car services — just ask.<br><br>` +
      `For anything else, call <strong>${PHONE}</strong> or email <strong>${EMAIL}</strong>.`,
    topic: "fallback",
    matches: []
  };
}

/* ---------------- Component ---------------- */
export default function QoraChatWidget(
  { onUnmatched }: QoraChatWidgetProps = {}
) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [data, setData] = useState<ChatData>({
    packages: EMPTY_RESOURCE,
    visas: EMPTY_RESOURCE,
    cars: EMPTY_RESOURCE
  });

  const dataRef = useRef<ChatData>(data);
  const convoRef = useRef<Conversation>({ topic: null, matches: [] });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Self-pruning so a long session doesn't accumulate dead handles.
  const track = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
    return id;
  }, []);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const loadResource = useCallback(async (key: ResourceKey) => {
    setData((prev) => ({ ...prev, [key]: { status: "loading", items: [] } }));
    try {
      const payload = await fetchJson(API_BASE + ENDPOINTS[key]);
      const items = toArray(payload);
      if (!Array.isArray(payload) && items.length === 0 && payload) {
        // Shape we don't recognise — treat as a failure rather than
        // reporting "nothing available" to a customer.
        console.error(`[Qora] Unexpected response shape for ${key}`, payload);
        setData((prev) => ({ ...prev, [key]: { status: "error", items: [] } }));
        return;
      }
      setData((prev) => ({ ...prev, [key]: { status: "ready", items } }));
    } catch (err) {
      console.error(`[Qora] Failed to load ${key}:`, err);
      setData((prev) => ({ ...prev, [key]: { status: "error", items: [] } }));
    }
  }, []);

  const loadAll = useCallback(() => {
    (Object.keys(ENDPOINTS) as ResourceKey[]).forEach((key) => loadResource(key));
  }, [loadResource]);

  useEffect(() => {
    loadAll();
    track(() => {
      setMessages([
        {
          html: "Hi! I'm Qora 👋 How can I assist with your travel plans today?",
          isUser: false,
          topic: "intro"
        }
      ]);
    }, 800);
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [loadAll, track]);

  // Retry anything that failed when the customer opens the widget.
  useEffect(() => {
    if (!open) return;
    (Object.entries(dataRef.current) as Array<[ResourceKey, ResourceState]>).forEach(([key, resource]) => {
      if (resource.status === "error") loadResource(key);
    });
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [open, loadResource]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = useCallback(
    (raw: unknown) => {
      const text = String(raw || "").trim();
      if (!text || typing) return;

      setMessages((prev) =>
        [...prev, { text, isUser: true as const }].slice(-MAX_MESSAGES)
      );
      setInput("");
      setTyping(true);

      track(() => {
        const reply = getReply(text, dataRef.current, convoRef.current);
        convoRef.current = { topic: reply.topic, matches: reply.matches };

        // Unmatched messages are the raw material for growing the
        // keyword lists. Capture them instead of losing them.
        if (reply.topic === "fallback") {
          console.info("[Qora] unmatched message:", text);
          try {
            onUnmatched?.(text);
          } catch (err) {
            console.error("[Qora] onUnmatched handler failed:", err);
          }
        }

        setTyping(false);
        setMessages((prev) =>
          [
            ...prev,
            { html: reply.html, isUser: false as const, topic: reply.topic }
          ].slice(-MAX_MESSAGES)
        );
      }, 650);
    },
    [typing, track, onUnmatched]
  );

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit(input);
  }

  // Any failure is surfaced, not only a total one — a single dead
  // endpoint is exactly the blind spot that went unnoticed before.
  const failedKeys = (Object.entries(data) as Array<[ResourceKey, ResourceState]>)
    .filter(([, r]) => r.status === "error")
    .map(([k]) => RESOURCE_LABELS[k] || k);

  const lastMessage = messages[messages.length - 1];
  const showChips =
    !typing &&
    lastMessage &&
    !lastMessage.isUser &&
    (lastMessage.topic === "intro" || lastMessage.topic === "fallback");

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Qora chat" : "Open Qora chat"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full overflow-hidden shadow-lg cursor-pointer z-[9999] p-0 border-0"
      >
        <Image
          src={AVATAR}
          alt="Qora avatar"
          className="w-full h-full object-cover bg-white"
          height={64}
          width={64}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with Qora, the Quantum Travels assistant"
          className="fixed bottom-28 right-8 w-96 h-[520px] bg-white rounded-3xl shadow-2xl border flex flex-col z-50"
        >
          {/* Header */}
          <div className="bg-[#9e328a] text-white p-4 rounded-t-3xl flex items-center gap-3">
            <Image
              src={AVATAR}
              alt="Qora"
              className="w-12 h-12 rounded-full border-2 border-white object-cover bg-white"
              height={64}
              width={64}
            />
            <div>
              <p className="font-bold text-lg">Qora</p>
              <p className="text-sm opacity-90">Quantum Travels Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto text-3xl leading-none"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Connection notice — visible, so a dead API can't go unnoticed again */}
          {failedKeys.length > 0 && (
            <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm px-4 py-2 flex items-center gap-2 shrink-0">
              <span className="flex-1">
                Live {failedKeys.join(" and ")} listings are unavailable right now.
              </span>
              <button
                onClick={loadAll}
                className="underline font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
              >
                Retry
              </button>
            </div>
          )}

          {/* Messages */}
          <div
            className="flex-1 p-4 overflow-y-auto bg-gray-50"
            role="log"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((m, i) => (
              <div key={i} className={`mb-4 ${m.isUser ? "text-right" : "text-left"}`}>
                {m.isUser ? (
                  // Rendered as a text node — user input never becomes HTML.
                  <div className="bg-[#9e328a] text-white inline-block px-4 py-3 rounded-2xl max-w-[85%] text-left">
                    {m.text}
                  </div>
                ) : (
                  <div
                    className="bg-white border inline-block px-4 py-3 rounded-2xl max-w-[85%] text-left"
                    dangerouslySetInnerHTML={{ __html: m.html }}
                  />
                )}
              </div>
            ))}

            {typing && (
              <div className="mb-4 text-left">
                <div className="bg-white border inline-block px-4 py-3 rounded-2xl">
                  <span className="sr-only">Qora is typing</span>
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 bg-gray-400 rounded-full motion-safe:animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {showChips && (
            <div className="px-3 sm:px-4 pt-3 shrink-0">
              <p className="text-xs text-gray-500 mb-2">
                {lastMessage.topic === "fallback" ? "Try one of these:" : "Popular questions:"}
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => submit(q.query)}
                    className="text-sm border border-[#9e328a] text-[#9e328a] hover:bg-[#9e328a] hover:text-white
                               rounded-full px-3 py-1.5 transition-colors focus:outline-none
                               focus:ring-2 focus:ring-[#9e328a]/40"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={sendMessage}>
              <div className="flex gap-2">
                <label htmlFor="qora-input" className="sr-only">
                  Ask Qora a question
                </label>
                <input
                  id="qora-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  maxLength={400}
                  autoComplete="off"
                  placeholder="Ask about packages, visas, cars..."
                  className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:border-[#9e328a]"
                />
                <button
                  type="submit"
                  disabled={typing || !input.trim()}
                  className="bg-[#9e328a] hover:bg-[#872a76] text-white px-8 rounded-full transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
