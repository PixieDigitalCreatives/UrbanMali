# Visual Parity Report

## Configuration & Standards
- **Baseline Branch / Tag**: `baseline-tsx-tailwind`
- **Current Branch**: `refactor/jsx-scss`
- **Tolerance Threshold**: `<= 0.15%` pixel difference (strict parity gate)
- **Environments**: Reduced motion emulation ON, deterministic seeds and local storage, animations disabled.
- **HTML Report**: `tests/visual/report/index.html`

## Phase 1 Pilot Summary (Foundations, Reset, SCSS Architecture, Header & Footer Modules)
- **Status**: ✅ **PASSED** (148 / 148 screenshots within strict <= 0.15% tolerance)
- **Total Tested Routes**: 14 routes (Home, Services, Service Detail (all 6 slugs), Plans, Check Area (3 states), Booking (5 steps), Shop, Product Detail (2 products), Cart (2 states), Checkout (2 states), Order Confirmation, Coming Soon, 404 Not Found, Design System, Mobile Menu Open)
- **Breakpoints Tested**: 360px, 390px, 768px, 1024px, 1440px
- **Build Status**: `npm run build` cleanly passed in ~4.4s with 0 errors.

### Parity Gate Results Table (Sample across key routes & viewports)

| Route / State | 360px Diff % | 390px Diff % | 768px Diff % | 1024px Diff % | 1440px Diff % | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Home (`/`)** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Services (`/services`)** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Service: Plant Maintenance** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Service: Balcony Makeover** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Plans (`/plans`)** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Check Area: Default** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Check Area: Serviceable** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Check Area: Unserviceable** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Booking Step 1** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Booking Step 2** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Booking Step 3** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Booking Step 4** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0043% (65px) | 0.0031% (65px) | ✅ PASS |
| **Booking Step 5** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0043% (65px) | 0.0031% (65px) | ✅ PASS |
| **Shop (`/shop`)** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Shop Filtered Indoor** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Product: Money Plant** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Product: Snake Plant** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Cart with Items** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Cart Empty** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Checkout Default** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Checkout Error State** | 0.0013% (13px) | 0.0009% (10px) | 0.0020% (35px) | 0.0056% (116px) | 0.0026% (74px) | ✅ PASS |
| **Order Confirmation** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Coming Soon** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **404 Not Found** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Design System Spec** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | ✅ PASS |
| **Mobile Menu Open** | 0.0000% (0px) | 0.0000% (0px) | 0.0000% (0px) | N/A (desktop) | N/A (desktop) | ✅ PASS |

## Key Findings & Parity Solutions Discovered During Phase 1 Pilot
1. **CSS Grid `repeat(N, 1fr)` vs Tailwind's `repeat(N, minmax(0, 1fr))`**:
   - Tailwind defines `grid-cols-N` with `minmax(0, 1fr)`. Standard CSS `1fr` is shorthand for `minmax(auto, 1fr)`. If a grid column contains content whose min-content width exceeds 1fr (such as long contact text or address strings in the Footer), the column expands under standard CSS, shifting sibling columns. Setting `repeat(N, minmax(0, 1fr))` resolved this to exact 0.0000% pixel parity across all breakpoints.
2. **Explicit Line-Height in Typography**:
   - In Tailwind, text utilities (`text-sm`, `text-xs`) automatically bundle font-size and explicit line-height (`text-sm` -> `14px / 20px`, `text-xs` -> `12px / 16px`). In SCSS modules, all typography styles explicitly declare line-height to prevent inheriting browser defaults.
