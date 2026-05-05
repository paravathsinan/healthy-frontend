# Dates & Nuts Storefront (Next.js 15)

A premium, high-conversion e-commerce storefront for Dates & Nuts. Built with Next.js 15 for extreme performance and a state-of-the-art Admin Dashboard for seamless business management.

## ✨ Latest Improvements & Refinements
The storefront has been significantly upgraded with a focus on premium aesthetics and performance:

- **Incremental Static Regeneration (ISR)**: High-traffic pages (Products/Categories) utilize dynamic revalidation to ensure lightning-fast load times with near-instant data updates.
- **Optimized Data Fetching**: Migrated to a consolidated API architecture, reducing initial page load requests and eliminating redundant data payloads.
- **Premium Aesthetic Overhaul**:
  - **Refined Badge System**: Implementation of a muted "Brick Red" and "Emerald" palette for a professional, high-end look.
  - **Geometric Consistency**: Standardized `rounded-[2px]` corner radii and authoritative typography for a tactile, premium feel.
  - **Dynamic Skeletons**: Integrated Framer Motion-based loading states to prevent layout shifts and improve perceived speed.
- **Cloudinary Integration**: Fully transitioned to cloud-native image optimization, leveraging automatic format conversion (WebP/Avif) and responsive resizing.
- **Mobile-First UX**: Comprehensive UI audit and refinement for mobile devices, ensuring the shopping and admin experiences are flawless on all screens.
- **Enhanced Order Workflow**: Professional WhatsApp message formatting with integrated backend conversion tracking.

## 🛠 Modern Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Custom Design System)
- **Animations**: Framer Motion (Micro-interactions)
- **State**: Zustand (Atomic store for Cart & UI)
- **UI Architecture**: Radix UI (Shadcn) with deep design-system overrides
- **API Engine**: Axios with centralized Request/Response interceptors

## 🚀 Key Features
- **Smart Product Grid**: Intelligent filtering by category and status (Featured, Bestseller, etc.).
- **Advanced Admin Dashboard**:
  - **Real-time Inventory**: Direct management of variants, pricing, and multi-badge tagging.
  - **Analytics Overview**: Dashboard statistics for visitor traffic and conversion rates.
  - **Security**: Layout-level Auth Guards with automated token validation.
- **WhatsApp Integration**: Streamlined checkout process that formats orders directly for mobile communication.

## 🎨 Design System (Branding)
- **Primary Brand Color**: Emerald Green (`#006837`) - Symbolizing health and quality.
- **Typography**: Inter / System Sans-serif for maximum readability.
- **Signature Badges**:
  - `Brick Red`: Exclusive Sales & Urgent Offers.
  - `Amber`: Verified Bestsellers.
  - `Emerald`: Premium Quality & Health focused.
  - `Blue`: Recent New Arrivals.

## 🛠 Development & Deployment
1. **Dependency Installation**:
   ```bash
   npm install
   ```
2. **Environment Configuration**: Set `NEXT_PUBLIC_API_URL` in `.env.local`.
3. **Execution**:
   - `npm run dev`: Local development with HMR.
   - `npm run build`: Production-ready bundle generation.
4. **Deployment**: Optimized for Vercel with automatic edge-caching and ISR support.

## 🔐 Security & Interceptors
The application features a robust security layer that automatically:
- Intercepts 401/403 errors to redirect unauthorized users.
- Injects JWT/DRF Tokens into administrative requests.
- Validates session state on every page transition within the `/admin` scope.
