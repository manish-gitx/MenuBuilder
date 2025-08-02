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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Menu Not Found
          </h1>
          <p className="text-muted-foreground">
            The menu you&apos;re looking for doesn&apos;t exist or the share link is
            invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto pb-24">
        <div className="px-6 py-8">
          <div className="text-start mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {menu.name}
            </h1>
            {menu.description && <p className="text-lg ">{menu.description}</p>}
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-center text-base">
              MENU
            </div>

            <div>
              <input
                type="text"
                className="h-14 w-full rounded text-center z-0 shadow bg-[rgba(2,6,12,0.05)]"
                placeholder="Search for dishes"
              />
            </div>
          </div>
        </div>

        <div className="my-2 border-t-1 w-[calc(100%-32px)] mx-2" style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}></div>

        <div>
          {categories && categories.map((category,index)=> (
            <CategorieCard
            isLast={categories.length-1==index}
              key={category.id} 
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
  );
};

export default Page;
