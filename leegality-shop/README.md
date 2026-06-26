# Leegality Frontend Assessment — Product Listing App

Amazon-style e-commerce product listing and detail application built for the Leegality Frontend Engineer Assessment.

---

## Setup Instructions

**Prerequisites:** Node.js 18+

```bash
cd leegality-shop
npm install
npm run dev
# → http://localhost:5173

# Type-check
npx tsc --noEmit

# Production build
npm run build && npm run preview
```

---

## Tech Stack

| Tool | Version | Reason |
|---|---|---|
| React | 18 | Functional components, concurrent features |
| TypeScript | 5 | Type safety, self-documenting code |
| Vite | 6 | Sub-second HMR, modern build tooling |
| React Router | 6 | URL-based routing and filter state sync |
| Tailwind CSS | 4 | Utility-first, no runtime overhead |

---

## Architectural Decisions

### 1. Filter State Lives in the URL

All filter state (category, price range, brands, search, page) is encoded in URL search params via React Router's `useSearchParams`. This approach:

- Solves the "filters persist on back navigation" requirement for free — navigating to a product detail page and pressing Back returns to the exact same URL with all filters intact.
- Makes filter states deep-linkable and shareable.
- Eliminates the need for Redux or any external state library.

### 2. Hybrid API + Client-Side Filtering

The DummyJSON API supports server-side category filtering and search, but not price range or brand filtering. Strategy:

- **Category selected** → `GET /products/category/{slug}` (server-side, efficient)
- **Search query** → `GET /products/search?q=...` (server-side)
- **No category/search** → `GET /products?limit=200` (fetch all once)
- **Price range + Brand** → applied client-side via `useMemo` on the fetched result set
- **Pagination** → client-side slice of the filtered result (12 per page)

This gives instant combined filtering without extra network calls on each filter change.

### 3. Custom Hook Architecture

Business logic is fully separated from UI:

- `useProducts(filters)` — fetches, filters, paginates, exposes loading/error/retry
- `useProductDetail(id)` — fetches single product
- `useCategories()` — fetches category list once on mount
- `FilterContext` — bridges URL search params to typed `FilterState` consumed by all components

Pages are thin orchestrators; components are purely presentational.

### 4. Skeleton Loading over Spinners

Product card skeletons match the layout of real cards, giving users a sense of the forthcoming content — same pattern Amazon uses for perceived performance.

### 5. Responsive Sidebar

- **Desktop (lg+):** Persistent left sidebar, sticky below the navbar
- **Mobile:** Slide-in drawer with backdrop, triggered by a "Filters" button

---

## Assumptions Made

1. **Brand nullability** — DummyJSON's API returns `null` brand for some products. These are excluded from the brand filter list silently.
2. **All products fetched upfront** — The full DummyJSON catalog is ~194 products. Fetching all with `limit=200` enables instant client-side filtering without per-filter API round trips.
3. **Image gallery** — The detail page shows all images from the `images[]` array. Products with only a `thumbnail` fall back to displaying that image.
4. **Pagination size** — 12 products per page fills a 4-column grid evenly on desktop.
5. **Search priority** — When a search query is active, it takes precedence over the category filter (using the `/search` endpoint), since combining both would require client-side post-filtering which the API doesn't support natively.

---

## Project Structure

```
src/
├── api/            # Centralized API layer
├── components/
│   ├── common/     # Navbar, StarRating, Pagination, Skeletons, Error/Empty states
│   ├── filters/    # CategoryFilter, PriceRangeFilter, BrandFilter, FilterPanel
│   └── products/   # ProductCard, ProductGrid
├── context/        # FilterContext with URL search param sync
├── hooks/          # useProducts, useProductDetail, useCategories
├── pages/          # ProductListingPage, ProductDetailPage
├── types/          # TypeScript interfaces
└── utils/          # Client-side filter logic, pagination helpers
```

---

## Improvements Given More Time

1. **React Query** — Replace manual fetch/useEffect with caching, background refetch, and deduplication.
2. **Virtualized list** — `@tanstack/react-virtual` for large catalogs to only render visible cards.
3. **Cart with localStorage** — Persistent cart with optimistic add-to-cart animations.
4. **E2E tests** — Playwright covering: filter combinations, pagination reset, back-navigation filter persistence, detail page rendering.
5. **Unit tests** — Jest + RTL for `applyClientFilters`, `useProducts` hook, and `FilterContext`.
6. **Sorting** — Price low→high/high→low, rating sort — trivially addable as a URL param.
7. **Error boundary** — React Error Boundary component for unexpected runtime crashes.
8. **Accessibility audit** — Full screen reader testing with NVDA/VoiceOver.
9. **Image optimization** — WebP via CDN proxy with `srcset` for responsive images.
10. **PWA / offline** — Service worker to cache the catalog for offline browsing.
