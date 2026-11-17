import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AppState = {
  productCompareIds: string[];
  hallCompareIds: string[];
  favoriteProductIds: string[];
  toggleProductCompare: (id: string) => void;
  toggleHallCompare: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

const StateContext = createContext<AppState | null>(null);
const toggle = (items: string[], id: string, limit?: number) => items.includes(id) ? items.filter((item) => item !== id) : limit && items.length >= limit ? items : [...items, id];

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [productCompareIds, setProductCompareIds] = useState<string[]>([]);
  const [hallCompareIds, setHallCompareIds] = useState<string[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const value = useMemo(() => ({
    productCompareIds,
    hallCompareIds,
    favoriteProductIds,
    toggleProductCompare: (id: string) => setProductCompareIds((items) => toggle(items, id, 3)),
    toggleHallCompare: (id: string) => setHallCompareIds((items) => toggle(items, id, 3)),
    toggleFavorite: (id: string) => setFavoriteProductIds((items) => toggle(items, id)),
  }), [productCompareIds, hallCompareIds, favoriteProductIds]);
  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const value = useContext(StateContext);
  if (!value) throw new Error('AppStateProvider 안에서 사용해야 합니다.');
  return value;
}
