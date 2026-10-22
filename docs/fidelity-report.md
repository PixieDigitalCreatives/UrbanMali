# UrbanMaali Fidelity Report (Phase 0 & Phase 1)

This report audits every screen and component against the approved design board (`ui-reference-board-v2.png`) and the 13 reference crops in `design/reference-v2/`.

| Screen / Crop | Status | Matches | Intentional Deviations & Rationale |
| :--- | :--- | :--- | :--- |
| **01, 01a: Desktop Home Hero & Trust Strip** | Match | H1 two-line Fraunces layout, "From soil to sprout." eyebrow, organic blob-masked maali photo with 2px offset tan stroke and swaying leaf sprig, card pincode field with internal "Check Availability" button, moss & outline buttons, 4-column trust strip with 56px sage-light circle icons. | D1: Uses honest "Nursery partners" rather than unverified "Trusted nurseries". |
| **01b: Our Services & How It Works** | Match | 6 responsive service cards with 4:3 photo, title, price line, and 28px round tan arrow hover button; 5-step flow with numbered brown circles (1–5) and dotted connector line. | None. Exactly matches crop 01b. |
| **01c: Plans for Regular Care, Who We Serve & Footer** | Match | Two wide plan cards with photo at left (~38%), title, "Plan details coming soon", "Request a quote >" button; 5 audience tiles (Homes, Societies, Offices, Corporates, Malls); dark soil footer with light logo, 3 link columns, contact details, social links, legal links. | D5: Clean "Plan details coming soon" replaces garbled text on board crop. |
| **02: Mobile Home** | Match | Sticky mobile header with hamburger menu left and cart count badge right; sand-tinted hero block with brown H1; stacked pincode row; full-width pill CTAs; 4-column trust strip; 2-column services grid with moss badge overlapping image; vertical dotted timeline for How It Works. | D3: Menu at left, cart at right (board mistakenly showed two hamburgers). |
| **03: Mobile Service Detail (`/services/:slug`)** | Match | Back arrow, title "Service Details", cart badge; 4:3 photo with "Illustrative image" badge; Fraunces 22px title; price "From ₹749" with "Up to 20 pots" pill; duration card with clock icon; moss checkmarks for what's included; clay dots for what's not included; sticky bottom bar with flex-1 "Book this service" + 52px WhatsApp button. | D2: Duration and inclusions marked as placeholders pending client approval. |
| **04, 05: Mobile Booking & Success (`/book`)** | Match | 5-step stepper (28px circles joined by line); Step 2 property type chips, address, inline pincode check with instant feedback, locality, pot range select; Back/Next buttons; Step 5 review; Success "Request Received" with 72px leaf wreath moss check, `UM-YYMM-####` reference pill with copy button, form summary card, WhatsApp prefill button, multi-stage timeline. | Uses "Request" rather than "Confirmed" for transparency. |
| **06, 07: Shop & Product Detail (`/shop`, `/shop/:slug`)** | Match | Search input, filter trigger, horizontally scrollable category chips, 2-column product grid with 1:1 image, heart toggle, "In stock" badge, title, price; Product detail with 4 thumbnails, care icon trio (sunlight, watering, care level), size chips, quantity stepper, "Add to Cart" toast, WhatsApp enquiry. | Clean mock data for 8 catalog varieties across 6 categories. |
| **08, 09: Cart & Checkout (`/cart`, `/checkout`)** | Match | Cart card with 56px square thumbnails, title, variant, price, pill stepper, trash button; pincode delivery checker; subtotal math (example ₹997); full-width "Proceed to Checkout"; Checkout with Contact details (+91 block), Delivery address, single radio payment group (UPI, Cards, Netbanking, COD), "Pay securely" with shield; Simulated demo payment modal. | D4: Single consistent radio group for payment methods. |
| **10: Design System Spec (`/design-system`)** | Match | Circular color swatches with hex, "Aa" Fraunces and Inter specimens, button states (Primary, Outline, Ghost, Pill, Loading, Disabled), input states (Default, Error), semantic badges (In stock, Out of stock, Coming soon, Price on request, Illustrative image), icon showcase. | Serves as live visual QA testbench. |

---

## Anti-Slop Audit Checklist (Verified 100% Passed)
- [x] Palette derived strictly from `DESIGN-ANALYSIS.md` & Crop 10 (soil, brown, clay, tan, beige, card, sand, moss, sage, leaf).
- [x] No generic AI blue/purple gradients; no pure `#FFFFFF` white; no pure `#000000` black.
- [x] No decorative emoji scattered in UI text.
- [x] No fabricated star ratings, testimonials, customer counts, or false awards.
- [x] Honest terminology: "Request" used throughout bookings instead of fake instant confirmations.
- [x] Touch targets ≥ 44px, full keyboard accessibility, visible focus rings with `sage-light`.
