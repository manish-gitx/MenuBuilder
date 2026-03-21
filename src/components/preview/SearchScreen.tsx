"use client"
import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Category, MenuItem } from "../../lib/api";
import PreviewMenuItemCard from "./PreviewMenuItemCard";

interface SearchScreenProps {
  onClose: () => void;
  categories: Category[];
  cart: MenuItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
  recentSearches: string[];
  setRecentSearches: (searches: string[]) => void;
}

interface FlatItem {
  item: MenuItem;
  categoryId: string;
  categoryName: string;
}

interface CategoryGroup {
  categoryId: string;
  categoryName: string;
  items: MenuItem[];
}

function matchesQuery(target: string, words: string[]): boolean {
  const t = target.toLowerCase();
  return words.every(w => t.includes(w));
}

function itemMatchesWords(item: MenuItem, words: string[]): boolean {
  const fields = [
    item.name,
    item.description ?? "",
    item.ingredients ?? "",
    ...(item.tags?.map(t => t.name) ?? []),
  ].join(" ");
  return matchesQuery(fields, words);
}

const SearchScreen = ({
  onClose,
  categories,
  addToCart,
  removeFromCart,
  isInCart,
  recentSearches,
  setRecentSearches,
}: SearchScreenProps) => {
  const [query, setQuery] = useState("");

  const flatItems = useMemo<FlatItem[]>(() => {
    const result: FlatItem[] = [];
    for (const cat of categories) {
      for (const item of cat.menuItems ?? []) {
        result.push({ item, categoryId: cat.id, categoryName: cat.name });
      }
      for (const sub of cat.childCategories ?? []) {
        for (const item of sub.menuItems ?? []) {
          result.push({ item, categoryId: cat.id, categoryName: cat.name });
        }
      }
    }
    return result;
  }, [categories]);

  const trendingItems = useMemo(() => flatItems.slice(0, 3).map(f => f.item), [flatItems]);

  const filteredGroups = useMemo<CategoryGroup[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    const matched = flatItems.filter(f => itemMatchesWords(f.item, words));
    const groupMap = new Map<string, CategoryGroup>();
    for (const f of matched) {
      if (!groupMap.has(f.categoryId)) {
        groupMap.set(f.categoryId, { categoryId: f.categoryId, categoryName: f.categoryName, items: [] });
      }
      groupMap.get(f.categoryId)!.items.push(f.item);
    }
    return Array.from(groupMap.values());
  }, [query, flatItems]);

  const isSearching = query.trim().length > 0;
  const hasResults = filteredGroups.length > 0;

  const handleClearAll = () => setRecentSearches([]);
  const handleRemoveChip = (chip: string) =>
    setRecentSearches(recentSearches.filter(s => s !== chip));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      const trimmed = query.trim();
      if (!recentSearches.includes(trimmed)) {
        setRecentSearches([trimmed, ...recentSearches]);
      }
    }
  };

  const handleChipPress = (chip: string) => setQuery(chip);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'var(--preview-bg)' }}>
      {/* Header */}
      <div
        className="border-b flex items-center gap-3 px-4 py-2 flex-shrink-0"
        style={{ backgroundColor: 'var(--preview-bg)', borderColor: 'var(--preview-border-strong)' }}
      >
        <button
          onClick={onClose}
          className="flex-shrink-0 flex items-center justify-center"
          style={{ color: 'var(--preview-text-secondary)' }}
          aria-label="Go back"
        >
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path d="M8 1L1.5 7.5L8 14" stroke="var(--preview-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for dishes, categories..."
          autoFocus
          className="flex-1 border rounded-[8px] px-[13px] py-[9px] text-[14px] outline-none"
          style={{
            backgroundColor: 'var(--preview-surface)',
            borderColor: 'var(--preview-border)',
            color: 'var(--preview-text-primary)',
          }}
        />

        {query.length > 0 ? (
          <button
            onClick={() => setQuery("")}
            className="flex-shrink-0 flex items-center justify-center"
            style={{ color: 'var(--preview-text-secondary)' }}
            aria-label="Clear"
          >
            <X style={{ width: 11.7, height: 11.7 }} />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center"
            style={{ color: 'var(--preview-text-secondary)' }}
            aria-label="Close search"
          >
            <X style={{ width: 11.7, height: 11.7 }} />
          </button>
        )}
      </div>

      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-8 pb-24">

        {/* Search results */}
        {isSearching && hasResults && (
          <section className="flex flex-col gap-6">
            <span className="text-[16px] font-bold tracking-[-0.4px]" style={{ color: 'var(--preview-text-primary)' }}>
              {filteredGroups.reduce((n, g) => n + g.items.length, 0)} results for &ldquo;{query.trim()}&rdquo;
            </span>
            {filteredGroups.map(group => (
              <div key={group.categoryId}>
                <p
                  className="text-[10px] font-extrabold uppercase tracking-[1.2px] mb-3 px-1"
                  style={{ color: 'var(--preview-text-secondary)' }}
                >
                  {group.categoryName}
                </p>
                <div className="flex flex-col gap-3">
                  {group.items.map(item => (
                    <PreviewMenuItemCard
                      key={item.id}
                      item={item}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                      isInCart={isInCart}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* No results */}
        {isSearching && !hasResults && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--preview-border-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="text-[16px] font-bold mt-2" style={{ color: 'var(--preview-text-primary)' }}>No dishes found</span>
            <span className="text-[13px]" style={{ color: 'var(--preview-text-secondary)' }}>Try &ldquo;{query.trim()}&rdquo; with different words</span>
          </div>
        )}

        {/* Default state */}
        {!isSearching && (
          <>
            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[16px] font-bold tracking-[-0.4px]" style={{ color: 'var(--preview-text-primary)' }}>
                    Recent Searches
                  </span>
                  <button
                    onClick={handleClearAll}
                    className="text-[12px] font-semibold"
                    style={{ color: 'var(--preview-accent)' }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(chip => (
                    <div
                      key={chip}
                      className="border rounded-full px-[13px] py-[7px] flex items-center gap-[6px]"
                      style={{ backgroundColor: 'var(--preview-surface)', borderColor: 'var(--preview-border)' }}
                    >
                      <button
                        onClick={() => handleChipPress(chip)}
                        className="text-[12px]"
                        style={{ color: 'var(--preview-text-primary)' }}
                      >
                        {chip}
                      </button>
                      <button
                        onClick={() => handleRemoveChip(chip)}
                        className="flex items-center"
                        style={{ color: 'var(--preview-text-secondary)' }}
                        aria-label={`Remove ${chip}`}
                      >
                        <X style={{ width: 8, height: 8 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {trendingItems.length > 0 && (
              <section>
                <div className="mb-3">
                  <span className="text-[16px] font-bold tracking-[-0.4px]" style={{ color: 'var(--preview-text-primary)' }}>
                    Trending Dishes
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {trendingItems.map(item => (
                    <PreviewMenuItemCard
                      key={item.id}
                      item={item}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                      isInCart={isInCart}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Floating "Menu" button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={onClose}
          className="rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
          style={{ backgroundColor: 'var(--preview-nav-bg)' }}
        >
          <svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="var(--preview-accent-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-[1.1px]" style={{ color: 'var(--preview-accent-text)' }}>
            MENU
          </span>
        </button>
      </div>
    </div>
  );
};

export default SearchScreen;
