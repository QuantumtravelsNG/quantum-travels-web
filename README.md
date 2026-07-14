# Quantum Travels

Quantum Travels is a Next.js website for corporate travel, holidays, visas, events, affiliate registration, and car services. Public travel content is rendered on the server from the Quantum API, while customer submissions are sent through Server Actions.

This README provides project initialization steps, an architecture guide, and the API usage.

## Tech Stack

- Next.js `16.2.2`
- React `19.2.4`
- TypeScript with strict mode
- Tailwind CSS v4
- Lucide icons
- `next/font/google` for the Jost font

## Initialize the Project

```bash
git clone <repository-url>
cd quantumtravels
npm ci
```

Create `.env.local`:

```env
QUANTUM_API_BASE_URL=https://quantum.tonyicon.com.ng
```

The URL above is also the code default. Environment files are ignored by Git.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Common commands:

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm start
npm run format
```

Production builds need access to Google Fonts for Jost and to the configured Quantum API because API-backed pages generate route data during the build.

## High-Level Architecture

The app follows the App Router model:

- Routes, layouts, metadata, redirects, and Server Actions live under `src/app`.
- Server Components fetch public content directly through `src/lib/quantum-api.ts`.
- Client Components call Server Actions in `src/app/actions.ts` for mutations and browser-dependent flows.
- `src/lib/quantum.ts` owns shared domain types and display helpers.
- `src/lib/mockdata.ts` contains only the local homepage advertising banners, this is used while pending the provision of live links for the advertisements from backend.
- Shared UI and feature components live under `src/components`.
- Static assets live under `public`.

`src/app/layout.tsx` loads the Jost font, global styles, `Navbar`, and `Footer`. Server Components are preferred; `"use client"` is limited to components that need state, effects, event handlers, portals, navigation, or browser storage.

## Directory Guide

```text
src/app
  App Router pages, layouts, metadata, redirects, and Server Actions.

src/components
  Shared layout components, page sections, forms, cards, dialogs, and
  feature-specific UI grouped by related pages.

src/components/ui
  Reusable Base UI and local Tailwind primitives.

src/lib/quantum-api.ts
  Quantum API requests, response normalization, cache settings, and mutations.

src/lib/quantum.ts
  Tour, visa, gallery, and car-service domain types and formatting helpers.

src/lib
  Location, phone, date, image, option, local ad, and utility helpers.

public
  Static images, SVGs, logos, favicons, and other assets.
```

## Main Routes

| Area           | Routes                                                                      | Data source                                 |
| -------------- | --------------------------------------------------------------------------- | ------------------------------------------- |
| Home           | `/`                                                                         | Homepage API plus local advertising content |
| Holidays       | `/services/book-holiday/package-holiday`, detail `[slug]`                   | Tour package API                            |
| Cruises        | `/services/book-holiday/cruises`, detail `[slug]`                           | Tour package API                            |
| Visas          | `/services/visa`, `/services/visa/[slug]`                                   | Visa API                                    |
| Gallery        | `/gallery`                                                                  | Gallery API                                 |
| Car services   | `/services/car-services`, pickup, dropoff, booking, and hire routes         | Availability, booking, and payment APIs     |
| Enquiries      | Contact, corporate travel, corporate event, affiliate, and newsletter forms | Server Actions to the API                   |
| Static content | About, services, and legal routes                                           | Local components and JSON                   |

`/services/airport-transfer` and the generic airport-transfer/car-service dynamic routes are still placeholder pages.

## API Usage

All external requests are centralized in `src/lib/quantum-api.ts`. The browser calls Server Actions in `src/app/actions.ts`; the project does not currently use local API route handlers.

- Base URL: `QUANTUM_API_BASE_URL`
- Default base URL: `https://quantum.tonyicon.com.ng`
- Content reads: cached and revalidated every 300 seconds
- Availability and payment verification: `no-store`
- Mutations: `POST` requests with `no-store`

### Read Endpoints

| Method | Endpoint                                           | Used by                                   |
| ------ | -------------------------------------------------- | ----------------------------------------- |
| GET    | `/v1/site/homepage`                                | Home hero and featured holiday packages   |
| GET    | `/v1/site/tour-packages/{type}`                    | Holiday/cruise listings and static params |
| GET    | `/v1/site/tour-packages/{type}/{id}`               | Holiday/cruise detail pages               |
| GET    | `/v1/site/visa-packages`                           | Visa listing and slug lookup              |
| GET    | `/v1/site/visa-packages/{id}`                      | Helper exists but is not currently called |
| GET    | `/v1/site/gallery`                                 | Gallery folders and images                |
| GET    | `/v1/site/car-services/cars/availability`          | Available cars by service type and date   |
| GET    | `/v1/site/car-services/payment/verify/{reference}` | Paystack return verification              |

### Mutation Endpoints

| Method | Endpoint                                     | Submission                                       |
| ------ | -------------------------------------------- | ------------------------------------------------ |
| POST   | `/v1/site/corporate-travel/submit-enquiry`   | Corporate travel enquiry                         |
| POST   | `/v1/site/visa-application/submit`           | Visa application                                 |
| POST   | `/v1/site/tour-package/book`                 | Holiday/cruise booking                           |
| POST   | `/v1/site/corporate-event/reserve`           | Corporate event reservation                      |
| POST   | `/v1/site/contact-support`                   | Contact form                                     |
| POST   | `/v1/site/newsletter-subscribe`              | Newsletter signup                                |
| POST   | `/v1/site/affiliate-registration`            | Affiliate registration with multipart CAC upload |
| POST   | `/v1/site/car-services/airport-pickup/book`  | Airport pickup booking and payment URL           |
| POST   | `/v1/site/car-services/airport-dropoff/book` | Airport dropoff booking and payment URL          |
| POST   | `/v1/site/car-services/car-hire/book`        | Car hire request                                 |

API responses are normalized before reaching components. Remote tour, visa, gallery, and vehicle images are rendered through `next/image`; `src/lib/images.ts` marks remote URLs as unoptimized.

## Component Conventions

Server Components are used for route composition, public API reads, metadata, and static parameter generation.

Client Components are used for:

- Navbar scroll state and mobile sheets
- Form state, validation, and submission feedback
- Dialogs, modals, and the image viewer portal
- Gallery filtering and carousel controls
- Car search state, `sessionStorage`, and Paystack redirects
- Client-side scrolling and navigation behavior

Shared UI conventions:

- Use `next/image` for images and `next/link` for internal navigation.
- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes.
- Use Lucide icons where an existing icon fits.
- Reuse `Button`, `Accordion`, `Sheet`, floating form fields (for input fields), and `SectionBadge` from `src/components/ui`.
- Keep `"use client"` on the smallest component that needs browser interactivity.

Reusable higher-level components include:

- `PageHero` and `PageCTA` for service pages
- `TourCard` and `TourDetailView` for package flows
- `ClickableImage` and `ImageViewer` for fullscreen media
- `SuccessDialog`, `BookingSuccessDialog`, and `SelectionTypeModal` for feedback flows

## Styling Conventions

Tailwind utility classes are used throughout. Global CSS and Tailwind v4 theme tokens live in `src/app/globals.css`; there is no separate Tailwind config file.

- The primary brand color is available through the `--primary` CSS variable.
- Existing components also use the brand purple `#9E328A`; prefer the shared token for new reusable UI.
- Common surfaces use `#f8f8f8`, `#f9f9f9`, or white.
- Common content widths are `max-w-[1440px]`, `max-w-[1244px]`, and `max-w-360`.
- Common horizontal spacing is `px-4 md:px-16` or `px-4 md:px-10`.
- The fixed navbar is `h-15 md:h-22`; top-level pages usually offset content with `pt-15 md:pt-22`.
- Common radii include `rounded-[8px]`, `rounded-[10px]`, `rounded-[12px]`, and `rounded-[999px]` for pill-shaped buttons.

Global helper classes:

- `.rounded-edge`: clipped package-detail header treatment
- `.image-mask`: car-services image mask
- `.clip-bg`: corporate-event background clip path

## Forms and User Flows

Customer-facing forms validate in the client, call Server Actions, display API errors inline, and show success dialogs when accepted.

- Contact support posts to `/v1/site/contact-support`.
- Newsletter signup posts a normalized email to `/v1/site/newsletter-subscribe`.
- Corporate travel posts enquiry details to `/v1/site/corporate-travel/submit-enquiry`.
- Visa applications include the selected visa ID and applicant/travel details.
- Holiday and cruise bookings include the tour ID, selection type, currency, guest count, and booking dates.
- Corporate event reservations validate dates and contact data on the server, then convert location codes to backend location values.
- Affiliate registration sends multipart form data and a CAC document. The UI accepts PDF, JPG, or PNG files up to 5 MB.
- Car hire submits grouped `{ carHireDetails, passengerDetails }` data and shows confirmation without a payment redirect.

Airport pickup/dropoff flow:

1. The reservation form searches the local `airports` package through a Server Action.
2. Search details are stored temporarily in `sessionStorage`.
3. The selection page requests live vehicle availability for the service type and date.
4. The booking form submits passenger and selected vehicle details.
5. The user is redirected to the Paystack URL returned by the API.
6. `/services/car-services` reads `reference` or `trxref`, verifies it through the API, and shows the result dialog.

Mutations should continue to use Server Actions. Validation that protects backend contracts must also run server-side rather than relying only on client checks.

## Assets

Static assets are grouped by feature:

- `public/home`
- `public/about`
- `public/assets`
- `public/contact`
- `public/affiliate`
- `public/ourServices`
- `public/favicon`

Reference public assets with root-relative paths:

```tsx
<Image src="/ourServices/visa/hero.jpg" alt="Visa services" fill />
```

The affiliate directory is currently spelled `affiliate`. Keep that path unless the directory and every reference are renamed together. Some existing filenames contain spaces; use hyphenated names for new assets.

The API can supply remote image URLs. `next.config.ts` currently allows Cloudinary images, while components use `isRemoteImage()` to opt remote sources out of Next.js optimization.

## Audit Findings

1. **Server-side validation is incomplete.** Corporate travel, visa, tour, contact, newsletter, and affiliate actions largely trust payloads already checked in the browser. Add server validation, field limits, and affiliate file type/size checks.
2. **Public mutations have no visible abuse controls.** Add backend rate limiting and bot protection for enquiry, subscription, registration, booking, and payment-verification traffic.
3. **API failures can take down server-rendered pages or builds.** API-backed pages and `generateStaticParams` do not provide fallbacks, and there is no route `error.tsx`. Add request timeouts and explicit error states; retry only safe GET requests.
4. **Payment success detection is permissive.** Verification treats a successful HTTP response as verified unless `status` is exactly `false`. Require an explicit paid or verified state from the backend.
5. **There are no automated tests.** Prioritize API normalizers, Server Action validation, payment verification, and car booking payloads.
6. **Placeholder routes remain.** Airport-transfer and generic dynamic airport-transfer/car-service routes should be implemented or removed from navigation and indexing.

## Verification

Verified on June 14, 2026:

- `npm run lint`: passed
- `npx tsc --noEmit`: passed
- `npm run build`: passed with network access to Google Fonts and the Quantum API

## Tooling and Workflow

- ESLint uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Prettier is available through `npm run format`.
- TypeScript runs in strict mode.
- There is no test runner or automated test suite yet.

Recommended workflow:

1. Identify the route in `src/app` and follow its component imports.
2. Check `src/lib/quantum-api.ts` for API reads or `src/app/actions.ts` for mutations.
3. Keep route pages as Server Components unless browser APIs or hooks are required.
4. Reuse shared components and preserve the existing responsive spacing conventions.
5. Run lint, type-checking, and a production build before pushing.


knt dev


