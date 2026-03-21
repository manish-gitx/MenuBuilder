"use client"
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { menuApi, Menu, Category, MenuItem } from "../../../lib/api";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import ThemeRenderer from "@/components/preview/ThemeRenderer";
import ThemeChrome from "@/components/preview/ThemeChrome";
import SearchScreen from "@/components/preview/SearchScreen";
import OrderConfirmScreen from "@/components/preview/OrderConfirmScreen";
import CategorySelectModal from "@/components/preview/CategorySelectModal";
import { sortFullMenu } from "@/lib/utils";
import { getTheme } from "@/lib/themes";
import { PreviewThemeContext } from "@/contexts/PreviewThemeContext";

const ls = {
  get: (key: string) => { try { return localStorage.getItem(key); } catch { return null; } },
  set: (key: string, val: string) => { try { localStorage.setItem(key, val); } catch {} },
  del: (key: string) => { try { localStorage.removeItem(key); } catch {} },
};

const getTotalItemCount = (category: Category): number => {
  const direct = category.menuItems?.length ?? category._count?.menuItems ?? 0;
  const sub =
    category.childCategories?.reduce(
      (sum, c) => sum + (c.menuItems?.length ?? c._count?.menuItems ?? 0),
      0
    ) ?? 0;
  return direct + sub;
};

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const CART_KEY = `mb_cart_${id}`;
  const CAT_KEY = `mb_openCat_${id}`;
  const SEARCH_KEY = `mb_searches`;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<MenuItem[]>(() => {
    const saved = ls.get(`mb_cart_${id}`);
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return [];
  });
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = ls.get(`mb_searches`);
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return [];
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const addToCart = (item: MenuItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (item: MenuItem) =>
    setCart(prev => prev.filter(c => c.id !== item.id));
  const isInCart = (item: MenuItem) => cart.some(c => c.id === item.id);

  // Persist cart
  useEffect(() => {
    ls.set(CART_KEY, JSON.stringify(cart));
  }, [cart, CART_KEY]);

  // Persist recent searches
  useEffect(() => {
    ls.set(SEARCH_KEY, JSON.stringify(recentSearches));
  }, [recentSearches, SEARCH_KEY]);

  // Persist open category
  useEffect(() => {
    if (openCategoryId) ls.set(CAT_KEY, openCategoryId);
  }, [openCategoryId, CAT_KEY]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await menuApi.getMenuByShareToken(id);
        setMenu(response.data.menu);
        const sorted = sortFullMenu(response.data.categories);
        setCategories(sorted);
        // Restore saved category or fall back to first
        const savedCatId = ls.get(CAT_KEY);
        const valid = sorted.find(c => c.id === savedCatId);
        setOpenCategoryId(valid?.id ?? sorted[0]?.id ?? null);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Failed to load menu. Please check the share link.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMenu();
  }, [id]);

  const previewText = cart
    .slice(0, 3)
    .map(i => i.name)
    .join(", ")
    .concat(cart.length > 3 ? ` +${cart.length - 3} more` : "");

  if (loading) return <LoadingScreen variant="light" />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9f9fb] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2d3338] mb-2">Error</h1>
          <p className="text-[#596065]">{error}</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-[#f9f9fb] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2d3338] mb-2">Menu Not Found</h1>
          <p className="text-[#596065]">
            The menu you&apos;re looking for doesn&apos;t exist or the share link is invalid.
          </p>
        </div>
      </div>
    );
  }

  const { id: themeId, tokens } = getTheme(menu.theme ?? 'default')

  return (
    <PreviewThemeContext.Provider value={{ themeId }}>
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ ...(tokens as React.CSSProperties), backgroundColor: 'var(--preview-bg)', fontFamily: 'var(--preview-font-family)' }}
    >
      {/* ── Header ── */}
      <div
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-[6px] border-b py-4 px-6 flex items-center justify-between"
        style={{ backgroundColor: 'var(--preview-surface-muted)', borderColor: 'var(--preview-border)' }}
      >
        {/* Left: hamburger + restaurant name */}
        <div className="flex items-center gap-3">
          <button className="flex-shrink-0" aria-label="Open menu">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <rect x="0" y="0" width="18" height="2" rx="1" fill="var(--preview-text-primary)" />
              <rect x="0" y="5" width="18" height="2" rx="1" fill="var(--preview-text-primary)" />
              <rect x="0" y="10" width="18" height="2" rx="1" fill="var(--preview-text-primary)" />
            </svg>
          </button>
          <span className="text-[20px] font-bold tracking-[-0.5px]" style={{ color: 'var(--preview-text-primary)' }}>
            {menu.name}
          </span>
        </div>

        {/* Right: search icon */}
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center justify-center"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="var(--preview-text-primary)" strokeWidth="1.5" />
            <path d="M12 12L16.5 16.5" stroke="var(--preview-text-primary)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-32"
        style={{
          paddingTop: 'var(--preview-scroll-pt)',
          paddingLeft: 'var(--preview-scroll-px)',
          paddingRight: 'var(--preview-scroll-px)',
        }}
      >
        {categories && (
          <ThemeRenderer
            themeId={themeId}
            categories={categories}
            openCategoryId={openCategoryId}
            onToggleCategory={(id) =>
              setOpenCategoryId(prev => prev === id ? null : id)
            }
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            isInCart={isInCart}
          />
        )}
      </div>

      {/* ── Menu button + Cart bar (themed) ── */}
      <ThemeChrome
        themeId={themeId}
        cart={cart}
        previewText={previewText}
        onShowConfirm={() => setShowConfirm(true)}
        onShowMenuModal={() => setShowMenuModal(true)}
      />

      {/* ── Category Select Modal ── */}
      {showMenuModal && categories && (
        <CategorySelectModal
          categories={categories}
          onClose={() => setShowMenuModal(false)}
          onSelectCategory={(categoryId, subCategoryId) => {
            setOpenCategoryId(categoryId);
            setTimeout(() => {
              const targetId = subCategoryId
                ? `subcategory-${subCategoryId}`
                : `category-${categoryId}`;
              const el = document.getElementById(targetId);
              if (el && scrollRef.current) {
                const containerTop = scrollRef.current.getBoundingClientRect().top;
                const elTop = el.getBoundingClientRect().top;
                scrollRef.current.scrollBy({
                  top: elTop - containerTop - 8,
                  behavior: "smooth",
                });
              }
            }, 50);
          }}
        />
      )}

      {/* ── Overlays ── */}
      {showSearch && (
        <div className="fixed inset-0 z-50">
          <SearchScreen
            onClose={() => setShowSearch(false)}
            categories={categories ?? []}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            isInCart={isInCart}
            recentSearches={recentSearches}
            setRecentSearches={setRecentSearches}
          />
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50">
          <OrderConfirmScreen
            cart={cart}
            menuName={menu.name}
            storageKey={id}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setCart([]);
              ls.del(CART_KEY);
              setShowConfirm(false);
            }}
            categories={categories ?? []}
          />
        </div>
      )}
    </div>
    </PreviewThemeContext.Provider>
  );
};

export default Page;
