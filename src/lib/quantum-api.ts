import type {
	Car,
	Currency,
	GalleryFolder,
	SelectionPrice,
	SelectionType,
	TourContact,
	TourItinerary,
	TourPackage,
	TourType,
	VisaType,
} from "@/lib/quantum";
import type { AdData } from "@/lib/rawdata";

const API_BASE_URL =
	process.env.QUANTUM_API_BASE_URL ?? "https://services.quantumtravelsng.com/v1";

export const API_READ_REVALIDATE_SECONDS = 300;
export const API_CACHE_TAG = "quantum-api";

const SUPPORTED_CURRENCIES = ["NGN", "USD", "EUR"] as const;
const SUPPORTED_SELECTION_TYPES = [
	"per_person",
	"per_person_sharing",
	"family_of_4",
] as const;
const BACKEND_PHONE_FIELDS = new Set(["phone", "phoneNumber", "supportPhone"]);

type QuantumFetchInit = RequestInit & {
	next?: {
		revalidate?: number | false;
		tags?: string[];
	};
};

type ApiPriceEntry = {
	currency?: string;
	label?: string;
	amount?: number;
};

type ApiSelectionType = {
	type?: string;
	label?: string;
	prices?: ApiPriceEntry[];
};

type ApiTourContact =
	| string
	| {
			number?: string;
			email?: string;
	  };

type ApiTourItinerary = null | {
	dayActivities?: string[] | string;
	itineraryImage?: string;
};

type ApiTourPackage = {
	id?: string;
	isActive?: boolean;
	isFeatured?: boolean;
	title?: string;
	location?: string;
	countryFlag?: string;
	countryFlags?: string | string[];
	duration?: number | string;
	startDate?: string;
	endDate?: string;
	slotsLeft?: number;
	selectionTypes?: ApiSelectionType[];
	coverPhoto?: string;
	slug?: string;
	tourType?: string;
	about?: string;
	inclusions?: string[] | string;
	contact?: ApiTourContact;
	itinerary?: ApiTourItinerary;
};

type ApiVisaPackage = {
	id?: string;
	name?: string;
	country?: string;
	visaFormat?: string;
	slug?: string;
	type?: string;
	validity?: string;
	price?: number;
	currency?: string;
	image?: string;
	description?: string;
	processingTime?: string;
	requirements?: string[];
	requiredDocuments?: string[] | string;
	supportPhone?: string;
	supportEmail?: string;
	terms?: string;
	priceNote?: string;
};

type ApiHomepage = {
	hero_section?: string;
	hero_section_mobile?: string;
	hero_banner_text?: string;
	ads?: string[];
};

type ApiCarServicePrice = {
	serviceType?: unknown;
	price?: unknown;
};

type ApiCar = {
	_id?: unknown;
	id?: unknown;
	name?: unknown;
	plateNumber?: unknown;
	availabilityStatus?: unknown;
	category?: unknown;
	color?: unknown;
	image?: unknown;
	isActive?: unknown;
	year?: unknown;
	servicePrices?: unknown;
	isAvailableForDate?: unknown;
};

export type ApiGalleryFolder = {
	folder_title: string;
	category: string;
	images: string[];
};

export type HomepageData = {
	heroSection: string;
	heroSectionMobile: string;
	heroBannerText: string;
	ads: AdData[];
};

function buildUrl(path: string) {
	return new URL(path, API_BASE_URL).toString();
}

function isCacheableMethod(method: RequestInit["method"]) {
	if (!method) return true;

	const normalizedMethod = method.toUpperCase();
	return normalizedMethod === "GET" || normalizedMethod === "HEAD";
}

async function quantumFetch<T>(
	path: string,
	init?: QuantumFetchInit,
): Promise<T> {
	const shouldCache =
		isCacheableMethod(init?.method) && init?.cache !== "no-store";
	const nextOptions = shouldCache
		? {
				revalidate: init?.next?.revalidate ?? API_READ_REVALIDATE_SECONDS,
				tags: Array.from(new Set([API_CACHE_TAG, ...(init?.next?.tags ?? [])])),
			}
		: undefined;

	const response = await fetch(buildUrl(path), {
		...init,
		cache: shouldCache
			? (init?.cache ?? "force-cache")
			: (init?.cache ?? "no-store"),
		...(nextOptions ? { next: nextOptions } : {}),
		headers: {
			Accept: "application/json",
			...init?.headers,
		},
	});

	const text = await response.text();
	let data: unknown = null;

	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			if (!response.ok) {
				throw new Error(
					`The Quantum API request failed with status ${response.status}.`,
				);
			}

			throw new Error("The Quantum API returned an invalid JSON response.");
		}
	}

	if (!response.ok) {
		const responseMessage =
			data && typeof data === "object" && "message" in data
				? (data as { message?: unknown }).message
				: undefined;
		const message =
			typeof responseMessage === "string"
				? responseMessage
				: "The Quantum API request failed.";
		throw new Error(message);
	}

	return data as T;
}

function normalizeBackendPayload(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(normalizeBackendPayload);
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, nestedValue]) => [
				key,
				BACKEND_PHONE_FIELDS.has(key)
					? String(nestedValue ?? "").trim()
					: normalizeBackendPayload(nestedValue),
			]),
		);
	}

	return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function asString(value: unknown) {
	return typeof value === "string" ? value.trim() : "";
}

function trimUrl(value: string | undefined, fallback: string) {
	const trimmed = value?.trim();
	return trimmed || fallback;
}

function isPlaceholderValue(value: string) {
	const normalized = value.trim().toLowerCase();
	return (
		normalized === "string" ||
		normalized === "null" ||
		normalized === "undefined"
	);
}

function normalizeId(value: string | undefined, fallbacks: string[]) {
	const trimmed = value?.trim();
	if (trimmed && !isPlaceholderValue(trimmed)) {
		return trimmed;
	}

	return (
		fallbacks
			.map((fallback) => fallback.trim())
			.filter((fallback) => !isPlaceholderValue(fallback))
			.find(Boolean) ?? ""
	);
}

function normalizeStringList(value: string[] | string | undefined) {
	if (Array.isArray(value)) {
		return value.map((item) => item.trim()).filter(Boolean);
	}

	if (typeof value === "string") {
		return value
			.split("\n")
			.map((item) => item.replace(/^-\s*/, "").trim())
			.filter(Boolean);
	}

	return [];
}

function normalizeCountryFlags(tour: ApiTourPackage) {
	const flags = tour.countryFlags ?? tour.countryFlag;

	if (Array.isArray(flags)) {
		return flags.map((flag) => flag.trim()).filter(Boolean);
	}

	return flags?.trim() ? [flags.trim()] : [];
}

function normalizeDuration(duration: ApiTourPackage["duration"]) {
	if (typeof duration === "number") {
		return `${duration} Days/Nights`;
	}

	return duration?.trim() || "";
}

function normalizeCurrency(value: string | undefined): Currency | null {
	if (SUPPORTED_CURRENCIES.includes(value as Currency)) {
		return value as Currency;
	}

	return null;
}

function normalizeSelectionType(
	value: string | undefined,
): SelectionType | null {
	if (SUPPORTED_SELECTION_TYPES.includes(value as SelectionType)) {
		return value as SelectionType;
	}

	return null;
}

function normalizeSelectionTypes(
	selectionTypes: ApiSelectionType[] | undefined,
): SelectionPrice[] {
	if (!Array.isArray(selectionTypes)) return [];

	return selectionTypes
		.map((selection) => {
			const type = normalizeSelectionType(selection.type);
			if (!type) return null;

			const prices = (selection.prices ?? [])
				.map((price) => {
					const currency = normalizeCurrency(price.currency);
					if (!currency || typeof price.amount !== "number") return null;

					return {
						currency,
						label: price.label?.trim() || currency,
						amount: price.amount,
					};
				})
				.filter((price): price is SelectionPrice["prices"][number] =>
					Boolean(price),
				);

			return {
				type,
				label: selection.label?.trim() || type.replaceAll("_", " "),
				prices,
			};
		})
		.filter((selection): selection is SelectionPrice => Boolean(selection));
}

function normalizeContact(contact: ApiTourContact | undefined): TourContact {
	if (typeof contact === "string") {
		const number = /Phone\s*:\s*(.+)/i.exec(contact)?.[1]?.trim() ?? "";
		const email = /Email\s*:\s*(.+)/i.exec(contact)?.[1]?.trim() ?? "";

		return { number, email };
	}

	return {
		number: contact?.number?.trim() ?? "",
		email: contact?.email?.trim() ?? "",
	};
}

function normalizeItinerary(
	itinerary: ApiTourItinerary | undefined,
): TourItinerary | null {
	if (!itinerary) return null;

	const dayActivities = normalizeStringList(itinerary.dayActivities);
	const itineraryImage = itinerary.itineraryImage?.trim();

	if (dayActivities.length === 0 && !itineraryImage) {
		return null;
	}

	return {
		dayActivities,
		...(itineraryImage ? { itineraryImage } : {}),
	};
}

function normalizeTourPackage(tour: ApiTourPackage): TourPackage {
	const tourType: TourType = tour.tourType === "cruise" ? "cruise" : "holiday";

	return {
		isActive: tour.isActive ?? true,
		isFeatured: tour.isFeatured ?? false,
		title: tour.title?.trim() || "Untitled tour",
		location: tour.location?.trim() || "",
		countryFlags: normalizeCountryFlags(tour),
		duration: normalizeDuration(tour.duration),
		startDate: tour.startDate?.trim() || "",
		endDate: tour.endDate?.trim() || "",
		slotsLeft: tour.slotsLeft,
		selectionTypes: normalizeSelectionTypes(tour.selectionTypes),
		coverPhoto: trimUrl(tour.coverPhoto, "/home/tourImage.jpg"),
		slug: tour.slug?.trim() || "",
		tourType,
		about: tour.about?.trim() || "",
		inclusions: normalizeStringList(tour.inclusions),
		contact: normalizeContact(tour.contact),
		itinerary: normalizeItinerary(tour.itinerary),
		id: normalizeId(tour.id, [
			tour.slug ?? "",
			tour.title ?? "",
			tour.location ?? "",
		]),
	};
}

function normalizeVisaPackage(visa: ApiVisaPackage): VisaType {
	return {
		id: normalizeId(visa.id, [
			visa.slug ?? "",
			visa.name ?? "",
			visa.country ?? "",
		]),
		name: visa.name?.trim() || "Untitled visa",
		country: visa.country?.trim() || "",
		visaFormat: visa.visaFormat?.trim() || "",
		slug: visa.slug?.trim() || "",
		type: visa.type?.trim() || "",
		validity: visa.validity?.trim() || "",
		price: typeof visa.price === "number" ? visa.price : 0,
		currency: visa.currency?.trim() || "",
		image: trimUrl(visa.image, "/ourServices/visa/visaCountries.jpg"),
		description: visa.description?.trim() || "",
		processingTime: visa.processingTime?.trim() || "",
		requirements: Array.isArray(visa.requirements) ? visa.requirements : [],
		requiredDocuments: normalizeStringList(visa.requiredDocuments),
		supportPhone: visa.supportPhone?.trim() || "",
		supportEmail: visa.supportEmail?.trim() || "",
		terms: visa.terms?.trim() || "",
		priceNote: visa.priceNote?.trim() || "",
	};
}

function normalizeAds(ads: string[] | undefined): AdData[] {
	if (!Array.isArray(ads)) return [];

	return ads
		.map((image, index) => {
			const trimmedImage = image.trim();
			if (!trimmedImage || isPlaceholderValue(trimmedImage)) return null;

			return {
				id: String(index + 1),
				image: trimmedImage,
				link: "#",
			};
		})
		.filter((ad): ad is AdData => Boolean(ad));
}

function normalizeGalleryFolder(folder: ApiGalleryFolder): GalleryFolder {
	return {
		folderTitle: folder.folder_title?.trim() || "Untitled folder",
		category: folder.category?.trim() || "Uncategorized",
		images: Array.isArray(folder.images)
			? folder.images
					.map((image) => image.trim())
					.filter((image) => image && !isPlaceholderValue(image))
			: [],
	};
}

export async function getHomepageData(): Promise<HomepageData> {
	const data = await quantumFetch<ApiHomepage>("/v1/site/homepage");
	const heroSection = asString(data.hero_section);

	return {
		heroSection,
		heroSectionMobile: asString(data.hero_section_mobile) || heroSection,
		heroBannerText: asString(data.hero_banner_text),
		ads: normalizeAds(data.ads),
	};
}

export async function getTourPackages(
	tourType: TourType,
): Promise<TourPackage[]> {
	const data = await quantumFetch<ApiTourPackage[]>(
		`/v1/site/tour-packages/${tourType}`,
	);

	return data.map(normalizeTourPackage).filter((tour) => tour.isActive);
}

export async function getFeaturedTourPackages(): Promise<TourPackage[]> {
	const packages = await Promise.all([
		getTourPackages("holiday"),
		getTourPackages("cruise"),
	]);

	return packages.flat().filter((tour) => tour.isFeatured);
}

export async function getTourPackageById(
	tourType: TourType,
	tourID: string,
): Promise<TourPackage | undefined> {
	const data = await quantumFetch<ApiTourPackage>(
		`/v1/site/tour-packages/${tourType}/${encodeURIComponent(tourID)}`,
	);

	return normalizeTourPackage(data);
}

export async function getTourPackageBySlug(
	tourType: TourType,
	slug: string,
): Promise<TourPackage | undefined> {
	const tours = await getTourPackages(tourType);
	const listTour = tours.find((tour) => tour.slug === slug);

	if (!listTour) return undefined;

	return getTourPackageById(tourType, listTour.id);
}

export async function getVisaPackages(): Promise<VisaType[]> {
	const data = await quantumFetch<ApiVisaPackage[]>("/v1/site/visa-packages");
	return data.map(normalizeVisaPackage);
}

export async function getVisaPackageById(
	visaID: string,
): Promise<VisaType | undefined> {
	const data = await quantumFetch<ApiVisaPackage>(
		`/v1/site/visa-packages/${encodeURIComponent(visaID)}`,
	);

	return normalizeVisaPackage(data);
}

export async function getVisaBySlug(
	slug: string,
): Promise<VisaType | undefined> {
	const visas = await getVisaPackages();
	return visas.find((visa) => visa.slug === slug);
}

export async function getGalleryFolders(): Promise<GalleryFolder[]> {
	const data = await quantumFetch<ApiGalleryFolder[]>("/v1/site/gallery");

	return Array.isArray(data) ? data.map(normalizeGalleryFolder) : [];
}

export async function postQuantumApi<TPayload>(
	path: string,
	payload: TPayload,
) {
	const backendPayload = normalizeBackendPayload(payload);
	const response = await quantumFetch<{
		status?: boolean;
		message?: string;
		data?: unknown;
	}>(path, {
		method: "POST",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(backendPayload),
	});

	if (response.status === false) {
		throw new Error(
			response.message || "The Quantum API rejected the request.",
		);
	}

	return {
		ok: true,
		message: response.message || "Submitted successfully.",
	};
}

export async function postQuantumFormData(path: string, payload: FormData) {
	const response = await quantumFetch<{
		status?: boolean;
		message?: string;
		data?: unknown;
	}>(path, {
		method: "POST",
		cache: "no-store",
		body: payload,
	});

	if (response.status === false) {
		throw new Error(
			response.message || "The Quantum API rejected the request.",
		);
	}

	return {
		ok: true,
		message: response.message || "Submitted successfully.",
	};
}

function normalizeCarServicePrice(
	servicePrice: ApiCarServicePrice,
): Car["servicePrices"][number] {
	return {
		serviceType: asString(servicePrice.serviceType),
		price: typeof servicePrice.price === "number" ? servicePrice.price : 0,
	};
}

function normalizeCar(car: unknown): Car {
	const value = isRecord(car) ? (car as ApiCar) : {};
	const availabilityStatus =
		value.availabilityStatus === "available" ? "available" : "unavailable";

	return {
		id: asString(value._id) || asString(value.id),
		name: asString(value.name) || "Untitled Vehicle",
		plateNumber: asString(value.plateNumber),
		availabilityStatus,
		category: asString(value.category),
		color: asString(value.color),
		image: asString(value.image) || "/ourServices/carServices/car.jpg",
		isActive: typeof value.isActive === "boolean" ? value.isActive : true,
		year: typeof value.year === "number" ? value.year : 0,
		servicePrices: Array.isArray(value.servicePrices)
			? value.servicePrices
					.filter(isRecord)
					.map((sp) => normalizeCarServicePrice(sp))
			: [],
		isAvailableForDate:
			typeof value.isAvailableForDate === "boolean"
				? value.isAvailableForDate
				: undefined,
	};
}

export async function getCarsAvailability(
	serviceType: string,
	date: string,
): Promise<Car[]> {
	const response = await quantumFetch<unknown>(
		`/v1/site/car-services/cars/availability?serviceType=${encodeURIComponent(
			serviceType,
		)}&date=${encodeURIComponent(date)}`,
		{ cache: "no-store" },
	);

	const cars =
		isRecord(response) && "data" in response ? response.data : response;

	return Array.isArray(cars) ? cars.map(normalizeCar) : [];
}

export async function verifyCarPayment(
	reference: string,
): Promise<{ ok: boolean; message: string; data?: unknown }> {
	try {
		const response = await quantumFetch<{
			status?: boolean;
			message?: string;
			data?: unknown;
		}>(
			`/v1/site/car-services/payment/verify/${encodeURIComponent(reference)}`,
			{ cache: "no-store" },
		);

		return {
			ok: response.status !== false,
			message: response.message || "Payment verified successfully.",
			data: response.data,
		};
	} catch (error) {
		return {
			ok: false,
			message:
				error instanceof Error ? error.message : "Payment verification failed.",
		};
	}
}

export async function postQuantumApiWithData<TPayload, TData>(
	path: string,
	payload: TPayload,
): Promise<{ ok: boolean; message: string; data?: TData }> {
	const backendPayload = normalizeBackendPayload(payload);
	const response = await quantumFetch<{
		status?: boolean;
		message?: string;
		data?: TData;
	}>(path, {
		method: "POST",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(backendPayload),
	});

	if (response.status === false) {
		throw new Error(response.message || "Please try again.");
	}

	return {
		ok: true,
		message: response.message || "Submitted successfully.",
		data: response.data,
	};
}
