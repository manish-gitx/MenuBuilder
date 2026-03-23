"use client"
import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const id = params.id as string;

  const CART_KEY = `mb_cart_${id}`;
  const CAT_KEY = `mb_openCat_${id}`;
  const SEARCH_KEY = `mb_searches`;
  const REF_KEY = `mb_ref_${id}`;

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
  const [hasScrolled, setHasScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [referrerPhone, setReferrerPhone] = useState<string | undefined>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const addToCart = (item: MenuItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (item: MenuItem) =>
    setCart(prev => prev.filter(c => c.id !== item.id));
  const isInCart = (item: MenuItem) => cart.some(c => c.id === item.id);

  // Store referral code from URL param and fetch referrer phone
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) ls.set(REF_KEY, ref);
    const code = ref ?? ls.get(REF_KEY);
    if (code) {
      fetch(`/api/referrers/${encodeURIComponent(code)}`)
        .then(r => r.ok ? r.json() : null)
        .then(json => { if (json?.data?.phone) setReferrerPhone(json.data.phone); })
        .catch(() => {});
    }
  }, [searchParams, REF_KEY]);

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

  // Track scroll to swap header
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      setHasScrolled(container.scrollTop > 10);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // Measure header height so scroll container padding stays correct
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(entries => {
      setHeaderHeight(entries[0].contentRect.height);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, [loading]);

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

  const { id: themeId, tokens } = getTheme(menu?.theme ?? 'default')

  // Prevent white flash on overscroll bounce by syncing body bg to theme
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = tokens['--preview-bg']
    return () => { document.body.style.backgroundColor = prev }
  }, [tokens])

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
    <PreviewThemeContext.Provider value={{ themeId }}>
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ ...(tokens as React.CSSProperties), backgroundColor: 'var(--preview-bg)', fontFamily: 'var(--preview-font-family)' }}
    >
      {/* ── Header ── */}
      <div
        ref={headerRef}
        className="z-40 backdrop-blur-[6px] border-b px-4 min-[390px]:px-6 flex-shrink-0"
        style={{ backgroundColor: 'var(--preview-surface-muted)', borderColor: 'var(--preview-border)' }}
      >
        {hasScrolled ? (
          /* Scrolled state: search bar */
          <div className="py-4">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 w-full rounded-full px-4 py-2"
              style={{ backgroundColor: 'var(--preview-surface-low)' }}
              aria-label="Search"
            >
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <circle cx="7.5" cy="7.5" r="6" stroke="var(--preview-text-muted)" strokeWidth="1.5" />
                <path d="M12 12L16.5 16.5" stroke="var(--preview-text-muted)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] min-[390px]:text-sm truncate" style={{ color: 'var(--preview-text-muted)' }}>
                Search dishes...
              </span>
            </button>
          </div>
        ) : (
          /* Default state: restaurant name + search icon */
          <div className="py-4 flex items-center justify-between">
            <div className="flex gap-2 min-w-0 flex-1 mr-3">
              <span
                className={`text-[17px] min-[390px]:text-[19px] sm:text-xl md:text-[22px] font-bold tracking-[-0.5px] truncate min-w-0${themeId === 'midnight' ? ' gold-shine' : ''}`}
                style={themeId === 'midnight' ? undefined : { color: 'var(--preview-text-primary)' }}
              >
                {menu.name}
              </span>
            </div>
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
        )}
      </div>

      {/* ── Scrollable content ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-y-contain"
        style={{
          paddingLeft: 'var(--preview-scroll-px)',
          paddingRight: 'var(--preview-scroll-px)',
          paddingBottom: cart.length > 0 ? '160px' : '120px',
          ['--sticky-top' as string]: '0px',
        } as React.CSSProperties}
      >
        {categories && (
          <ThemeRenderer
            themeId={themeId}
            categories={categories}
            openCategoryId={openCategoryId}
            onToggleCategory={(id) => {
              setOpenCategoryId(prev => {
                if (prev === id) return null;
                setTimeout(() => {
                  const el = document.getElementById(`category-${id}`);
                  if (el && scrollRef.current) {
                    const containerTop = scrollRef.current.getBoundingClientRect().top;
                    const elTop = el.getBoundingClientRect().top;
                    const offset = headerRef.current ? headerRef.current.getBoundingClientRect().height + 16 : 72;
                    scrollRef.current.scrollBy({ top: elTop - containerTop - offset, behavior: "smooth" });
                  }
                }, 50);
                return id;
              });
            }}
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
                const offset = headerRef.current ? headerRef.current.getBoundingClientRect().height + 16 : 72;
                scrollRef.current.scrollBy({
                  top: elTop - containerTop - offset,
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
            menuId={menu.id}
            storageKey={id}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setCart([]);
              ls.del(CART_KEY);
              setShowConfirm(false);
            }}
            categories={categories ?? []}
            referralCode={ls.get(REF_KEY) ?? undefined}
            referrerPhone={referrerPhone}
          />
        </div>
      )}
    </div>
    </PreviewThemeContext.Provider>
  );
};

export default Page;
