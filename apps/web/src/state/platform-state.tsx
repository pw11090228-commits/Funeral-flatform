"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type PlatformState = {
  productCompareIds: string[];
  hallCompareIds: string[];
  favoriteProductIds: string[];
  toggleProductCompare: (id: string) => void;
  toggleHallCompare: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

const StateContext = createContext<PlatformState | null>(null);

function toggleLimited(items: string[], id: string): string[] {
  if (items.includes(id)) return items.filter((item) => item !== id);
  if (items.length >= 3) return items;
  return [...items, id];
}

export function PlatformStateProvider({ children }: { children: ReactNode }) {
  const [productCompareIds, setProductCompareIds] = useState<string[]>([]);
  const [hallCompareIds, setHallCompareIds] = useState<string[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const value = useMemo(
    () => ({
      productCompareIds,
      hallCompareIds,
      favoriteProductIds,
      toggleProductCompare: (id: string) => setProductCompareIds((items) => toggleLimited(items, id)),
      toggleHallCompare: (id: string) => setHallCompareIds((items) => toggleLimited(items, id)),
      toggleFavorite: (id: string) => setFavoriteProductIds((items) => toggleLimitedFavorite(items, id)),
    }),
    [productCompareIds, hallCompareIds, favoriteProductIds],
  );
  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

function toggleLimitedFavorite(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

export function usePlatformState() {
  const value = useContext(StateContext);
  if (!value) throw new Error("PlatformStateProvider 안에서 사용해야 합니다.");
  return value;
}
