# Offerss.com — Demo E-Commerce Storefront

An original, production-shaped e-commerce web app inspired by the general layout and UX
conventions of large online marketplaces. All branding, copy, and imagery are original
placeholders — **no Amazon logos, wordmarks, product photos, or copy are used anywhere.**

Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, Zustand for cart/
wishlist/orders state, and Firebase Phone Authentication for mobile-number login.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4 (CSS-variable based theme, see `src/app/globals.css`)
- Zustand (with `persist` middleware backed by `localStorage`) for cart / wishlist / orders
- Firebase Auth (Phone provider) for mobile-number sign-in
- lucide-react for icons

## Folder structure

```
src/
  app/                 Next.js routes (App Router)
    page.tsx           Homepage
    category/[slug]/   Category listing page
    search/            Search results page
    product/[id]/      Product detail page (id = product slug)
    cart/               Cart page
    checkout/           Multi-step checkout + confirmation
    account/            Account hub + login (phone OTP)
    orders/             Order history
    wishlist/           Saved items
    sitemap.ts          Generated sitemap.xml
    robots.ts           Generated robots.txt
    not-found.tsx       404 page
  components/          Reusable UI (Header, Footer, ProductCard, Carousel, etc.)
    ui/                 Small primitives (Button, Badge, RatingStars, PriceTag, MobileDrawer)
  store/               Zustand stores: cartStore, wishlistStore, ordersStore
  hooks/               useMediaQuery, useDebounce, useLocalStorage, usePhoneAuth
  data/                Mock catalog: categories.ts, products.ts (original placeholder data)
  lib/                 firebase.ts (Firebase app/auth initialization)
  types/               Shared TypeScript interfaces
  utils/               format.ts (price formatting, discount calc, class merge helper)
```

Mock data (`src/data`) is the only place that knows about "products" and "categories" as
static arrays — components consume typed data via functions like `getProductBySlug`,
`getProductsByCategory`, `searchProducts`. Swapping in a real backend means replacing the
contents of `src/data` (or the functions in it) with fetch calls; components do not need
to change.

## Running the project

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Enabling mobile-number (OTP) login

Phone login uses Firebase Authentication and works out of the box once you connect a
real Firebase project:

1. Create a project at https://console.firebase.google.com
2. Authentication → Sign-in method → enable **Phone**
3. Copy `.env.local.example` to `.env.local` and fill in your project's web app config:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```
4. Restart `npm run dev`. The `/account/login` page will now send real OTP codes via
   invisible reCAPTCHA (`src/hooks/usePhoneAuth.ts`, `src/components/LoginForm.tsx`).

Without these env vars, the login page still renders and explains that it's in demo
mode, so the rest of the app builds and runs without a Firebase project.

## Where to plug in real assets / data / services

| Placeholder | Location | Replace with |
|---|---|---|
| Logo | `src/components/Logo.tsx` | Real SVG/PNG logo asset |
| Brand colors | `src/app/globals.css` (`:root` custom properties) | Final brand palette |
| Product & category data | `src/data/products.ts`, `src/data/categories.ts` | Real catalog API |
| Product images | `placehold.co` URLs generated in `src/data/products.ts` | Real product photography (update `next.config.ts` `images.remotePatterns` accordingly) |
| Payment | `src/app/checkout/page.tsx` (`PAYMENT_METHODS`, "Place Order" handler) | Real payment provider (Stripe, etc.) — currently a mock, no card data is collected |
| Auth | `src/lib/firebase.ts`, `.env.local` | Real Firebase project credentials |
| Orders backend | `src/store/ordersStore.ts` | Real orders API instead of local persisted store |
| Delivery address indicator | `src/components/Header.tsx` ("Deliver to New York 10001") | Real geolocation / user address |
| Domain | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx` (`SITE_URL`) | Production domain |
| Favicon | `src/app/favicon.ico` | Real favicon |

## TODO before production launch

- [ ] Replace the placeholder SVG wordmark with a final logo file
- [ ] Confirm/update the brand color tokens in `globals.css`
- [ ] Replace all mock product/category data with a real product API
- [ ] Replace `placehold.co` product images with real photography
- [ ] Wire a real payment provider into checkout (no payment collection exists today)
- [ ] Connect a real Firebase project for phone login (see above)
- [ ] Replace the static "Deliver to" location with real geolocation/user address data
- [ ] Point `sitemap.ts` / `robots.ts` / metadata `SITE_URL` at the production domain
- [ ] Replace `favicon.ico` and social preview image
- [ ] Wire orders/cart/wishlist to a real backend instead of client-side localStorage
- [ ] Add analytics/monitoring as needed

## Notes

- This is a demo storefront: checkout does not process real payments, and phone login
  requires your own Firebase project to send real OTP codes.
- All product copy, brand names (e.g. "Northline", "Aurelle", "Kitchenly"), and images
  are original placeholder content created for this project.
# offers_webstie
