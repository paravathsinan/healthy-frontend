# Dates & Nuts Storefront (Next.js 15)

A high-performance, premium e-commerce storefront for Dates & Nuts. Features a cutting-edge Admin Dashboard with a specialized multi-badge management system and a professional WhatsApp-integrated ordering workflow.

## 🌟 Premium Features
- **Modern Storefront**: Dynamic Hero Carousels, high-end Category Filtering, and responsive Product Grids.
- **Smart Badge System**: Interactive, color-coded product badges (Brick Red, Amber, Blue, Emerald, Teal, Purple) with premium rectangular geometry and authoritative typography.
- **Advanced Admin Dashboard**:
  - **Premium Branding**: Specialized Emerald Green (`#006837`) theme with custom-engineered focus border logic (no default UI rings).
  - **Multi-Badge Manager**: Interactive chip-based interface for managing custom and preset product tags.
  - **Inventory Precision**: Specialized "Price per kg/Unit" logic and variant management.
- **WhatsApp Order Flow**: Seamless customer journey from cart to professional WhatsApp order formatting, integrated with backend activity logging.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Framer Motion for micro-animations
- **UI Components**: Radix UI (Shadcn) with deep custom overrides for premium branding
- **State Management**: Zustand (Cart & UI state)
- **API Communication**: Axios with automated Token Interceptors

## 🚀 Quick Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment**: Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
3. **Start Development**:
   ```bash
   npm run dev
   ```

## 🔐 Security & Access Control
- **Auth Guard**: Comprehensive layout-level protection in `src/app/admin/layout.tsx`. Unauthenticated requests to any `/admin/*` route are automatically intercepted and redirected to `/admin/login`.
- **Token Management**: `src/lib/api.ts` automatically extracts the DRF Token from `localStorage` and attaches it to the `Authorization` header for all staff-only requests.

## 📦 Core Component Logic
- **ProductModal**: A sophisticated management hub for products featuring the new "Add/Edit" badge tool and real-time input validation.
- **ProductGrid**: Optimized rendering engine with standardized badge color-coding and "Quick View" preview capabilities.
- **CartDrawer**: Side-panel basket management with real-time price calculation and checkout triggers.

## 🎨 Branding Guide
- **Primary Color**: Emerald Green (`#006837`)
- **Badge Palette**:
  - **Muted Red (#D14343)**: Sales & Offers
  - **Amber (#F59E0B)**: Bestsellers & Hot Items
  - **Blue (#2563EB)**: New Arrivals
  - **Emerald (#059669)**: Health & Quality
  - **Teal (#0D9488)**: Logistics & Shipping
  - **Purple (#9333EA)**: Premium status
