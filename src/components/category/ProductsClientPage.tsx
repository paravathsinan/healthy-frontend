'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ProductGrid } from './ProductGrid';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Variant {
  id: number;
  weight: string;
  price: number;
  discount_price: number | null;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  cheapest_variant_price: string | number;
  primary_image: string;
  is_sold_out: boolean;
  badge_text?: string;
  tags?: string[];
  on_sale?: boolean;
  variants: Variant[];
  images: { image_url: string; is_primary: boolean }[];
  categories?: { name: string; slug: string }[];
  category?: { name: string; slug: string };
}

interface ProductsClientPageProps {
  products: Product[];
}

// ---------------------------------------------------------------------------
// FilterDropdown — generic reusable dropdown shell
// ---------------------------------------------------------------------------
function FilterDropdown({
  label,
  isOpen,
  onToggle,
  activeCount,
  onReset,
  align = 'left',
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  activeCount: number;
  onReset: () => void;
  align?: 'left' | 'right';
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && isOpen) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={onToggle}
        className={`flex items-center justify-between gap-3 px-4 py-3 border bg-white min-w-[130px] cursor-pointer transition-colors ${
          isOpen ? 'border-black' : 'border-gray-200 hover:border-black'
        }`}
      >
        <span className="text-[15px] text-gray-800 whitespace-nowrap">
          {label}
          {activeCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className={`absolute top-full mt-1 w-[280px] sm:w-[300px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 shadow-xl z-[60] animate-in fade-in slide-in-from-top-2 duration-200 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}>
          <div className="p-5 space-y-5">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-900">
                {activeCount === 0 ? '0 selected' : `${activeCount} selected`}
              </span>
              <button
                onClick={onReset}
                className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors text-[14px]"
              >
                Reset
              </button>
            </div>
            <div className="border-t border-gray-100 pt-4">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'alphabetically-a-z', label: 'Alphabetically, A–Z' },
  { value: 'alphabetically-z-a', label: 'Alphabetically, Z–A' },
  { value: 'price-low-to-high', label: 'Price, low to high' },
  { value: 'price-high-to-low', label: 'Price, high to low' },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ProductsClientPage({ products }: ProductsClientPageProps) {
  // ── Filter state ──────────────────────────────────────────────────────────
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const toggle = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
    setIsSortOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Derive available options from real product data ───────────────────────
  const { categories, weights, minPrice, maxPrice, inStockCount, outOfStockCount } = useMemo(() => {
    const catMap = new Map<string, { name: string; slug: string; count: number }>();
    const weightMap = new Map<string, number>();
    let minP = Infinity;
    let maxP = 0;
    let inS = 0;
    let outS = 0;

    for (const p of products) {
      // stock
      if (p.is_sold_out) outS++; else inS++;

      // price range (cheapest variant)
      const price = parseFloat(String(p.cheapest_variant_price));
      if (!isNaN(price)) {
        if (price < minP) minP = price;
        if (price > maxP) maxP = price;
      }

      // categories — support both array and single object
      const cats = p.categories ?? (p.category ? [p.category] : []);
      for (const c of cats) {
        const existing = catMap.get(c.slug);
        catMap.set(c.slug, { name: c.name, slug: c.slug, count: (existing?.count ?? 0) + 1 });
      }

      // weights from variants
      for (const v of p.variants ?? []) {
        weightMap.set(v.weight, (weightMap.get(v.weight) ?? 0) + 1);
      }
    }

    return {
      categories: Array.from(catMap.values()).sort((a, b) => b.count - a.count),
      weights: Array.from(weightMap.entries())
        .map(([weight, count]) => ({ weight, count }))
        .sort((a, b) => a.weight.localeCompare(b.weight, undefined, { numeric: true })),
      minPrice: minP === Infinity ? 0 : minP,
      maxPrice: maxP,
      inStockCount: inS,
      outOfStockCount: outS,
    };
  }, [products]);

  // ── Apply filters + sort ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...products];

    // availability
    if (inStock && !outOfStock) list = list.filter((p) => !p.is_sold_out);
    if (outOfStock && !inStock) list = list.filter((p) => p.is_sold_out);

    // price range
    const pMin = priceMin !== '' ? parseFloat(priceMin) : null;
    const pMax = priceMax !== '' ? parseFloat(priceMax) : null;
    if (pMin !== null || pMax !== null) {
      list = list.filter((p) => {
        const price = parseFloat(String(p.cheapest_variant_price));
        if (isNaN(price)) return false;
        if (pMin !== null && price < pMin) return false;
        if (pMax !== null && price > pMax) return false;
        return true;
      });
    }

    // categories
    if (selectedCategories.length > 0) {
      list = list.filter((p) => {
        const cats = p.categories ?? (p.category ? [p.category] : []);
        return cats.some((c: { slug: string }) => selectedCategories.includes(c.slug));
      });
    }

    // weights
    if (selectedWeights.length > 0) {
      list = list.filter((p) =>
        (p.variants ?? []).some((v: Variant) => selectedWeights.includes(v.weight))
      );
    }

    // sort
    switch (sortBy) {
      case 'price-low-to-high':
        list.sort(
          (a, b) =>
            parseFloat(String(a.cheapest_variant_price)) -
            parseFloat(String(b.cheapest_variant_price))
        );
        break;
      case 'price-high-to-low':
        list.sort(
          (a, b) =>
            parseFloat(String(b.cheapest_variant_price)) -
            parseFloat(String(a.cheapest_variant_price))
        );
        break;
      case 'alphabetically-a-z':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphabetically-z-a':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // featured / best-selling → original order
      default:
        break;
    }

    return list;
  }, [products, inStock, outOfStock, priceMin, priceMax, selectedCategories, selectedWeights, sortBy]);

  // ── Active filter chips (for display) ────────────────────────────────────
  const activeFiltersCount =
    (inStock ? 1 : 0) +
    (outOfStock ? 1 : 0) +
    (priceMin || priceMax ? 1 : 0) +
    selectedCategories.length +
    selectedWeights.length;

  const clearAll = () => {
    setInStock(false);
    setOutOfStock(false);
    setPriceMin('');
    setPriceMax('');
    setSelectedCategories([]);
    setSelectedWeights([]);
  };

  const toggleCategory = (slug: string) =>
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  const toggleWeight = (w: string) =>
    setSelectedWeights((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-y-4 mb-12">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[15px] text-gray-500 font-medium">Filter:</span>
          <div className="flex flex-wrap gap-2">

            {/* Availability */}
            <FilterDropdown
              label="Availability"
              isOpen={activeDropdown === 'availability'}
              onToggle={() => toggle('availability')}
              activeCount={(inStock ? 1 : 0) + (outOfStock ? 1 : 0)}
              onReset={() => { setInStock(false); setOutOfStock(false); }}
            >
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-5 h-5 rounded accent-black"
                  />
                  <span className="text-[15px] text-gray-800 group-hover:text-black">
                    In stock ({inStockCount})
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={outOfStock}
                    onChange={(e) => setOutOfStock(e.target.checked)}
                    className="w-5 h-5 rounded accent-black"
                  />
                  <span className="text-[15px] text-gray-800 group-hover:text-black">
                    Out of stock ({outOfStockCount})
                  </span>
                </label>
              </div>
            </FilterDropdown>

            {/* Price */}
            <FilterDropdown
              label="Price"
              isOpen={activeDropdown === 'price'}
              onToggle={() => toggle('price')}
              activeCount={priceMin || priceMax ? 1 : 0}
              onReset={() => { setPriceMin(''); setPriceMax(''); }}
              align="right"
            >
              <div className="space-y-4">
                <p className="text-[13px] text-gray-500">
                  Range: ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">₹</span>
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder={String(Math.floor(minPrice))}
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded focus:border-black text-gray-900 font-medium placeholder:text-gray-400 outline-none text-[15px]"
                    />
                  </div>
                  <span className="text-gray-400">–</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">₹</span>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder={String(Math.ceil(maxPrice))}
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded focus:border-black text-gray-900 font-medium placeholder:text-gray-400 outline-none text-[15px]"
                    />
                  </div>
                </div>
              </div>
            </FilterDropdown>

            {/* Category */}
            {categories.length > 0 && (
              <FilterDropdown
                label="Category"
                isOpen={activeDropdown === 'category'}
                onToggle={() => toggle('category')}
                activeCount={selectedCategories.length}
                onReset={() => setSelectedCategories([])}
              >
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="w-5 h-5 rounded accent-black"
                      />
                      <span className="text-[15px] text-gray-800 group-hover:text-black">
                        {cat.name} ({cat.count})
                      </span>
                    </label>
                  ))}
                </div>
              </FilterDropdown>
            )}

            {/* Available in (weights) */}
            {weights.length > 0 && (
              <FilterDropdown
                label="Available in"
                isOpen={activeDropdown === 'weights'}
                onToggle={() => toggle('weights')}
                activeCount={selectedWeights.length}
                onReset={() => setSelectedWeights([])}
                align="right"
              >
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {weights.map(({ weight, count }) => (
                    <label key={weight} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedWeights.includes(weight)}
                        onChange={() => toggleWeight(weight)}
                        className="w-5 h-5 rounded accent-black"
                      />
                      <span className="text-[15px] text-gray-800 group-hover:text-black">
                        {weight} ({count})
                      </span>
                    </label>
                  ))}
                </div>
              </FilterDropdown>
            )}
          </div>

          {/* Clear all active filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-black transition-colors underline underline-offset-4"
            >
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4">
          <span className="text-[15px] text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
          <div className="relative" ref={sortRef}>
            <div
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setActiveDropdown(null);
              }}
              className={`flex items-center justify-between gap-3 px-4 py-3 border bg-white min-w-[180px] cursor-pointer transition-colors ${
                isSortOpen ? 'border-black' : 'border-gray-200 hover:border-black'
              }`}
            >
              <span className="text-[15px] text-gray-800 whitespace-nowrap">
                {sortOptions.find((o) => o.value === sortBy)?.label || 'Featured'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isSortOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {isSortOpen && (
              <div className="absolute top-full right-0 mt-1 w-[220px] bg-white border border-gray-200 shadow-xl z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-1">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-[14.5px] transition-colors flex items-center justify-between ${
                        sortBy === opt.value
                          ? 'bg-gray-50 text-black font-semibold'
                          : 'text-gray-600 hover:bg-gray-50/60 hover:text-black'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product count */}
      <div className="mb-12">
        <span className="text-[14px] text-gray-400 font-medium">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          {activeFiltersCount > 0 && ` (filtered from ${products.length})`}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center border-t border-gray-100">
          <p className="text-[17px] font-medium text-gray-900 mb-2">No products match your filters.</p>
          <button
            onClick={clearAll}
            className="mt-4 text-[14px] underline underline-offset-4 text-gray-500 hover:text-black transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </>
  );
}
