export type TourType = "holiday" | "cruise";
export type Currency = "NGN" | "USD" | "EUR";
export type SelectionType = "per_person" | "per_person_sharing" | "family_of_4";

export interface PriceEntry {
  currency: Currency;
  label: string;
  amount: number;
}

export interface SelectionPrice {
  type: SelectionType;
  label: string;
  prices: PriceEntry[];
}

export interface TourContact {
  number: string;
  email: string;
}

export interface TourItinerary {
  dayActivities: string[];
  itineraryImage?: string;
}

export interface TourPackage {
  id: string;
  title: string;
  location: string;
  countryFlags: string[];
  duration: string;
  startDate: string;
  endDate: string;
  slotsLeft?: number;
  selectionTypes: SelectionPrice[];
  coverPhoto: string;
  slug: string;
  tourType: TourType;
  about: string;
  inclusions: string[];
  contact: TourContact;
  itinerary: TourItinerary | null;
}

export interface VisaType {
  id: string;
  name: string;
  country: string;
  visaFormat: string;
  slug: string;
  type: string;
  validity: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  processingTime: string;
  requirements: string[];
  requiredDocuments: string;
  supportPhone: string;
  supportEmail: string;
  terms: string;
  priceNote: string;
}

export interface GalleryFolder {
  folderTitle: string;
  category: string;
  images: string[];
}

export type ActionResult = {
  ok: boolean;
  message: string;
};

export function getDisplayPrice(tour: TourPackage): string {
  if (tour.selectionTypes.length === 0) return "";

  let lowestNGN: number | null = null;
  let fallback: PriceEntry | null = null;

  for (const selection of tour.selectionTypes) {
    for (const price of selection.prices) {
      if (price.currency === "NGN") {
        if (lowestNGN === null || price.amount < lowestNGN) {
          lowestNGN = price.amount;
        }
      } else if (!fallback) {
        fallback = price;
      }
    }
  }

  if (lowestNGN !== null) {
    return `From NGN ${lowestNGN.toLocaleString("en-NG")}`;
  }

  if (fallback) {
    return `From ${fallback.currency} ${fallback.amount.toLocaleString()}`;
  }

  return "";
}

export function formatVisaPrice(visa: VisaType): string {
  if (!visa.currency) {
    return visa.price.toLocaleString();
  }

  return `${visa.currency}${visa.price.toLocaleString()}`;
}

export function getTourListKey(tour: TourPackage, index: number): string {
  return [
    tour.id,
    tour.slug,
    tour.title,
    tour.location,
    tour.coverPhoto,
    String(index),
  ]
    .filter(Boolean)
    .join(":");
}

export function getVisaListKey(visa: VisaType, index: number): string {
  return [
    visa.id,
    visa.slug,
    visa.country,
    visa.name,
    visa.image,
    String(index),
  ]
    .filter(Boolean)
    .join(":");
}

export function getGalleryFolderKey(
  folder: GalleryFolder,
  index: number,
): string {
  return [folder.folderTitle, folder.category, folder.images[0], String(index)]
    .filter(Boolean)
    .join(":");
}

export function formatPhotoCount(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? "Photo" : "Photos"}`;
}

export type CarCategory =
  | "SEDAN"
  | "SUV"
  | "Executive"
  | "Van"
  | "Bus"
  | string;

export interface CarServicePrice {
  serviceType: string;
  price: number;
}

export interface Car {
  id: string;
  name: string;
  plateNumber: string;
  availabilityStatus: "available" | "unavailable";
  category: CarCategory;
  color: string;
  image: string;
  isActive: boolean;
  year: number;
  servicePrices: CarServicePrice[];
  isAvailableForDate?: boolean;
}

export interface AirportBookingDetails {
  airport: string;
  terminal: string;
  address: string;
  fullAddress: string;
  pickupDate: string;
  pickupTime: string;
}

export interface PassengerDetails {
  fullName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  whatsappNumber?: string;
  flightNumber?: string;
  noteForDriver?: string;
  companyName?: string;
  additionalComment?: string;
}

export interface AirportPickupBookingPayload {
  carId: string;
  airportDetails: AirportBookingDetails;
  passengerDetails: PassengerDetails;
}

export interface AirportDropoffBookingPayload {
  carId: string;
  airportDetails: AirportBookingDetails;
  passengerDetails: PassengerDetails;
}

export interface AirportAlternateRequestPayload {
  airportDetails: {
    airport: string;
    address: string;
    pickupDate: string;
    pickupTime: string;
  };
  passengerDetails: {
    fullName: string;
    email: string;
    phone: string;
    alternativePhone?: string;
    whatsappNumber?: string;
    flightNumber?: string;
    additionalComment?: string;
  };
}

export interface CarHireBookingPayload {
  pickUpState: string;
  destinationState: string;
  destinationAddress: string;
  pickUpDate: string;
  returnDate: string;
  duration: string;
  vehicleType: string;
  passengers: string;
  tripType: string;
  numberOfVehicles: string;
  addons: string[];
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  additionalComment: string;
}
