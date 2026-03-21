"use client"
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { menuApi, Menu, Category, MenuItem } from "../../../lib/api";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import CategorieCard from "@/components/preview/CategorieCard";
import SearchScreen from "@/components/preview/SearchScreen";
import OrderConfirmScreen from "@/components/preview/OrderConfirmScreen";
import CategorySelectModal from "@/components/preview/CategorySelectModal";
import { sortFullMenu } from "@/lib/utils";

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

  return (
    <div className="h-screen bg-[#f9f9fb] flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-[6px] bg-[rgba(249,249,251,0.95)] border-b border-[rgba(172,179,184,0.1)] py-4 px-6 flex items-center justify-between">
        {/* Left: hamburger + restaurant name */}
        <div className="flex items-center gap-3">
          <button className="flex-shrink-0" aria-label="Open menu">
            {/* Hamburger 3-lines SVG 18×12 */}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <rect x="0" y="0" width="18" height="2" rx="1" fill="#2d3338" />
              <rect x="0" y="5" width="18" height="2" rx="1" fill="#2d3338" />
              <rect x="0" y="10" width="18" height="2" rx="1" fill="#2d3338" />
            </svg>
          </button>
          <span className="text-[20px] font-bold text-[#2d3338] tracking-[-0.5px]">
            {menu.name}
          </span>
        </div>

        {/* Right: search icon */}
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center justify-center"
          aria-label="Search"
        >
          {/* Magnifying glass SVG 18×18 */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="#2d3338" strokeWidth="1.5" />
            <path d="M12 12L16.5 16.5" stroke="#2d3338" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-[65px] pb-32"
      >
        {categories &&
          categories.map((category, index) => (
            <div key={category.id} id={`category-${category.id}`}>
              <CategorieCard
                isOpen={openCategoryId === category.id}
                onToggle={() =>
                  setOpenCategoryId(prev =>
                    prev === category.id ? null : category.id
                  )
                }
                isLast={categories.length - 1 === index}
                category={category}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                isInCart={isInCart}
              />
            </div>
          ))}
      </div>

      {/* ── Floating "Menu" button ── */}
      <div className="fixed bottom-[88px] right-4 z-40">
        <button
          onClick={() => setShowMenuModal(true)}
          className="bg-[#5c5c63] rounded-[16px] px-5 py-3 flex items-center gap-2 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          {/* Fork/utensils icon 15×15 */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
          </svg>
          <span className="text-white text-[14px] font-bold">Menu</span>
        </button>
      </div>

      {/* ── Cart bar ── */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="bg-[#2d3338] border border-[rgba(255,255,255,0.05)] rounded-[16px] p-[17px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-center justify-between gap-3">
            {/* Left side */}
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
            >
              {/* Orange badge */}
              <div className="flex-shrink-0 size-[32px] rounded-[8px] bg-[#a04100] flex items-center justify-center">
                <span className="text-[14px] font-bold text-[#fff6f3]">
                  {cart.length}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#f9f9fb] leading-none mb-[3px]">
                  Review Order
                </p>
                <p className="text-[10px] text-[rgba(221,227,233,0.6)] truncate">
                  {previewText}
                </p>
              </div>
            </button>

            {/* Right: checkout button */}
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-shrink-0 bg-[#a04100] rounded-[12px] px-5 py-2 text-[12px] font-black uppercase tracking-[1.2px] text-[#fff6f3]"
            >
              CHECKOUT
            </button>
          </div>
        </div>
      )}

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
  );
};

export default Page;
