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
        className="w-full border-b py-[14px] min-[390px]:py-[16px] px-[8px] flex items-center justify-between gap-2"
        style={{ borderColor: 'var(--preview-border)', backgroundColor: 'var(--preview-bg)' }}
      >
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <span
            className="text-[15px] min-[390px]:text-[17px] min-[430px]:text-[18px] sm:text-lg md:text-xl font-semibold leading-snug min-w-0  truncate"
            style={{
              color: 'var(--preview-text-primary)',
              textTransform: 'var(--preview-cat-name-transform)' as React.CSSProperties['textTransform'],
              letterSpacing: 'var(--preview-cat-name-tracking)',
            }}
          >
            {category.name}
          </span>
          <span
            className="flex-shrink-0 px-[8px] py-[2px] text-[9px] min-[390px]:text-[10px] sm:text-xs md:text-sm font-normal leading-[16px] mt-[3px]"
            style={{
              backgroundColor: 'var(--preview-surface-low)',
              color: 'var(--preview-text-secondary)',
              borderRadius: 'var(--preview-count-radius)',
            }}
          >
            {totalCount}
          </span>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 7L6 2L11 7" stroke="var(--preview-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="var(--preview-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                  <div key={subCat.id} id={`subcategory-${subCat.id}`}>
                    {/* Sub-cat label */}
                    <div className="px-[8px] pt-[24px] pb-[12px]" style={{ backgroundColor: 'var(--preview-bg)' }}>
                      <span
                        className="text-xs sm:text-[13px] md:text-sm font-normal uppercase"
                        style={{
                          color: isNonVeg ? '#ffb4ab' : isVeg(subItems) ? '#86efac' : 'var(--preview-accent)',
                          letterSpacing: 'var(--preview-subcat-tracking)',
                        }}
                      >
                        {subCat.name}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="px-[0px] pb-[8px] flex flex-col gap-[16px]" style={{ backgroundColor: 'var(--preview-bg)' }}>
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

                    {idx < category.childCategories!.length - 1 && (
                      <div className="h-px mx-0" style={{ backgroundColor: 'var(--preview-border)' }} />
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="pt-[8px] pb-[8px] flex flex-col gap-[16px]" style={{ backgroundColor: 'var(--preview-bg)' }}>
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

      {/* Gap between categories */}
      <div className="h-[8px]" style={{ backgroundColor: 'var(--preview-bg)' }} />
    </div>
  );
};

function isVeg(items: MenuItem[]): boolean {
  const tag = items[0]?.tags?.find(t => t.type === "dietary");
  if (!tag) return false;
  return tag.name.toLowerCase().includes("vegetarian") && !tag.name.toLowerCase().includes("non");
}

export default CategorieCard;
