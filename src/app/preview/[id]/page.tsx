"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  menuApi,
  Menu,
  Category,
  MenuItem,
} from "../../../lib/api";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import CategorieCard from "@/components/preview/CategorieCard";
import Cart from "@/components/preview/Cart";
import { sortFullMenu } from "@/lib/utils";
import { Search } from "lucide-react";

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (item: MenuItem) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== item.id)
    );
  };

  const isInCart = (item: MenuItem) => {
    return cart.some((cartItem) => cartItem.id === item.id);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await menuApi.getMenuByShareToken(id);
        setMenu(response.data.menu);
        setCategories(sortFullMenu(response.data.categories));
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Failed to load menu. Please check the share link.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id]);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    const query = searchQuery.toLowerCase();

    return categories
      .map((category) => {
        const filteredItems = (category.menuItems || []).filter((item) =>
          item.name.toLowerCase().includes(query)
        );

        return {
          ...category,
          menuItems: filteredItems,
        };
      })
      .filter((category) => (category.menuItems?.length || 0) > 0);
  }, [categories, searchQuery]);

  if (loading) {
    return <LoadingScreen variant="light" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Something went wrong</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Menu Not Found</h1>
          <p className="text-muted-foreground">
            The menu you&apos;re looking for doesn&apos;t exist or the share link is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Elegant header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h18v2H3V3zm0 8h18v2H3v-2zm0 8h18v2H3v-2z" opacity="0.3"/>
              <path d="M8 6h13v2H8V6zm0 8h13v2H8v-2zM3 6h3v2H3V6zm0 8h3v2H3v-2z"/>
            </svg>
            <span>MenuCraft</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">
            {menu.name}
          </h1>
          {menu.description && (
            <p className="text-white/80 text-base sm:text-lg max-w-xl">
              {menu.description}
            </p>
          )}
        </div>
      </div>

      {/* Search bar pinned below header */}
      <div className="bg-white border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto max-w-3xl px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
              placeholder="Search for dishes..."
            />
          </div>
        </div>
      </div>

      {/* Menu content */}
      <div className="container mx-auto max-w-3xl px-4 pb-32 pt-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map((category, index) => (
              <CategorieCard
                key={category.id}
                isInitiallyOpen={index === 0}
                isLast={index === filteredCategories.length - 1}
                category={category}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                isInCart={isInCart}
              />
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && <Cart cart={cart} menuName={menu.name} />}
    </div>
  );
};

export default Page;
