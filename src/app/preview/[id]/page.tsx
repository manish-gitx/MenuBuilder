"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { menuApi, Menu, categoryApi, Category, MenuItem } from "../../../lib/api";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import CategorieCard from "@/components/preview/CategorieCard";
import Cart from "@/components/preview/Cart";
import { sortFullMenu } from "@/lib/utils";

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const [menu, setMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<MenuItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => [...prevCart, item]);
  };

  const removeFromCart = (item: MenuItem) => {
    setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== item.id));
  };

  const isInCart = (item: MenuItem) => {
    return cart.some(cartItem => cartItem.id === item.id);
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
            The menu you&apos;re looking for doesn&apos;t exist or the share link is
            invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main container with responsive width */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-2 lg:px-8 pb-24">
        {/* Header section */}
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

          {/* Search section */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="text-muted-foreground text-center text-sm sm:text-base font-medium">
              MENU
            </div>

            <div className="w-full">
              <input
                type="text"
                className="h-10 sm:h-12 w-full rounded-lg text-center shadow-sm bg-[rgba(2,6,12,0.05)] border border-transparent focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors text-sm sm:text-base"
                placeholder="Search for dishes"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="my-4 border-t w-full" 
          style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
        ></div>

        {/* Categories section */}
        <div className="space-y-2 sm:space-y-4">
          {categories && categories.map((category, index) => (
            <CategorieCard
              isInitiallyOpen={index === 0}
              isLast={categories.length - 1 === index}
              key={category.id}
              category={category}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              isInCart={isInCart}
            />
          ))}
        </div>
      </div>
      
      {/* Cart component - always responsive */}
      {cart.length > 0 && <Cart cart={cart} menuName={menu.name} />}
    </div>
  );
};

export default Page;