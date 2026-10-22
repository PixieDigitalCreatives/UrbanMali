# The UrbanMaali 🌿

> **Bring Nature Home** — Your urban gardening and plant-care partner for homes, societies, offices, and beyond.

[![Deploy to GitHub Pages](https://github.com/PixieDigitalCreatives/urbanMali/actions/workflows/deploy.yml/badge.svg)](https://github.com/PixieDigitalCreatives/urbanMali/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![SCSS](https://img.shields.io/badge/Styling-SCSS%20Modules-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)

---

## 📖 Overview

**The UrbanMaali** is a modern, high-fidelity web application crafted for urban gardening services, plant e-commerce, and landscaping subscriptions. Designed with an artisanal, earthy aesthetic inspired by terracotta, lush foliage, and rich soil, the application provides an intuitive platform for booking trusted local gardeners (*maalis*), purchasing curated indoor/outdoor plants, and subscribing to regular maintenance plans.

---

## ✨ Features

- **🌱 Comprehensive Services**: Detailed service offerings including Balcony Setup, Plant Maintenance, Society & Office Landscaping, Drip Irrigation, and Nursery Deliveries.
- **🪴 Curated Plant Shop**: E-commerce catalog featuring air-purifying plants, bonsais, terracotta pots, organic compost, and gardening kits.
- **📅 Service Plans & Subscriptions**: Tiered monthly and seasonal garden maintenance plans with transparent pricing.
- **📍 Pincode Serviceability Check**: Real-time availability verification across Bangalore, Mumbai, Delhi-NCR, Hyderabad, and Pune.
- **🛒 Cart & Checkout State**: Full client-side shopping cart with localStorage persistence, coupon support, and multi-step checkout with order confirmation.
- **💬 Instant Quote Modal**: Quick consultation and custom quotation requests.
- **📱 Fully Responsive**: Fluid layouts adapted across 360px mobile, 768px tablet, and 1280px+ desktop viewports with a dedicated mobile bottom navigation bar.
- **🎨 Bespoke Design System**: Built on warm organic hues (*Soil, Moss, Clay, Sand, Beige*) and editorial typography (*Instrument Serif* display & *Manrope* text), with a living creeper layer, leaf cursor and GSAP scroll-triggered motion.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/) + [Vite 6](https://vitejs.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: SCSS & SCSS Modules (`.module.scss`) with design token architecture
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`CartContext`, `ToastContext`)
- **CI/CD**: GitHub Actions deploying to GitHub Pages

---

## 📂 Project Structure

```text
UrbanMali/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Actions deployment
├── docs/                       # Architectural documentation & design maps
│   ├── deployment.md           # GitHub Actions & Pages deployment guide
│   ├── codebase-map.md         # Component and routing architecture
│   ├── tailwind-to-scss-map.md # SCSS design token reference
│   └── ...
├── public/
│   ├── images/                 # Optimized photography & hero illustrations
│   ├── 404.html                # GitHub Pages SPA redirect handler
│   └── leaf-icon.svg           # Site favicon
├── src/
│   ├── components/
│   │   ├── cards/              # PlanCard, ProductCard, ServiceCard
│   │   ├── common/             # QuoteModal, etc.
│   │   ├── home/               # HowItWorks, TrustStrip, WhoWeServe
│   │   ├── layout/             # Header, Footer, MobileMenu, BottomTabBar
│   │   └── ui/                 # Button, Input, Modal, Chip, Badge, PincodeField
│   ├── context/                # CartContext, ToastContext
│   ├── data/                   # Services, products, plans, pincodes data
│   ├── lib/                    # Storage and API utilities
│   ├── pages/                  # Page routes (Home, Services, Shop, Cart, etc.)
│   ├── styles/
│   │   ├── abstracts/          # Variables, mixins, functions, design tokens
│   │   ├── base/               # CSS reset, typography, root variables
│   │   └── main.scss           # Global stylesheet entry point
│   ├── App.jsx                 # Main application routes & layout wrapper
│   └── main.jsx                # DOM mount entry
├── index.html                  # HTML entry point with Google Fonts
├── package.json
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PixieDigitalCreatives/urbanMali.git
   cd urbanMali
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Building for Production

Compile the production-ready bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🚢 Deployment

This repository is set up with continuous deployment via **GitHub Actions**:

- Every push to the `main` or `master` branch triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
- The workflow builds the static application and deploys it automatically to **GitHub Pages**.

For full configuration details and custom domain instructions, see [`docs/deployment.md`](docs/deployment.md).

---

## 🎨 Design Tokens & Palette

| Token | Hex Code | Role |
|---|---|---|
| `--soil` | `#2B2118` | Primary dark neutral, deep earthy headings & text |
| `--moss` | `#3F5B34` | Brand accent green, primary CTA buttons |
| `--moss-hover` | `#5E7F4A` | Interactive green hover state |
| `--sand` | `#E6D8BD` | Subtle warm border and divider tint |
| `--beige` | `#F4ECDD` | Main ambient background tone |
| `--card` | `#FAF5EA` | Elevated surface / card background |
| `--clay` | `#8B6B4A` | Secondary warm earth text / accents |
| `--brick` | `#A4432F` | Alert badges, sale highlights |

---

## 📄 License

Private & Proprietary © Pixie Digital Creatives. All rights reserved.
