import { useState, useEffect } from "react";

export type ViewMode = "grid" | "list";

const STORAGE_KEY = "pg_view_mode";

export function useViewMode(): { viewMode: ViewMode; setViewMode: (m: ViewMode) => void } {
  const [viewMode, setViewModeState] = useState<ViewMode>("grid");

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "grid" || saved === "list") setViewModeState(saved);
  }, []);

  const setViewMode = (m: ViewMode) => {
    setViewModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  };

  return { viewMode, setViewMode };
}
