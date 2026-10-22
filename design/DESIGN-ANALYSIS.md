# UrbanMaali Design Analysis & Crop Breakdown

## Design System Foundations (Crop 10 & Board Swatches)

### Exact Palette
- **Soil** (`#2B2118`): Headlines, body high-contrast text, dark footer background.
- **Brown** (`#5A4330`): Step number circles, mobile H1 tint, secondary headings.
- **Clay** (`#8B6B4A`): Subtitles, muted labels, tertiary descriptions, small icons.
- **Tan** (`#C9A87C`): Round arrow buttons on service cards, highlights, decorative botanical accents.
- **Beige** (`#F4ECDD`): Global page background, light text on dark soil surfaces.
- **Card** (`#FAF5EA`): Card surfaces, form inputs, step tiles, chip backgrounds.
- **Sand** (`#E6D8BD`): 1px borders, subtle dividers, alternate section backgrounds.
- **Moss** (`#3F5B34`): Primary buttons, active tabs, brand accents, selected chip states.
- **Moss Hover** (`#5E7F4A`): Interactive hover state for primary buttons and links.
- **Sage** (`#A9BE8F`): Soft fills, secondary illustration washes.
- **Sage Light** (`#DDE7CF`): Trust-icon circular backgrounds, in-stock badges, focus rings.
- **Leaf** (`#C8D96A`): Tiny vibrant green accent sparks.

### Semantic Badge Tints
- **In stock**: background `#DDE7CF` (sage-light), text `#3F5B34` (moss).
- **Out of stock**: background `#F3D5D0` (soft rose), text `#A4432F` (brick).
- **Coming soon**: background `#DCE6EE` (soft blue-grey), text `#3E5A73`.
- **Price on request**: background `#F3E6B8` (soft straw), text `#7A5C14`.
- **Error**: border and message `#A4432F` (brick) with warning/info icon.

### Typography
- **Headings**: `Fraunces`, weight 500/600, optical size auto, tight tracking (`-0.02em`).
  - Desktop Hero H1: clamp(52px, 6vw, 88px), line-height 1.05, 2 lines ("Bring / Nature Home").
  - Mobile Hero H1: 40px/44px, color brown (`#5A4330`).
  - Section Titles: 32px desktop / 24px mobile, Fraunces 600, color soil (`#2B2118`).
- **Body & UI**: `Inter`, weights 400, 500, 600.
  - Subtitles & Eyebrow: Inter 16px (14px mobile), clay (`#8B6B4A`).
  - Hero Paragraph: Inter 20px / 32px desktop (16px / 26px mobile), clay-brown.
  - Card Titles: Inter 600, 16px to 18px.
  - Nav & Buttons: Inter 500/600, 14px to 16px.

### Elevation & Radius
- Cards: Radius 20px, background `#FAF5EA`, 1px `#E6D8BD` border, shadow `0 8px 24px rgba(43,33,24,0.08)`.
- Buttons: Radius 14px for desktop primary; full pill (999px) for mobile CTAs.
- Pincode Container: Radius 18px card container with embedded 12px radius moss button (52px high).
- Inputs: Radius 12px, height 48px, 1px sand border, card fill.

---

## Detailed Crop-by-Crop Analysis

### 01, 01a: Desktop Hero & Trust Strip
- **Layout**: 2 columns (1fr / 1.05fr), vertically centered, min-height ~720px. Max-width 1280px with 24px side padding.
- **Left Column**:
  - Eyebrow: `From soil to sprout.` (Inter 16px, clay).
  - H1: `Bring` <br/> `Nature Home` (Fraunces 500–600, ~88px, soil).
  - Subtitle: `Your urban gardening and plant-care partner for homes, societies, offices and more. Local maalis. Nursery partners. Simple booking.` (Inter 20px, clay-brown).
  - Pincode Box: Card container, radius 18px, input with "Enter your pincode", right-aligned moss button "Check Availability" (radius 12px, 52px height).
  - Action Row: Primary button "Book a Service" (moss, 56px height) and Outline button "Enquire on WhatsApp" with WhatsApp glyph.
- **Right Column**:
  - Organic blob-masked maali photo with a 2px offset tan stroke outline (~12px offset).
  - Soft sand backdrop blob.
  - Botanical leaf sprig rising from bottom-left of photo, swaying subtly.
- **Trust Strip**:
  - 4 items: "Local maalis / from your area", "Recurring / visits and care", "Homes to corporates / and malls", "Simple / and transparent booking".
  - 56px sage-light circular icons with line artwork.

### 01b: Our Services & How It Works
- **Our Services**:
  - Header: "Our Services" (Fraunces 32px), subtitle "Plant care and green spaces for every need", right link "View All >".
  - 6-card row: 4:3 photo (radius 16px top), title (Inter 600), price tag, 28px circular tan button with right arrow at bottom-right.
  - Cards:
    1. Garden / Plant Maintenance — From ₹749
    2. Maintenance Add-on — From ₹199
    3. Plant Nursery and Delivery — Wide range of plants
    4. Balcony Makeover and Setup — Transform your balcony
    5. Irrigation Setup — Starting price on request
    6. Society / Office Maintenance — Request a quote
  - Hover: card elevates 4px, tan arrow nudges right.
- **How It Works**:
  - Header: "How It Works" + "Get expert plant care in a few simple steps."
  - 5 steps with curved dotted connector path.
  - Each step: 64px rounded card tile, moss icon, 28px brown numbered circle (1 to 5), title and short description.

### 01c: Plans for Regular Care, Who We Serve & Footer
- **Plans for Regular Care**:
  - 2 wide horizontal cards: left photo (38% width), right content with title ("Home Gardening Plan", "Society / Office Plan"), status "Plan details coming soon", and outline button "Request a quote >" opening Quote modal.
- **Who We Serve**:
  - 5 cards: Homes, Societies, Offices, Corporates, Malls with 40px icon, title, and descriptive subtitle.
- **Footer**:
  - Soil background (`#2B2118`), light logo, tagline "Bring Nature Home", 3 link columns, contact info, social icons, legal links.

### 02: Mobile Home
- Header: Left hamburger menu, centered logo, right cart icon with badge.
- Sand-tinted hero block with faint leaf silhouette and tan sprig.
- H1 in brown (`#5A4330`), 40px/44px on 2 lines.
- Pincode container: input + "Check" button.
- Full-width pill buttons: "Book a Service" (moss) and "Enquire on WhatsApp" (outline).
- 4-column trust strip with 52px sage-light circles.
- 2-column services grid with circular moss badge overlapping bottom-left of image.
- Stacked vertical timeline for How It Works.
- Fixed bottom tab bar (Home, Services, Shop, Call, WhatsApp).

### 03: Mobile Service Detail (`/services/[slug]`)
- Header: Back arrow, "Service Details", cart icon.
- Photo (radius 20px, 4:3) with "Illustrative image" pill badge.
- Title: "Garden / Plant Maintenance" (Fraunces 22px).
- Price row: "From ₹749" (Fraunces 28px) + "Up to 20 pots" (sage-light badge).
- Duration box: Clock icon, "Duration: 1 visit (approx. 1–2 hours)".
- What's included (moss checkmarks): Plant cleaning and pruning, Soil check and nourishment, Pest inspection, Care tips.
- What's not included (clay dots): New plants/pots, Major plant replacement, Structural changes.
- Fixed sticky bottom bar: Full-width moss "Book this service" + 52px WhatsApp button.

### 04, 05: Mobile Booking & Success
- **Booking (Step 2)**:
  - Stepper: 5 circles (28px) with connecting line. Step 1 check, Step 2 active number.
  - "Step 2 of 5 — Property Details" (Fraunces 24px).
  - Property Type chips: Home (selected), Society, Office, Corporate, Mall.
  - Inputs: Address, Pincode with inline "Check" button, Locality, Pot range dropdown.
  - Back (outline) and Next (moss) action buttons (52px).
- **Request Received**:
  - Large moss check inside leaf wreath (72px).
  - "Request Received" (Fraunces 26px).
  - Reference ID pill with copy button (`UM-2610-0042`).
  - Form summary card with property details and slot.
  - "Chat on WhatsApp" button with prefilled ref ID.
  - Realistic multi-stage timeline.

### 06, 07: Mobile Shop & Product Detail
- **Shop**:
  - Search input with filter toggle button.
  - Category chips: All (selected), Indoor, Outdoor, Balcony, Pots, Soil, Compost.
  - 2-column product grid with 1:1 image, heart toggle, "In stock" badge, title, price.
- **Product Detail**:
  - Large photo with heart toggle and badge.
  - 4 thumbnail selector cards (64px, active moss border).
  - Care info pills: Low light, Moderate watering, Easy care.
  - Size chips: Small, Medium, Large.
  - Quantity pill stepper: (−, qty, +).
  - Actions: "Add to Cart" (moss) and "Enquire on WhatsApp".
  - Expandable accordions for Care Instructions and Delivery.

### 08, 09: Mobile Cart & Checkout
- **Cart**:
  - Item list in card: 56px thumbnail, title, variant, price, quantity stepper, trash icon.
  - Pincode delivery check box.
  - Subtotal summary with exact math.
  - Moss "Proceed to Checkout" button.
- **Checkout**:
  - Contact Details, Delivery Address with pincode verify, Payment Method (radios: UPI, Cards, Netbanking, COD).
  - "Pay securely" button opening demo simulated payment sheet.

---

## Deviations & Unreadable Items Handled
- **D1**: Hero copy says "Nursery partners", not "Trusted nurseries" (honest claim).
- **D2**: Duration and inclusions marked as placeholders pending client review.
- **D3**: Mobile header uses menu on left, cart on right.
- **D4**: Checkout uses clean, consistent radio buttons for payment selection.
- **D5**: Plan card copy uses "Plan details coming soon".
- **D6**: Board's outer mockup frame and dark leafy backdrop are ignored; site is full-bleed beige.
- **D7**: Responsive desktop/tablet inner page layouts derived cleanly using the same design tokens.
