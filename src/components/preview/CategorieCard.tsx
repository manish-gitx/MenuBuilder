

import React, { useState } from "react";
import { Category, MenuItem } from "../../lib/api";
import { ChevronDown, ChevronUp } from "lucide-react";
import PreviewMenuItemCard from "./PreviewMenuItemCard";

interface CategorieCardProps {
  category: Category;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

const CategorieCard = ({ category, addToCart, removeFromCart, isInCart }: CategorieCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const renderMenuItems = (items: any[]) => {
    return items.map((item, index) => (
      <React.Fragment key={item.id}>
        <PreviewMenuItemCard 
          item={item} 
          addToCart={addToCart} 
          removeFromCart={removeFromCart} 
          isInCart={isInCart} 
        />
        {index < items.length - 1 && (
          <div
            className="my-6 border-t-1 w-full mx-0"
            style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
          ></div>
        )}
      </React.Fragment>
    ));
  };

  const hasSubCategories = category.childCategories && category.childCategories.length > 0;

  return (
    <>
      <div className="px-6 py-2">
        <div className="flex justify-between mb-4">
          <div className="font-bold text-xl">{category.name}</div>
          <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>

        {isOpen && (
          <div>
            {hasSubCategories ? (
              category.childCategories.map((childCategory, index) => (
                <div key={childCategory.id}>
                  <SubCategoryCard 
                    category={childCategory} 
                    addToCart={addToCart} 
                    removeFromCart={removeFromCart} 
                    isInCart={isInCart} 
                  />
                  {index < category.childCategories.length - 1 && (
                     <div
                     className="my-7 border-t-1 w-full mx-0"
                     style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
                   ></div>
                  )}
                </div>
              ))
            ) : (
              renderMenuItems(category.menuItems || [])
            )}
          </div>
        )}
      </div>
      <div className="h-4 py-2 border-b-[16px] border-b-[rgba(2,6,12,0.05)]"></div>
    </>
  );
};

interface SubCategoryCardProps {
  category: Category;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

const SubCategoryCard = ({ category, addToCart, removeFromCart, isInCart }: SubCategoryCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const renderMenuItems = (items: any[]) => {
    return items.map((item, index) => (
      <React.Fragment key={item.id}>
        <PreviewMenuItemCard 
          item={item} 
          addToCart={addToCart} 
          removeFromCart={removeFromCart} 
          isInCart={isInCart} 
        />
        {index < items.length - 1 && (
          <div
            className="my-6 border-t-1 w-full mx-0"
            style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
          ></div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="text-base font-bold">{category.name}</div>
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {isOpen && <div>{renderMenuItems(category.menuItems || [])}</div>}
    </div>
  );
};

export default CategorieCard;
