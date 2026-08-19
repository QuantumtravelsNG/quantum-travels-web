"use server";

import {
  postQuantumApi,
  postQuantumFormData,
  getCarsAvailability,
  QuantumApiError,
  verifyCarPayment,
} from "@/lib/quantum-api";
import type {
  ActionResult,
  Currency,
  SelectionType,
  AirportPickupBookingPayload,
  AirportDropoffBookingPayload,
  AirportAlternateRequestPayload,
  CarHireBookingPayload,
  Car,
} from "@/lib/quantum";
import { isValidDateValue, getTodayDateValue } from "@/lib/date-values";
import { parseLocationValues } from "@/lib/locations";
import { isValidPhoneNumberValue } from "@/lib/phone";
import { searchAirports } from "@/lib/airports";

type AirportBookingSubmissionPayload =
  | (AirportPickupBookingPayload & { quotedPrice?: number | null })
  | (AirportDropoffBookingPayload & { quotedPrice?: number | null });

type CarHireBookingApiPayload = {
  carHireDetails: {
    pickupState: string;
    destinationState: string;
    destinationAddress: string;
    pickupDate: string;
    returnDate: string;
    duration: string;
    vehicleType: string;
    passengers: number;
    tripType: string;
    numberOfVehicles: string;
    addons: string[];
  };
  passengerDetails: {
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    additionalComment: string;
  };
};

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const AIRPORT_SERVICE_TYPES = ["airport_pickup", "airport_dropoff"] as const;
const CAR_HIRE_DURATIONS = [
  "4 hours",
  "8 hours",
  "12 hours",
  "1 day",
  "2 days",
  "3 days",
  "1 week",
  "Multiple weeks",
] as const;
const CAR_HIRE_VEHICLE_TYPES = [
  "Sedan",
  "SUV",
  "Van",
  "Hiace Bus",
  "Coaster Bus",
] as const;
const CAR_HIRE_PASSENGERS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "10+",
] as const;
const CAR_HIRE_TRIP_TYPES = ["Intra-State", "Inter-State"] as const;
const CAR_HIRE_VEHICLE_COUNTS = ["1", "2", "3", "4", "5", "5+"] as const;
const CAR_HIRE_ADDONS = [
  "Additional Security",
  "Booking for Event",
  "Chauffeur Service",
] as const;
const CORPORATE_EVENT_TYPES = [
  "Conference",
  "Seminar",
  "Exhibition",
  "Corporate Retreat",
  "Product Launch",
  "Award Ceremony",
  "Other",
] as const;

export type CorporateTravelPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  category: "Request a Proposal" | "Consultation" | "Partnership" | "Other";
  message: string;
};

export type VisaApplicationPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  visaID: string;
  numberOfApplicants: number;
  travelDate: string;
  additionalComment?: string;
};

export type TourBookingPayload = {
  tourID: string;
  selectionType: SelectionType;
  currency: Currency;
  numGuests: number;
  booking: {
    fullName: string;
    email: string;
    phone: string;
    checkIn: string;
    checkOut: string;
  };
};

export type CorporateEventPayload = {
  eventType:
    | "Conference"
    | "Seminar"
    | "Exhibition"
    | "Corporate Retreat"
    | "Product Launch"
    | "Award Ceremony"
    | "Other";
  eventTitle: string;
  startDate: string;
  endDate: string;
  time: string;
  country: string;
  state: string;
  city: string;
  venueAddress?: string;
  numberOfGuests: number;
  eventTheme: string;
  fullName: string;
  companyGroupName?: string;
  email: string;
  phoneNumber: string;
  additionalComment?: string;
};

export type ContactSupportPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

export type NewsletterSubscribePayload = {
  email: string;
};

export type AffiliateRegistrationPayload = FormData;

async function submit<TPayload>(
  endpoint: string,
  payload: TPayload,
): Promise<ActionResult> {
  try {
    const response = await postQuantumApi(endpoint, payload);
    return {
      ok: true,
      message: response.message,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "The request could not be submitted.",
    };
  }
}

async function submitFormData(
  endpoint: string,
  payload: FormData,
): Promise<ActionResult> {
  try {
    const response = await postQuantumFormData(endpoint, payload);
    return {
      ok: true,
      message: response.message,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "The request could not be submitted.",
    };
  }
}

function getFormDataString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parsePositiveInteger(value: string): number {
  const match = value.trim().match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  const trimmed = value.trim();
  return (
    trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
  );
}

function isValidQuotedPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isInList<T extends readonly string[]>(
  value: string,
  list: T,
): value is T[number] {
  return list.includes(value as T[number]);
}

function validateAirportBookingPayload(
  payload: AirportBookingSubmissionPayload,
) {
  if (!isValidQuotedPrice(payload.quotedPrice)) {
    return "Price unavailable. Please choose another cab or contact us for assistance.";
  }

  if (!isNonEmptyString(payload.carId)) {
    return "Please choose a valid cab before proceeding.";
  }

  const airportDetails = payload.airportDetails;
  const passengerDetails = payload.passengerDetails;

  if (
    !airportDetails ||
    !isNonEmptyString(airportDetails.airport) ||
    !isNonEmptyString(airportDetails.terminal) ||
    !isNonEmptyString(airportDetails.address) ||
    !isNonEmptyString(airportDetails.fullAddress) ||
    !isNonEmptyString(airportDetails.pickupDate) ||
    !isNonEmptyString(airportDetails.pickupTime)
  ) {
    return "Please provide complete trip details before proceeding.";
  }

  if (!isValidDateValue(airportDetails.pickupDate)) {
    return "Please choose a valid pickup date.";
  }

  if (airportDetails.pickupDate < getTodayDateValue()) {
    return "Pickup date cannot be in the past.";
  }

  if (airportDetails.fullAddress.trim().length > 180) {
    return "Full address must be 180 characters or fewer.";
  }

  if (airportDetails.address.trim().length > 180) {
    return "Address must be 180 characters or fewer.";
  }

  if (
    !passengerDetails ||
    !isNonEmptyString(passengerDetails.fullName) ||
    !isNonEmptyString(passengerDetails.email) ||
    !isNonEmptyString(passengerDetails.phone)
  ) {
    return "Please provide complete passenger details before proceeding.";
  }

  if (passengerDetails.fullName.trim().length > 100) {
    return "Full name must be 100 characters or fewer.";
  }

  if (!isValidEmail(passengerDetails.email)) {
    return "Please enter a valid email address.";
  }

  if (!isValidPhoneNumberValue(passengerDetails.phone)) {
    return "Please enter a valid phone number.";
  }

  return "";
}

function validateAirportAlternatePayload(
  payload: AirportAlternateRequestPayload,
) {
  const airportDetails = payload.airportDetails;
  const passengerDetails = payload.passengerDetails;

  if (
    !airportDetails ||
    !isNonEmptyString(airportDetails.airport) ||
    !isNonEmptyString(airportDetails.address) ||
    !isNonEmptyString(airportDetails.pickupDate) ||
    !isNonEmptyString(airportDetails.pickupTime)
  ) {
    return "Please provide complete trip details before proceeding.";
  }

  if (!isValidDateValue(airportDetails.pickupDate)) {
    return "Please choose a valid pickup date.";
  }

  if (airportDetails.pickupDate < getTodayDateValue()) {
    return "Pickup date cannot be in the past.";
  }

  if (
    !passengerDetails ||
    !isNonEmptyString(passengerDetails.fullName) ||
    !isNonEmptyString(passengerDetails.email) ||
    !isNonEmptyString(passengerDetails.phone)
  ) {
    return "Please provide complete passenger details before proceeding.";
  }

  if (passengerDetails.fullName.trim().length > 100) {
    return "Full name must be 100 characters or fewer.";
  }

  if (!isValidEmail(passengerDetails.email)) {
    return "Please enter a valid email address.";
  }

  if (!isValidPhoneNumberValue(passengerDetails.phone)) {
    return "Please enter a valid phone number.";
  }

  const alternativePhone = passengerDetails.alternativePhone?.trim() ?? "";
  const whatsappNumber = passengerDetails.whatsappNumber?.trim() ?? "";

  if (
    alternativePhone &&
    !isValidPhoneNumberValue(alternativePhone)
  ) {
    return "Please enter a valid alternative phone number.";
  }

  if (
    whatsappNumber &&
    !isValidPhoneNumberValue(whatsappNumber)
  ) {
    return "Please enter a valid WhatsApp number.";
  }

  if ((passengerDetails.additionalComment ?? "").trim().length > 500) {
    return "Additional comment must be 500 characters or fewer.";
  }

  return "";
}

function toAirportBookingApiPayload(payload: AirportBookingSubmissionPayload) {
  return {
    carId: payload.carId.trim(),
    airportDetails: {
      airport: payload.airportDetails.airport.trim(),
      terminal: payload.airportDetails.terminal.trim(),
      address: payload.airportDetails.address.trim(),
      fullAddress: payload.airportDetails.fullAddress.trim(),
      pickupDate: payload.airportDetails.pickupDate.trim(),
      pickupTime: payload.airportDetails.pickupTime.trim(),
    },
    passengerDetails: {
      fullName: payload.passengerDetails.fullName.trim(),
      email: payload.passengerDetails.email.trim().toLowerCase(),
      phone: payload.passengerDetails.phone.trim(),
      alternativePhone: payload.passengerDetails.alternativePhone?.trim() ?? "",
      whatsappNumber: payload.passengerDetails.whatsappNumber?.trim() ?? "",
      flightNumber: payload.passengerDetails.flightNumber?.trim() ?? "",
      noteForDriver: payload.passengerDetails.noteForDriver?.trim() ?? "",
      companyName: payload.passengerDetails.companyName?.trim() ?? "",
      additionalComment:
        payload.passengerDetails.additionalComment?.trim() ?? "",
    },
  };
}

function getAirportBookingErrorMessage(error: unknown) {
  if (error instanceof QuantumApiError) {
    if (
      error.statusCode >= 500 &&
      error.statusCode <= 599 &&
      error.statusCode !== 504
    ) {
      return "Our booking service is temporarily unavailable. Please try again later.";
    }

    switch (error.statusCode) {
      case 400:
      case 422:
        return "Some booking details could not be accepted. Please review your details and try again.";
      case 401:
      case 403:
        return "We could not authorize this booking. Please refresh the page and try again.";
      case 404:
        return "The selected vehicle could not be found. Please choose another cab.";
      case 408:
      case 504:
        return "The booking request took too long. Please try again.";
      case 409:
        return "The selected vehicle is no longer available for these details. Please choose another cab or date.";
      case 429:
        return "Too many booking attempts were made. Please wait a moment and try again.";
    }
  }

  return "We could not submit your booking. Please check your connection and try again.";
}

async function submitAirportBooking(
  endpoint:
    | "/v1/site/car-services/airport-pickup/book"
    | "/v1/site/car-services/airport-dropoff/book",
  payload: AirportBookingSubmissionPayload,
): Promise<ActionResult> {
  try {
    await postQuantumApi(endpoint, toAirportBookingApiPayload(payload));
    return {
      ok: true,
      message: "Booking submitted successfully.",
    };
  } catch (error) {
    return {
      ok: false,
      message: getAirportBookingErrorMessage(error),
    };
  }
}

function toAirportAlternateApiPayload(payload: AirportAlternateRequestPayload) {
  return {
    airportDetails: {
      airport: payload.airportDetails.airport.trim(),
      address: payload.airportDetails.address.trim(),
      pickupDate: payload.airportDetails.pickupDate.trim(),
      pickupTime: payload.airportDetails.pickupTime.trim(),
    },
    passengerDetails: {
      fullName: payload.passengerDetails.fullName.trim(),
      email: payload.passengerDetails.email.trim().toLowerCase(),
      phone: payload.passengerDetails.phone.trim(),
      alternativePhone: payload.passengerDetails.alternativePhone?.trim() ?? "",
      whatsappNumber: payload.passengerDetails.whatsappNumber?.trim() ?? "",
      flightNumber: payload.passengerDetails.flightNumber?.trim() ?? "",
      additionalComment:
        payload.passengerDetails.additionalComment?.trim() ?? "",
    },
  };
}

function validateCarHirePayload(payload: CarHireBookingPayload) {
  if (!isNonEmptyString(payload.pickUpState)) {
    return "Pick up state is required.";
  }
  if (!isNonEmptyString(payload.destinationState)) {
    return "Destination state is required.";
  }
  if (!isNonEmptyString(payload.destinationAddress)) {
    return "Destination address is required.";
  }
  if (!isValidDateValue(payload.pickUpDate)) {
    return "Please choose a valid pick up date.";
  }
  if (payload.pickUpDate < getTodayDateValue()) {
    return "Pick up date cannot be in the past.";
  }
  if (!isNonEmptyString(payload.returnDate)) {
    return "Return date is required.";
  }
  if (!isValidDateValue(payload.returnDate)) {
    return "Please choose a valid return date.";
  }
  if (payload.returnDate < payload.pickUpDate) {
    return "Return date must be on or after pick up date.";
  }
  if (!isInList(payload.duration, CAR_HIRE_DURATIONS)) {
    return "Please choose a valid duration.";
  }
  if (!isInList(payload.vehicleType, CAR_HIRE_VEHICLE_TYPES)) {
    return "Please choose a valid vehicle type.";
  }
  if (!isInList(payload.passengers, CAR_HIRE_PASSENGERS)) {
    return "Please choose a valid passenger count.";
  }
  if (!isInList(payload.tripType, CAR_HIRE_TRIP_TYPES)) {
    return "Please choose a valid trip type.";
  }
  if (!isInList(payload.numberOfVehicles, CAR_HIRE_VEHICLE_COUNTS)) {
    return "Please choose a valid number of vehicles.";
  }
  if (
    !Array.isArray(payload.addons) ||
    payload.addons.some((addon) => !isInList(addon, CAR_HIRE_ADDONS))
  ) {
    return "Please choose valid add-ons.";
  }
  if (!isNonEmptyString(payload.fullName)) {
    return "Full name is required.";
  }
  if (payload.fullName.trim().length > 100) {
    return "Full name must be 100 characters or fewer.";
  }
  if (payload.companyName.trim().length > 120) {
    return "Company or group name must be 120 characters or fewer.";
  }
  if (!isValidEmail(payload.email)) {
    return "Please enter a valid email address.";
  }
  if (!isValidPhoneNumberValue(payload.phone)) {
    return "Please enter a valid phone number.";
  }
  if (payload.additionalComment.trim().length > 500) {
    return "Additional comment must be 500 characters or fewer.";
  }

  return "";
}

function isValidTimeValue(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function validateCorporateEventPayload(payload: CorporateEventPayload) {
  if (!isInList(payload.eventType, CORPORATE_EVENT_TYPES)) {
    return "Select a valid event type.";
  }
  if (!isNonEmptyString(payload.eventTitle)) {
    return "Event title is required.";
  }
  if (payload.eventTitle.trim().length > 120) {
    return "Event title must be 120 characters or fewer.";
  }
  if (!isValidDateValue(payload.startDate)) {
    return "Select a valid start date.";
  }
  if (payload.startDate < getTodayDateValue()) {
    return "Start date cannot be in the past.";
  }
  if (!isValidDateValue(payload.endDate)) {
    return "Select a valid end date.";
  }
  if (payload.endDate < payload.startDate) {
    return "End date must be on or after the start date.";
  }
  if (!isValidTimeValue(payload.time)) {
    return "Select a valid time.";
  }
  if (
    !Number.isInteger(payload.numberOfGuests) ||
    payload.numberOfGuests <= 0 ||
    payload.numberOfGuests > 100000
  ) {
    return "Enter a valid number of guests.";
  }
  if (!isNonEmptyString(payload.eventTheme)) {
    return "Event theme is required.";
  }
  if (payload.eventTheme.trim().length > 80) {
    return "Event theme must be 80 characters or fewer.";
  }
  if (!isNonEmptyString(payload.fullName)) {
    return "Full name is required.";
  }
  if (payload.fullName.trim().length > 100) {
    return "Full name must be 100 characters or fewer.";
  }
  if (payload.companyGroupName && payload.companyGroupName.trim().length > 120) {
    return "Company or group name must be 120 characters or fewer.";
  }
  if (!isValidEmail(payload.email)) {
    return "Please enter a valid email address.";
  }
  if (!isValidPhoneNumberValue(payload.phoneNumber)) {
    return "Please enter a valid phone number.";
  }
  if (payload.venueAddress && payload.venueAddress.trim().length > 180) {
    return "Venue address must be 180 characters or fewer.";
  }
  if (
    payload.additionalComment &&
    payload.additionalComment.trim().length > 500
  ) {
    return "Additional comment must be 500 characters or fewer.";
  }

  return "";
}

export async function submitCorporateTravelEnquiry(
  payload: CorporateTravelPayload,
): Promise<ActionResult> {
  return submit("/v1/site/corporate-travel/submit-enquiry", payload);
}

export async function submitVisaApplication(
  payload: VisaApplicationPayload,
): Promise<ActionResult> {
  return submit("/v1/site/visa-application/submit", payload);
}

export async function submitTourBooking(
  payload: TourBookingPayload,
): Promise<ActionResult> {
  return submit("/v1/site/tour-package/book", payload);
}

export async function submitCorporateEventReservation(
  payload: CorporateEventPayload,
): Promise<ActionResult> {
  const validationMessage = validateCorporateEventPayload(payload);
  if (validationMessage) {
    return {
      ok: false,
      message: validationMessage,
    };
  }

  return submit("/v1/site/corporate-event/reserve", {
    ...payload,
    ...parseLocationValues(payload),
  });
}

export async function submitContactSupport(
  payload: ContactSupportPayload,
): Promise<ActionResult> {
  return submit("/v1/site/contact-support", payload);
}

export async function submitNewsletterSubscription(
  payload: NewsletterSubscribePayload,
): Promise<ActionResult> {
  return submit("/v1/site/newsletter-subscribe", {
    email: payload.email.trim().toLowerCase(),
  });
}

export async function submitAffiliateRegistration(
  payload: AffiliateRegistrationPayload,
): Promise<ActionResult> {
  const backendPayload = new FormData();
  const location = parseLocationValues({
    country: getFormDataString(payload, "country"),
    state: getFormDataString(payload, "state"),
    city: getFormDataString(payload, "city"),
  });
  const requiredStringFields = [
    "affiliateName",
    "email",
    "phoneNumber",
    "country",
    "state",
    "city",
    "address",
    "market",
    "currency",
  ] as const;

  for (const field of requiredStringFields) {
    const value = getFormDataString(payload, field);
    const parsedValue =
      field === "country" || field === "state" || field === "city"
        ? location[field]
        : value;

    backendPayload.append(
      field,
      field === "email" ? parsedValue.toLowerCase() : parsedValue,
    );
  }

  const cacFile = payload.get("cacFile");
  if (cacFile instanceof Blob) {
    backendPayload.append("cacFile", cacFile);
  }

  for (const product of payload.getAll("products")) {
    if (typeof product === "string" && product.trim()) {
      backendPayload.append("products", product.trim());
    }
  }

  const referralCode = getFormDataString(payload, "referralCode");
  if (referralCode) {
    backendPayload.append("referralCode", referralCode);
  }

  return submitFormData("/v1/site/affiliate-registration", backendPayload);
}

export async function submitAirportPickupBooking(
  payload: AirportPickupBookingPayload & { quotedPrice?: number | null },
): Promise<ActionResult> {
  const validationMessage = validateAirportBookingPayload(payload);
  if (validationMessage) {
    return {
      ok: false,
      message: validationMessage,
    };
  }

  return submitAirportBooking(
    "/v1/site/car-services/airport-pickup/book",
    payload,
  );
}

export async function submitAirportDropoffBooking(
  payload: AirportDropoffBookingPayload & { quotedPrice?: number | null },
): Promise<ActionResult> {
  const validationMessage = validateAirportBookingPayload(payload);
  if (validationMessage) {
    return {
      ok: false,
      message: validationMessage,
    };
  }

  return submitAirportBooking(
    "/v1/site/car-services/airport-dropoff/book",
    payload,
  );
}

export async function submitAirportAlternateRequest(
  payload: AirportAlternateRequestPayload,
): Promise<ActionResult> {
  const validationMessage = validateAirportAlternatePayload(payload);
  if (validationMessage) {
    return {
      ok: false,
      message: validationMessage,
    };
  }

  return submit(
    "/v1/site/car-services/airport-alternate",
    toAirportAlternateApiPayload(payload),
  );
}

export async function submitCarHireBooking(
  payload: CarHireBookingPayload,
): Promise<ActionResult> {
  const validationMessage = validateCarHirePayload(payload);
  if (validationMessage) {
    return {
      ok: false,
      message: validationMessage,
    };
  }

  const apiPayload: CarHireBookingApiPayload = {
    carHireDetails: {
      pickupState: payload.pickUpState.trim(),
      destinationState: payload.destinationState.trim(),
      destinationAddress: payload.destinationAddress.trim(),
      pickupDate: payload.pickUpDate.trim(),
      returnDate: payload.returnDate.trim(),
      duration: payload.duration.trim(),
      vehicleType: payload.vehicleType.trim(),
      passengers: parsePositiveInteger(payload.passengers),
      tripType: payload.tripType.trim(),
      numberOfVehicles: payload.numberOfVehicles.trim(),
      addons: payload.addons,
    },
    passengerDetails: {
      fullName: payload.fullName.trim(),
      companyName: payload.companyName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      additionalComment: payload.additionalComment.trim(),
    },
  };

  return submit("/v1/site/car-services/car-hire/book", apiPayload);
}

export async function getCarsAvailabilityAction(
  serviceType: string,
  date: string,
): Promise<Car[]> {
  if (!isInList(serviceType, AIRPORT_SERVICE_TYPES) || !isValidDateValue(date)) {
    return [];
  }

  return getCarsAvailability(serviceType, date);
}

export async function searchAirportsAction(
  query: string,
): Promise<{ name: string; iata: string }[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  return searchAirports(query).map((airport) => ({
    name: airport.name,
    iata: airport.iata ?? airport.name,
  }));
}

export async function verifyCarPaymentAction(
  reference: string,
): Promise<{ ok: boolean; message: string; data?: unknown }> {
  if (!isNonEmptyString(reference)) {
    return {
      ok: false,
      message: "Payment reference is missing.",
    };
  }

  return verifyCarPayment(reference);
}
