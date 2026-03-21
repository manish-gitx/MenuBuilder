"use client"
import React from "react";
import { ThemeId } from "@/lib/themes";
import { Category, MenuItem } from "@/lib/api";
import DefaultCategorieCard from "./themes/default/CategorieCard";
import MidnightCategorieCard from "./themes/midnight/CategorieCard";

interface ThemeRendererProps {
  themeId: ThemeId;
  categories: Category[];
  openCategoryId: string | null;
  onToggleCategory: (id: string) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY: Record<ThemeId, React.ComponentType<any>> = {
  default: DefaultCategorieCard,
  midnight: MidnightCategorieCard,
};

export default function ThemeRenderer({
  themeId,
  categories,
  openCategoryId,
  onToggleCategory,
  addToCart,
  removeFromCart,
  isInCart,
}: ThemeRendererProps) {
  const CategorieCard = REGISTRY[themeId] ?? DefaultCategorieCard;
  return (
    <>
      {categories.map((category, index) => (
        <div key={category.id} id={`category-${category.id}`}>
          <CategorieCard
            category={category}
            isLast={index === categories.length - 1}
            isOpen={openCategoryId === category.id}
            onToggle={() => onToggleCategory(category.id)}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            isInCart={isInCart}
          />
        </div>
      ))}
    </>
  );
}
