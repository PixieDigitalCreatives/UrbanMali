# UrbanMaali Codebase Map

Mapped on: `baseline-tsx-tailwind` branch before JSX + SCSS migration.

## 1. Project Architecture & Runtime
- **Framework**: Vite 6.2.0 + React 18.3.1 (Single Page App / Client-side routing)
- **Routing**: `react-router-dom` v6.29.0 via `<BrowserRouter>` in `src/App.tsx`
- **Build tool**: Vite + TypeScript (`tsc && vite build`)
- **Language**: TypeScript (`.ts`, `.tsx`) targeting ES2020
- **Styling Architecture**: Tailwind CSS v3.4.17 + PostCSS + Autoprefixer + custom utilities in `src/index.css`

## 2. Routes & Page Inventory
All routes defined in `src/App.tsx`:
| Route | Component | Purpose / Content |
|---|---|---|
| `/` | `src/pages/HomePage.tsx` | Hero with pincode search, trust strip, 6 service cards, How It Works (5 steps), plans overview, Who We Serve, FAQ accordion, CTA banner |
| `/services` | `src/pages/ServicesPage.tsx` | Full catalogue of 6 gardening services |
| `/services/:slug` | `src/pages/ServiceDetailPage.tsx` | Individual service detail, what's included/excluded, pricing, sticky booking bar |
| `/plans` | `src/pages/PlansPage.tsx` | Home & Society regular maintenance care plans with monthly/quarterly frequency toggles |
| `/shop` | `src/pages/ShopPage.tsx` | Botanical shop with category chips (indoor, outdoor, pots, soil) and product grid |
| `/shop/:slug` | `src/pages/ProductDetailPage.tsx` | Plant/product gallery, pot size selector, care tags, Add to Cart / Buy Now |
| `/cart` | `src/pages/CartPage.tsx` | Cart items, quantity steppers, price summary, delivery pincode, checkout CTA |
| `/checkout` | `src/pages/CheckoutPage.tsx` | Contact info, shipping address, slot picker, mock payment sheet (UPI/Card/COD) |
| `/orders/:id` | `src/pages/OrderConfirmationPage.tsx` | Order success receipt, tracking timeline, reference pill, summary |
| `/check-area` | `src/pages/CheckAreaPage.tsx` | Pincode availability check, serviceable zones listing, notify modal |
| `/book` | `src/pages/BookingPage.tsx` | 5-step interactive service booking wizard: Service -> Space -> Schedule -> Details -> Success |
| `/design-system` | `src/pages/DesignSystemPage.tsx` | Living brand swatch board, typography scale, buttons, badges, inputs, cards |
| `/portfolio`, `/about`, `/partner`, `/contact`, `/privacy-policy`, `/terms`, `/cancellation-refund`, `/service-terms` | `src/pages/ComingSoonPage.tsx` | Branded placeholder with notification input and back navigation |
| `*` | `src/pages/NotFoundPage.tsx` | 404 error page with Return Home CTA |

## 3. Component Hierarchy
### UI Primitives (`src/components/ui/`)
- `Badge.tsx`: Pill badges (`stock`, `out`, `soon`, `request`, `discount`, `default`)
- `BlobImage.tsx`: Organic botanical blob-masked photo with gold outline and "Illustrative image" attribution
- `Button.tsx`: Variants (`primary`, `secondary`, `outline`, `outline-white`, `tan`, `ghost`), sizes (`sm`, `md`, `lg`), fullWidth, pill/button radius
- `Card.tsx`: Card surface (`#FAF5EA`), sand border (`#E6D8BD`), subtle shadow, 20px radius
- `Chip.tsx`: Filter chips with selected active state for categories and tags
- `Input.tsx`: Styled text input with error message state, helper text, and icon adornments
- `LogoMark.tsx`: Botanical leaf sprig + UrbanMaali brand mark
- `Modal.tsx`: Accessible dialog with focus trap, backdrop click, and Escape listener
- `PincodeField.tsx`: Hero pincode checker container with embedded action button
- `SectionHeading.tsx`: Fraunces section title + Inter subtitle + optional eyebrow

### Cards (`src/components/cards/`)
- `PlanCard.tsx`: Regular care tier card with feature checkmarks and booking link
- `ProductCard.tsx`: Plant/item card with image, stock badge, price, and Add to Cart button
- `ServiceCard.tsx`: Service card with illustrative photo, duration, price, and tan arrow button

### Home Sections (`src/components/home/`)
- `TrustStrip.tsx`: 4 trust badges (Verified Maalis, Nursery Plants, Transparent Pricing, Doorstep Service)
- `HowItWorksSection.tsx`: 5-step journey with dotted connector lines, numbered circles, and sprout icons
- `WhoWeServeSection.tsx`: 5 customer segments (Apartments, Villas, Societies, Offices, Commercial)

### Layout (`src/components/layout/`)
- `Layout.tsx`: Shell containing `Header`, `main`, `Footer`, `BottomTabBar` (mobile), and `QuoteModal`
- `Header.tsx`: Desktop sticky navbar, logo, navigation links, cart badge count, and Book Service CTA
- `Footer.tsx`: Soil background (`#2B2118`), light logo, navigation links, pincode check, copyright
- `MobileMenu.tsx`: Slide-over drawer on mobile viewports
- `BottomTabBar.tsx`: Mobile fixed bottom navigation bar

### Common / Modals (`src/components/common/`)
- `QuoteModal.tsx`: Custom quote enquiry modal for society/commercial gardening

## 4. State Management, Context & Data
- `src/context/CartContext.tsx`: Cart state in `localStorage` (`cart_items`), item additions, deletions, quantities, total calculation
- `src/context/ToastContext.tsx`: Transient notification system for user feedback
- `src/data/`:
  - `areas.ts`: Delhi NCR pin code database and delivery feasibility
  - `faqs.ts`: Plant care and urban gardening FAQs
  - `plans.ts`: Maintenance packages
  - `products.ts`: Shop items
  - `services.ts`: 6 core gardening services
  - `siteConfig.ts`: Contact info, social links, opening hours
- `src/lib/`:
  - `api.ts`: Typed mock async service layer (`checkPincode`, `submitBooking`, `createOrder`, `submitQuote`, `getServiceBySlug`, `getProductBySlug`)
  - `storage.ts`: Safe browser localStorage reader/writer

## 5. Dependencies
- **Runtime**:
  - `react`: `^18.3.1`
  - `react-dom`: `^18.3.1`
  - `react-router-dom`: `^6.29.0`
  - `clsx`: `^2.1.1`
  - `tailwind-merge`: `^3.0.2`
  - `lucide-react`: `^0.475.0`
- **Development**:
  - `vite`: `^6.2.0`
  - `@vitejs/plugin-react`: `^4.3.4`
  - `typescript`: `^5.7.3`
  - `tailwindcss`: `^3.4.17`
  - `postcss`: `^8.5.3`
  - `autoprefixer`: `^10.4.20`
  - `@types/react`: `^18.3.18`
  - `@types/react-dom`: `^18.3.5`
- **Notable Absences**:
  - No Framer Motion installed in `package.json`
  - No Radix UI / shadcn installed (all primitives are custom handcrafted)
  - No React Hook Form / Zod installed (all forms use controlled React state)

## 6. Design System Tokens (Tailwind & CSS)
### Color Palette
- `soil`: `#2B2118` (Primary text, dark footer background)
- `brown`: `#5A4330` (Secondary headings, step numbers)
- `clay`: `#8B6B4A` (Muted labels, connector lines)
- `tan`: `#C9A87C` (Circular arrow buttons, highlights)
- `beige`: `#F4ECDD` (Page background)
- `card`: `#FAF5EA` (Card & input surface)
- `sand`: `#E6D8BD` (Dividers, borders)
- `moss`: `#3F5B34` (Primary brand green, buttons)
- `moss-hover`: `#5E7F4A`
- `sage`: `#A9BE8F`
- `sage-light`: `#DDE7CF` (Trust badge circles, focus ring)
- `leaf`: `#C8D96A` (Accent highlights)
- `brick`: `#A4432F` (Error states, out-of-stock badge)
- Semantic Badges:
  - In stock: bg `#DDE7CF`, text `#3F5B34`
  - Out of stock: bg `#F3D5D0`, text `#A4432F`
  - Coming soon: bg `#DCE6EE`, text `#3E5A73`
  - Price on request: bg `#F3E6B8`, text `#7A5C14`

### Typography
- Headings: `Fraunces`, `serif` (weights 400, 500, 600, 700; optical sizes 9..144)
- Body & UI: `Inter`, `sans-serif` (weights 400, 500, 600, 700)

### Radii
- `card`: `20px`
- `button`: `14px`
- `pincode`: `18px`
- `input`: `12px`
- `pill`: `999px`

### Shadows
- `card`: `0 8px 24px rgba(43, 33, 24, 0.08)`
- `lift`: `0 12px 32px rgba(43, 33, 24, 0.12)`
- `ring-sage`: `0 0 0 3px #DDE7CF`

### Breakpoints
- `sm`: `640px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1280px`
- `2xl`: `1536px`

## 7. Global CSS (`src/index.css`)
- Root CSS custom properties matching palette
- Baseline reset for body, heading font families, antialiasing
- `@keyframes botanical-sway` and `.animate-sway`
- `.blob-mask` and `.blob-outline`
- `.dotted-connector` and `.dotted-connector-vertical`
- Custom scrollbar rules

## 8. Existing Tests
- `playwright-tests/e2e-suite.js`: Playwright E2E suite testing homepage, hero pincode, services catalog, and responsive viewport sizing.
