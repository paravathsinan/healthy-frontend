"use client";

import React, { createContext, useContext } from 'react';
import useSWR from 'swr';
import { getCategories } from '@/lib/api';

interface CategoryContextType {
  categories: any[];
  loading: boolean;
  error: any;
  refreshCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const { data: categories, error, isLoading, mutate } = useSWR('api/categories', getCategories, {
    revalidateOnFocus: false, // Don't refetch every time user switches tabs
    dedupingInterval: 60000, // Consider data fresh for 1 minute
  });

  return (
    <CategoryContext.Provider 
      value={{ 
        categories: categories || [], 
        loading: isLoading, 
        error: error, 
        refreshCategories: () => mutate() 
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
