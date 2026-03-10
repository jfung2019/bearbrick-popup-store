# BE@RBRICK Pop-up Store

A modern e-commerce storefront built with Next.js 15 (App Router), TypeScript, and WooCommerce REST API integration, featuring internationalization and persistent cart management.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Recent Improvements](#recent-improvements)
- [Setup](#setup)
- [Architecture & Logic](#architecture--logic)
- [Project Structure](#project-structure)
- [Things to Note](#things-to-note)
- [Future Improvements](#future-improvements)

---

## Recent Improvements

### Code Quality & Architecture (Latest Update)

#### 1. Centralized Configuration
- **Created `lib/config.ts`**: Single source of truth for app-wide constants
  - Currency settings (code, symbol, locale)
  - Product display settings (items per page, image sizes)
  - Cart constraints (min/max quantity, storage key)
  - Cache revalidation intervals
  - API timeouts and retry logic
- **Benefits**: Easier maintenance, consistent values across components, no magic numbers

#### 2. Custom Cart Hook
- **Created `hooks/useCart.ts`**: Consolidated Zustand selectors into reusable hook
  - Provides clean API: `{ items, totalItems, subtotal, isEmpty, addItem, removeItem, updateQuantity, clearCart }`
  - Includes action feedback system (success/error messages)
  - Exposes raw actions for cases without feedback
- **Benefits**: Reduced code duplication, better performance, easier testing

#### 3. Enhanced Input Validation
- **Updated `store/useCartStore.ts`**: Added quantity validation
  - Prevents adding items beyond max quantity (99)
  - Validates quantity updates (0-99 range)
  - Console warnings for invalid operations
  - State unchanged on validation failures
- **Benefits**: Prevents cart corruption, better UX, clearer debugging

#### 4. Bug Fixes
- **Fixed language switcher path handling**: Replaced simple string replace with regex
  - Old: `pathname.replace(\`/${locale}\`, "")` (breaks on paths like `/en/english-tea`)
  - New: `pathname.replace(new RegExp(\`^/${locale}\`), "")` (only matches at path start)
- **Improved error logging**: Products page now logs detailed error messages instead of silently failing

#### 5. Component Updates
- All cart components migrated to use `useCart` hook
- All currency displays use `APP_CONFIG.currency.symbol`
- Products page uses `APP_CONFIG.products.perPage` and cache settings
- Quantity controls now disable at min/max limits

#### 6. China GFW Compliance (Font Refactoring)
- **Created `lib/fonts.ts`**: Self-hosted local fonts configuration
  - Migrated from `next/font/google` to `next/font/local`
  - All fonts served from `/public/fonts/` (no external CDN requests)
  - China-optimized system font fallbacks: PingFang SC, Hiragino Sans GB, Microsoft YaHei
- **Updated `next.config.ts`**: Disabled `optimizeFonts` to prevent Google API calls
- **Updated `app/globals.css`**: Font variables include complete China-safe fallback stack
- **Benefits**: 100% GFW-compliant, faster load times in China, no external dependencies

---

## Tech Stack

### Frontend Framework
- **Next.js 15** (App Router) - React-based framework with server components
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library built on Radix UI
- **class-variance-authority** - Managing component variants
- **tailwind-merge** - Merging Tailwind classes efficiently

### State Management
- **Zustand** - Lightweight state management for shopping cart
- **Zustand persist middleware** - Persist cart state to localStorage

### Internationalization
- **next-intl** - i18n routing and translations (English & Chinese)

### Backend Integration
- **WooCommerce REST API** - Product catalog and order management
- **Basic Authentication** - Secure API access via consumer key/secret

### Payment (Placeholder)
- **Airwallex** - Payment gateway integration (to be implemented)

---

## Setup

### Prerequisites
- Node.js 18.18.0 or higher
- npm or yarn package manager
- WordPress site with WooCommerce installed
- WooCommerce REST API credentials
- **Geist fonts** (self-hosted for China GFW compliance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bearbrick-popup-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Download and install fonts (REQUIRED)**
   
   Download Geist fonts from [Vercel Font](https://vercel.com/font) and place in `public/fonts/`:
   
   Required files:
   - `Geist-Regular.woff2`
   - `Geist-Medium.woff2`
   - `Geist-SemiBold.woff2`
   - `Geist-Bold.woff2`
   - `GeistMono-Regular.woff2`
   - `GeistMono-Medium.woff2`
   - `GeistMono-SemiBold.woff2`
   - `GeistMono-Bold.woff2`
   
   See [public/fonts/README.md](public/fonts/README.md) for detailed instructions.
   
   **Alternative**: Install via npm and copy files:
   ```bash
   npm install geist
   # Then copy .woff2 files from node_modules/geist/dist/fonts/ to public/fonts/
   ```

4. **Configure environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
   WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   **How to get WooCommerce credentials:**
   - Log in to your WordPress admin
   - Go to WooCommerce → Settings → Advanced → REST API
   - Click "Add key"
   - Set description, user, and permissions (Read/Write)
   - Copy the consumer key and secret

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

## Architecture & Logic

### Routing & Internationalization

**Middleware Layer** ([middleware.ts](middleware.ts))
- Intercepts all requests
- Determines user locale based on URL path, cookies, or Accept-Language header
- Redirects to localized routes (e.g., `/` → `/en` or `/zh`)

**i18n Configuration**
- [i18n/routing.ts](i18n/routing.ts) - Defines supported locales (`en`, `zh`) and routing behavior
- [i18n/request.ts](i18n/request.ts) - Loads message catalogs dynamically per locale
- [messages/en.json](messages/en.json) & [messages/zh.json](messages/zh.json) - Translation files

### WooCommerce Integration

**Client Library** ([lib/woocommerce.ts](lib/woocommerce.ts))

```
User Request → getProducts() → wooCommerceFetch()
                                    ↓
                    Build URL + Query Params
                                    ↓
                    Add Basic Auth Header
                                    ↓
                    Fetch WooCommerce API
                                    ↓
                    Parse & Return Typed Data
```

**Key Functions:**
- `wooCommerceFetch<T>()` - Generic fetch wrapper with auth and error handling
- `getProducts(query?)` - Fetch product list with optional filters
- `getProductBySlug(slug)` - Fetch single product by slug

**Authentication Flow:**
- Reads `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` from environment
- Encodes credentials as Base64
- Sends as `Authorization: Basic <encoded>` header

### Shopping Cart State Management

**Configuration** ([lib/config.ts](lib/config.ts))
- Centralized app-wide constants
- Currency settings (HKD, HK$)
- Cart limits (min: 1, max: 99)
- Product display settings
- Cache revalidation intervals

**Zustand Store** ([store/useCartStore.ts](store/useCartStore.ts))

```
Cart State (localStorage)
    ↓
    ├── items: CartItem[]
    ├── addItem(product, quantity)      ✨ Now includes validation
    ├── removeItem(productId)
    ├── updateQuantity(productId, quantity)  ✨ Now includes validation
    ├── clearCart()
    ├── getTotalItems()
    └── getSubtotal()
```

**Custom Hook** ([hooks/useCart.ts](hooks/useCart.ts))
- Consolidates Zustand selectors
- Provides clean cart API
- Returns: `{ items, totalItems, subtotal, isEmpty, addItem, removeItem, updateQuantity, clearCart }`
- Includes action feedback system
- Exposes `rawActions` for direct store access

**Persistence Strategy:**
- Uses Zustand's `persist` middleware
- Serializes `items` array to localStorage as JSON
- Key: Pulled from `APP_CONFIG.cart.storageKey` (`bearbrick-cart`)
- Automatically rehydrates on page load

**Cart Logic:**
- `addItem`: Validates quantity (1-99), merges if product exists, otherwise appends
- `updateQuantity`: Validates range (0-99), removes item if quantity = 0
- `getSubtotal`: Calculates `sum(price × quantity)` for all items
- **Input Validation**: Prevents invalid quantities, logs warnings, preserves state on errors

### Page Workflows

#### 1. Product Listing Flow

```
User visits /en/products
        ↓
Server Component renders
        ↓
getProducts() called (server-side)
        ↓
WooCommerce API fetch
        ↓
Product cards rendered
        ↓
User clicks "Add to cart" (client component)
        ↓
useCartStore.addItem() called
        ↓
Cart state updated + persisted to localStorage
```

**Components:**
- [app/[locale]/products/page.tsx](app/[locale]/products/page.tsx) - Server component, fetches products
- [components/cart/add-to-cart-button.tsx](components/cart/add-to-cart-button.tsx) - Client component, handles add-to-cart action

#### 2. Checkout Flow

```
User navigates to /en/checkout
        ↓
CheckoutPage renders
        ↓
├── CheckoutCartSummary (client component)
│   ├── Reads cart items from Zustand
│   ├── Renders item list with quantity controls
│   ├── Shows subtotal
│   └── Provides remove/clear actions
│
└── CheckoutPaymentSection (client component)
    ├── Reads cart items + subtotal
    ├── Calculates shipping (currently placeholder = 0)
    ├── Shows order total (subtotal + shipping)
    ├── Disables payment if cart is empty
    └── Renders Airwallex placeholder
```

**Components:**
- [app/[locale]/checkout/page.tsx](app/[locale]/checkout/page.tsx) - Main checkout page
- [components/cart/checkout-cart-summary.tsx](components/cart/checkout-cart-summary.tsx) - Cart summary with controls
- [components/cart/checkout-payment-section.tsx](components/cart/checkout-payment-section.tsx) - Payment section with totals

### Shipping Logic (Current State)

**Placeholder Implementation:**
- Shipping cost pulled from `APP_CONFIG.shipping.defaultCost` (currently `0`)
- Used in [components/cart/checkout-payment-section.tsx](components/cart/checkout-payment-section.tsx)
- Displays "TBD" as shipping value
- Order total = subtotal + 0

**Expected Implementation (Future):**
1. User enters shipping address (country, region, postcode)
2. Next.js API route queries WooCommerce shipping zones/methods
3. Returns calculated shipping cost
4. Updates checkout page with real shipping amount
5. Final total passed to payment gateway

---

## Project Structure

```
bearbrick-popup-store/
├── app/
│   ├── [locale]/                    # Localized routes
│   │   ├── layout.tsx               # Locale-specific layout wrapper
│   │   ├── page.tsx                 # Home page (links to products/checkout)
│   │   ├── products/
│   │   │   └── page.tsx             # Product listing + add-to-cart
│   │   └── checkout/
│   │       └── page.tsx             # Checkout flow
│   ├── layout.tsx                   # Root layout with fonts
│   ├── page.tsx                     # Root redirect to /en
│   └── globals.css                  # Global styles + Tailwind imports
│
├── components/
│   ├── cart/
│   │   ├── add-to-cart-button.tsx   # Client button for adding items
│   │   ├── checkout-cart-summary.tsx # Cart items + quantity controls
│   │   └── checkout-payment-section.tsx # Payment UI with totals
│   ├── language-switcher.tsx        # EN/ZH locale toggle button
│   └── ui/
│       ├── button.tsx               # shadcn/ui Button component
│       └── ...                      # Other shadcn components
│
├── hooks/
│   └── useCart.ts                   # ✨ Custom hook for cart state (new)
│
├── i18n/
│   ├── routing.ts                   # Locale configuration
│   └── request.ts                   # Message loader
│
├── lib/
│   ├── config.ts                    # ✨ Global app configuration (new)
│   ├── fonts.ts                     # ✨ Local font configuration (China-safe)
│   ├── woocommerce.ts               # WooCommerce REST API client
│   └── utils.ts                     # Utility functions (cn classname merger)
│
├── messages/
│   ├── en.json                      # English translations
│   └── zh.json                      # Chinese translations
│
├── public/
│   └── fonts/                       # ✨ Self-hosted fonts (REQUIRED)
│       ├── Geist-*.woff2            # Geist Sans font files
│       ├── GeistMono-*.woff2        # Geist Mono font files
│       └── README.md                # Font download instructions
│
├── store/
│   └── useCartStore.ts              # Zustand cart state + persistence
│
├── middleware.ts                    # next-intl routing middleware
├── .env.example                     # Environment variable template
├── next.config.ts                   # Next.js config (optimizeFonts: false)
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

---

## Things to Note

### Configuration Management
- **Centralized config:** All app constants in `lib/config.ts`
- **No magic numbers:** Currency, quantities, cache times pulled from config
- **Easy customization:** Change currency/limits in one place

### Self-Hosted Fonts (China GFW Compliance)
- **No external CDN requests:** All fonts loaded from `/public/fonts/`
- **Required setup:** Download Geist fonts and place in `public/fonts/` directory
- **System font fallbacks:** Automatically falls back to PingFang SC, Hiragino Sans GB, Microsoft YaHei
- **Verification:** Check Network tab in DevTools - no requests to `fonts.googleapis.com` or `fonts.gstatic.com`
- **Font files required:** See [public/fonts/README.md](public/fonts/README.md) for complete list

### Input Validation
- **Cart quantity limits:** Min 1, Max 99 (configurable in `APP_CONFIG.cart`)
- **Validation on add/update:** Invalid quantities rejected with console warnings
- **State preservation:** Cart state unchanged when validation fails
- **UI feedback:** Quantity buttons disabled at min/max limits

### Environment Variables
- **Server-side only:** `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET`
  - Never exposed to browser
  - Used in `lib/woocommerce.ts` for API authentication
- **Public:** `NEXT_PUBLIC_WORDPRESS_URL`
  - Accessible in both server and client code
  - Used to construct API endpoints

### Cart Persistence
- Cart data persists across page refreshes via localStorage
- Key: Configurable via `APP_CONFIG.cart.storageKey` (default: `bearbrick-cart`)
- If user clears browser data, cart will be lost
- No server-side cart storage (stateless)

### Custom Hooks
- **useCart hook:** Recommended way to access cart state in components
- **Direct store access:** Use `cart.rawActions` when feedback not needed
- **Performance:** Hook consolidates selectors to reduce re-renders

### Locale Routing
- URLs must include locale prefix: `/en/products`, `/zh/checkout`
- Direct access to `/products` will redirect to `/en/products` (default locale)
- Locale is determined by URL → cookie → browser header

### WooCommerce API Caching
- Product fetches use Next.js revalidation (configured in `APP_CONFIG.cache`)
- Default: Products revalidate every 60 seconds
- Prevents excessive API calls on every request
- Adjust cache intervals in `lib/config.ts` if needed

### Component Boundaries
- **Server Components**: Pages, layout wrappers (default in App Router)
- **Client Components**: Cart interactions, payment UI (marked with `"use client"`)
- Server components can fetch data directly; client components use hooks/state

### Error Handling
- WooCommerce fetch errors are caught and displayed as UI messages
- Missing/invalid credentials throw readable error messages
- Products page shows error state if fetch fails

### Styling Approach
- Tailwind CSS for utility classes
- shadcn/ui for complex components (Button, etc.)
- Responsive design: `sm:`, `lg:` breakpoints used throughout
- Dark mode support inherited from Tailwind CSS v4 defaults

---

## Future Improvements

### High Priority

#### 1. Complete Airwallex Integration
- [ ] Install Airwallex SDK (`airwallex-payment-elements`)
- [ ] Create API route to generate payment intent: `app/api/payment/create-intent/route.ts`
- [ ] Mount Airwallex Drop-in or Elements in checkout payment section
- [ ] Handle successful payment callback
- [ ] Create WooCommerce order after payment confirmation

**Implementation Steps:**
```typescript
// Server: app/api/payment/create-intent/route.ts
// - Read cart items from request body
// - Calculate total (subtotal + shipping)
// - Call Airwallex API to create payment intent
// - Return client_secret to frontend

// Client: components/cart/checkout-payment-section.tsx
// - Replace placeholder with Airwallex Drop-in component
// - Pass client_secret from API
// - Handle onSuccess callback
// - Submit order to WooCommerce
```

#### 2. Real Shipping Calculation
- [ ] Fetch WooCommerce shipping zones via REST API
- [ ] Create shipping address form (country, region, postcode)
- [ ] Calculate shipping based on cart weight/dimensions
- [ ] Support multiple shipping methods (flat rate, free shipping, carrier rates)
- [ ] Update order total dynamically

**API Endpoint:**
```
POST /api/shipping/calculate
Body: { country, state, postcode, cartItems }
Response: { shippingMethods: [{ id, label, cost }] }
```

#### 3. Order Management
- [ ] Create WooCommerce orders via REST API after payment
- [ ] Store order confirmation details
- [ ] Send order confirmation email (via WooCommerce)
- [ ] Display order history page for users
- [ ] Implement order tracking

### Medium Priority

#### 4. Enhanced Product Features
- [ ] Product detail pages (`/products/[slug]`)
- [ ] Product variations (size, color) support
- [ ] Product search and filtering
- [ ] Product categories/collections
- [ ] Related products recommendations
- [ ] Stock status indicators

#### 5. User Authentication
- [ ] WooCommerce customer authentication
- [ ] User profile management
- [ ] Saved addresses
- [ ] Order history per user
- [ ] Wishlist functionality

#### 6. Cart Improvements
- [ ] Mini cart dropdown in header (persistent across pages)
- [ ] Cart item quantity limits
- [ ] Apply coupon/discount codes
- [ ] Estimated delivery date display
- [ ] "Save for later" functionality

#### 7. Performance Optimizations
- [ ] Implement incremental static regeneration (ISR) for product pages
- [ ] Add image optimization with Next.js Image component
- [ ] Lazy-load product images
- [ ] Implement infinite scroll for product listing
- [ ] Add loading skeletons for better UX

### Low Priority

#### 8. Analytics & Tracking
- [ ] Google Analytics integration
- [ ] E-commerce tracking (add-to-cart, purchase events)
- [ ] Heatmap/user behavior tracking
- [ ] A/B testing framework

#### 9. Additional Features (todo)
- [ ] Multi-currency support
  - **Current State**: Currency hardcoded in `lib/config.ts` (HKD)
  - **Requirement**: Currency must match WooCommerce store settings
  - **When to implement dynamic currency**:
    - Managing multiple stores with different currencies
    - Using WooCommerce multi-currency plugins
    - Currency changes frequently
  - **Implementation options**:
    - Fetch from WooCommerce `/settings/general` API
    - Use multi-currency plugin (WPML, Aelia Currency Switcher)
    - Add currency switcher with conversion API
- [ ] Guest checkout option
- [ ] Product reviews and ratings
- [ ] Social sharing buttons
- [ ] Email subscription newsletter
- [ ] Live chat support integration

#### 10. DevOps & Monitoring
- [ ] Set up CI/CD pipeline
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Unit tests for cart logic and utilities
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] API rate limiting and caching strategies

---

## API Reference

### WooCommerce Endpoints Used

#### Get Products
```http
GET /wp-json/wc/v3/products
Authorization: Basic <base64(consumer_key:consumer_secret)>

Query Parameters:
- per_page: number (default: 12)
- status: "publish" | "draft"
- category: number (category ID)
- search: string (search term)
```

#### Get Single Product
```http
GET /wp-json/wc/v3/products?slug={slug}
Authorization: Basic <base64(consumer_key:consumer_secret)>
```

### Future API Routes (To Implement)

#### Calculate Shipping
```http
POST /api/shipping/calculate
Content-Type: application/json

{
  "country": "HK",
  "state": "Hong Kong",
  "postcode": "999077",
  "items": [{ "productId": 123, "quantity": 2 }]
}

Response:
{
  "methods": [
    { "id": "flat_rate", "label": "Flat Rate", "cost": 50 }
  ]
}
```

#### Create Payment Intent
```http
POST /api/payment/create-intent
Content-Type: application/json

{
  "amount": 1299.00,
  "currency": "HKD",
  "items": [...]
}

Response:
{
  "client_secret": "pi_xxx_secret_xxx",
  "intent_id": "int_xxx"
}
```

#### Create Order
```http
POST /api/orders/create
Content-Type: application/json

{
  "payment_intent_id": "int_xxx",
  "billing": {...},
  "shipping": {...},
  "line_items": [...]
}

Response:
{
  "order_id": 456,
  "order_key": "wc_order_xxx"
}
```

---

## Troubleshooting

### WooCommerce API Not Working
- Verify WordPress site is accessible
- Check consumer key/secret are correct in `.env.local`
- Ensure WooCommerce REST API is enabled
- Check WordPress permalink structure (must not be "Plain")
- Verify CORS settings if calling from different domain

### Cart Not Persisting
- Check browser localStorage is enabled
- Verify localStorage key `bearbrick-cart` exists in DevTools
- Clear cache and hard refresh if issues persist

### Locale Routing Issues
- Ensure middleware matcher pattern is correct
- Check `i18n/routing.ts` locale configuration
- Verify message files exist for all defined locales

### Build Errors
- Run `npm run lint` to check for type/lint errors
- Ensure all environment variables are defined
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

[Add your license here]

---

## Support

For issues and questions, please create an issue in the repository.
