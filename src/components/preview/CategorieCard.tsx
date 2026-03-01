import React, { useState } from "react";
import { Category, MenuItem } from "../../lib/api";
import { ChevronDown, ChevronUp } from "lucide-react";
import PreviewMenuItemCard from "./PreviewMenuItemCard";

interface CategorieCardProps {
  category: Category;
  isLast: boolean;
  isInitiallyOpen: boolean;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

interface SubCategoryCardProps {
  category: Category;
  addToCart: (item: MenuItem) => void;
  isLast: boolean;
  isInitiallyOpen: boolean;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

const SubCategoryCard = ({ category, addToCart, removeFromCart, isInCart, isLast, isInitiallyOpen }: SubCategoryCardProps) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => (
      <React.Fragment key={item.id}>
        <PreviewMenuItemCard
          item={item}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          isInCart={isInCart}
        />
        {index < items.length - 1 && (
          <div className="border-t border-gray-100 my-1" />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Sub-category header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-foreground">{category.name}</span>
        <span className="text-muted-foreground ml-2 flex-shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {isOpen && (
        <div className="divide-y divide-gray-50">
          {renderMenuItems(category.menuItems || [])}
        </div>
      )}
    </div>
  );
};

const CategorieCard = ({ category, addToCart, removeFromCart, isInCart, isInitiallyOpen, isLast }: CategorieCardProps) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => (
      <React.Fragment key={item.id}>
        <PreviewMenuItemCard
          item={item}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          isInCart={isInCart}
        />
        {index < items.length - 1 && (
          <div className="border-t border-gray-100 mx-4" />
        )}
      </React.Fragment>
    ));
  };

  const hasSubCategories = category.childCategories && category.childCategories.length > 0;
  const itemCount = hasSubCategories
    ? category.childCategories.reduce((sum, c) => sum + (c.menuItems?.length || 0), 0)
    : (category.menuItems?.length || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3 shadow-sm">
      {/* Category header */}
      <button
        onClick={() => !hasSubCategories && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left ${!hasSubCategories ? 'hover:bg-gray-50 transition-colors cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-foreground">{category.name}</span>
          {itemCount > 0 && (
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </div>
        {!hasSubCategories && (
          <span className="text-muted-foreground flex-shrink-0">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        )}
      </button>

      {/* Category content */}
      {hasSubCategories ? (
        <div className="border-t border-gray-100">
          {category.childCategories.map((childCategory, index) => (
            <React.Fragment key={childCategory.id}>
              <SubCategoryCard
                category={childCategory}
                isInitiallyOpen={isInitiallyOpen && index === 0}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                isInCart={isInCart}
                isLast={index === category.childCategories.length - 1}
              />
              {index < category.childCategories.length - 1 && (
                <div className="border-t border-gray-100 mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        isOpen && (
          <div className="border-t border-gray-100">
            {renderMenuItems(category.menuItems || [])}
          </div>
        )
      )}
    </div>
  );
};

export default CategorieCard;
