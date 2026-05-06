'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getFilterOptions } from '@/lib/api';

interface FilterDropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterDropdown = ({ label, isOpen, onToggle, children }: FilterDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={onToggle}
        className={`flex items-center justify-between gap-4 px-4 py-3 border bg-white min-w-[140px] cursor-pointer transition-colors group ${
          isOpen ? 'border-black' : 'border-gray-200 hover:border-black'
        }`}
      >
        <span className="text-[15px] text-gray-800">{label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[320px] bg-white border border-gray-200 shadow-xl z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

interface FilterOptions {
  availability: { in_stock: number; out_of_stock: number };
  price: { min: number; max: number };
  categories: { name: string; slug: string; product_count: number }[];
  weights: { weight: string; product_count: number }[];
}

export const CategoryFilters = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  useEffect(() => {
    getFilterOptions().then((data) => {
      setFilterOptions(data);
      setLoading(false);
    });
  }, []);

  const maxPrice = filterOptions?.price.max ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-8 mb-12">
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-[15px] text-gray-500 font-medium">Filter:</span>
        <div className="flex flex-wrap gap-2">

          {/* Availability */}
          <FilterDropdown 
            label="Availability" 
            isOpen={activeDropdown === 'Availability'} 
            onToggle={() => toggleDropdown('Availability')}
          >
            <div className="p-5 space-y-6">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-900">0 selected</span>
                <button className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors">Reset</button>
              </div>
              <div className="border-t border-gray-100 pt-5 space-y-4">
                {loading ? (
                  <>
                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                    <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 border-gray-300 rounded focus:ring-black accent-black" />
                      <span className="text-[15px] text-gray-800 group-hover:text-black">
                        In stock ({filterOptions?.availability.in_stock ?? 0})
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 border-gray-300 rounded focus:ring-black accent-black" />
                      <span className="text-[15px] text-gray-800 group-hover:text-black">
                        Out of stock ({filterOptions?.availability.out_of_stock ?? 0})
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </FilterDropdown>

          {/* Price */}
          <FilterDropdown 
            label="Price" 
            isOpen={activeDropdown === 'Price'} 
            onToggle={() => toggleDropdown('Price')}
          >
            <div className="p-5 space-y-6">
              <div className="flex justify-between items-center text-[15px]">
                {loading ? (
                  <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <span className="text-gray-900">
                    The highest price is ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <button className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors shrink-0 ml-3">Reset</button>
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none text-[15px]"
                    />
                  </div>
                  <span className="text-gray-500 font-medium">to</span>
                  <div className="flex-1 relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                    <input 
                      type="number" 
                      placeholder={loading ? '...' : String(Math.floor(maxPrice))}
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none text-[15px]"
                    />
                  </div>
                </div>
                {/* Range Slider */}
                <div className="relative h-1 bg-black rounded-full mx-1">
                  <div className="absolute -top-1.5 left-0 w-4 h-4 bg-white border-2 border-black rounded-full cursor-pointer shadow-sm" />
                  <div className="absolute -top-1.5 right-0 w-4 h-4 bg-white border-2 border-black rounded-full cursor-pointer shadow-sm" />
                </div>
              </div>
            </div>
          </FilterDropdown>

          {/* Category */}
          <FilterDropdown 
            label="Category" 
            isOpen={activeDropdown === 'Category'} 
            onToggle={() => toggleDropdown('Category')}
          >
            <div className="p-5 space-y-6">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-900">0 selected</span>
                <button className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors">Reset</button>
              </div>
              <div className="border-t border-gray-100 pt-5 space-y-4">
                {loading ? (
                  <>
                    <div className="h-5 w-28 bg-gray-100 rounded animate-pulse" />
                    <div className="h-5 w-36 bg-gray-100 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
                  </>
                ) : filterOptions?.categories.length === 0 ? (
                  <p className="text-sm text-gray-400">No categories found</p>
                ) : (
                  filterOptions?.categories.map((cat) => (
                    <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 border-gray-300 rounded focus:ring-black accent-black" />
                      <span className="text-[15px] text-gray-800 group-hover:text-black">
                        {cat.name} ({cat.product_count})
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </FilterDropdown>

          {/* Available In (weight variants) */}
          <FilterDropdown 
            label="Available in" 
            isOpen={activeDropdown === 'Available in'} 
            onToggle={() => toggleDropdown('Available in')}
          >
            <div className="p-5 space-y-6">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-900">0 selected</span>
                <button className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors">Reset</button>
              </div>
              <div className="border-t border-gray-100 pt-5 max-h-[300px] overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {loading ? (
                  <>
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </>
                ) : filterOptions?.weights.length === 0 ? (
                  <p className="text-sm text-gray-400">No weights found</p>
                ) : (
                  filterOptions?.weights.map((w) => (
                    <label key={w.weight} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 border-gray-300 rounded focus:ring-black accent-black" />
                      <span className="text-[15px] text-gray-800 group-hover:text-black">
                        {w.weight} ({w.product_count})
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </FilterDropdown>

        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-[15px] text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
        <div className="relative group">
          <select 
            className="appearance-none bg-white border border-gray-200 px-4 py-3 pr-12 text-[15px] text-gray-800 cursor-pointer hover:border-black transition-colors outline-none min-w-[220px]"
            defaultValue="best-selling"
          >
            <option value="featured">Featured</option>
            <option value="most-relevant">Most relevant</option>
            <option value="best-selling">Best selling</option>
            <option value="alphabetically-a-z">Alphabetically, A-Z</option>
            <option value="alphabetically-z-a">Alphabetically, Z-A</option>
            <option value="price-low-to-high">Price, low to high</option>
            <option value="price-high-to-low">Price, high to low</option>
            <option value="date-old-to-new">Date, old to new</option>
            <option value="date-new-to-old">Date, new to old</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform group-hover:rotate-180" />
        </div>
      </div>
    </div>
  );
};
