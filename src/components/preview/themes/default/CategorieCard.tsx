"use client"
import React from "react";
import { Category, MenuItem } from "../../../../lib/api";
import PreviewMenuItemCard from "./PreviewMenuItemCard";

interface CategorieCardProps {
  category: Category;
  isLast: boolean;
  isOpen: boolean;
  onToggle: () => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

const CategorieCard = ({
  category,
  isOpen,
  onToggle,
  addToCart,
  removeFromCart,
  isInCart,
}: CategorieCardProps) => {
  const hasSubCategories =
    category.childCategories && category.childCategories.length > 0;
  const directItems = category.menuItems ?? [];
  const totalCount =
    directItems.length +
    (category.childCategories?.reduce(
      (s, c) => s + (c.menuItems?.length ?? c._count?.menuItems ?? 0),
      0
    ) ?? 0);

  return (
    <div className="isolate w-full">
      {/* Category header */}
      <button
        onClick={onToggle}
        className="w-full bg-[#f9f9fb] border-b border-[rgba(172,179,184,0.05)] py-3 px-4 min-[390px]:px-6 flex items-center justify-between gap-2"
      >
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <span className="text-[15px] min-[390px]:text-[17px] min-[430px]:text-[18px] sm:text-lg md:text-xl font-black text-[#2d3338] tracking-[-0.45px] leading-snug min-w-0  truncate">
            {category.name}
          </span>
          <span className="flex-shrink-0 bg-[#ebeef2] rounded-[4px] px-2 py-[2px] text-[9px] min-[390px]:text-[10px] sm:text-[11px] md:text-xs font-medium text-[rgba(89,96,101,0.6)] uppercase tracking-[1px] mt-[3px]">
            {totalCount} Items
          </span>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 7L6 2L11 7" stroke="#596065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="#596065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </button>

      {/* Items container */}
      {isOpen && (
        <div>
          {hasSubCategories ? (
            <>
              {category.childCategories!.map((subCat, idx) => {
                const subItems = subCat.menuItems ?? [];
                const dietaryTag = subItems[0]?.tags?.find(t => t.type === "dietary");
                const isNonVeg =
                  dietaryTag?.name.toLowerCase().includes("non-vegetarian") ||
                  dietaryTag?.name.toLowerCase().includes("non vegetarian");

                return (
                  <div key={subCat.id} id={`subcategory-${subCat.id}`} className="relative">
                    {/* Sub-cat header */}
                    <div className="backdrop-blur-[2px] bg-[rgba(242,244,246,0.95)] border-b border-[rgba(172,179,184,0.05)] py-2 px-4 flex items-center gap-1">
                      <div
                        className="size-[6px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: isNonVeg ? "#dc2626" : "#16a34a" }}
                      />
                      <span
                        className="text-[10px] sm:text-[11px] md:text-xs font-extrabold uppercase tracking-[1px]"
                        style={{ color: isNonVeg ? "#b91c1c" : "#15803d" }}
                      >
                        {subCat.name}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="bg-[rgba(255,255,255,0.5)] p-4 flex flex-col gap-4">
                      {subItems.map(item => (
                        <PreviewMenuItemCard
                          key={item.id}
                          item={item}
                          addToCart={addToCart}
                          removeFromCart={removeFromCart}
                          isInCart={isInCart}
                        />
                      ))}
                    </div>

                    {/* Divider between sub-cat groups */}
                    {idx < category.childCategories!.length - 1 && (
                      <div className="bg-[#f2f4f6] h-px mx-4" />
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="p-4 flex flex-col gap-4">
              {directItems.map(item => (
                <PreviewMenuItemCard
                  key={item.id}
                  item={item}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  isInCart={isInCart}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8px gap between categories */}
      <div className="bg-[#f9f9fb] h-2" />
    </div>
  );
};

export default CategorieCard;
