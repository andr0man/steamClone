import { useState, useCallback, useMemo } from "react";

export function useSearchFilter(list, filterFn) {
  const [query, setQuery] = useState("");

  // Compute filtered list from inputs; no setState inside effects to avoid loops
  const filteredList = useMemo(() => {
    const value = (query || "").toLowerCase();
    if (!Array.isArray(list) || list.length === 0) return [];
    if (!value) return list;
    return list.filter((item) => filterFn(item, value));
  }, [list, query, filterFn]);

  const handleSearch = useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  return { query, filteredList, handleSearch, setQuery };
}
