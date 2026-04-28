# Dates & Nuts Frontend (Next.js)

Premium e-commerce storefront and admin management dashboard built with Next.js 15.

## 🛠 Core Stack
- Next.js 15 (App Router)
- Tailwind CSS & Framer Motion
- Shadcn UI & Lucide Icons
- Axios (with Auth Interceptors)

## 🚀 Quick Setup
1. **Install**: `npm install`
2. **Environment**: Create `.env.local` with:
   - `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1`
3. **Start**: `npm run dev`

## ✨ Essential Features
- **Storefront**: Dynamic hero carousel, category filtering, premium product modals, and WhatsApp order flow.
- **Admin Dashboard**: Secured management panel for products, categories, and hero slides.
- **Security**: Layout-level auth guard redirects unauthenticated users from `/admin/*` to `/admin/login`.

## ⚙️ Logic Notes
- **API Client**: `src/lib/api.ts` automatically attaches the DRF Token from `localStorage` to all requests.
- **Admin Layout**: `src/app/admin/layout.tsx` handles session validation and automatic login redirects.
- **Dynamic Images**: All product/hero images are managed via admin and rendered using `next/image` for performance.
