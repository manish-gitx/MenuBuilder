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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Menu Not Found
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            The menu you&apos;re looking for doesn&apos;t exist or the share link is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 sm:px-2 lg:px-8 pb-24">
        <div className="py-4 sm:py-6">
          <div className="text-start mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {menu.name}
            </h1>
            {menu.description && (
              <p className="text-base sm:text-lg text-muted-foreground">
                {menu.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm font-medium tracking-wider uppercase">
                Menu
              </span>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full pl-12 pr-4 rounded-full text-center shadow-sm bg-gray-50 border border-gray-200 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base placeholder:text-gray-400"
              placeholder="Search for dishes"
            />
          </div>

          <div className="my-4 border-t w-full" style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}></div>

          {/* Filtered Categories */}
          <div className="space-y-2 sm:space-y-4">
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
        </div>

        {cart.length > 0 && <Cart cart={cart} menuName={menu.name} />}
      </div>
    </div>
  );
};

export default Page;
