import React, { useState, useRef, useEffect } from "react";
import { MenuItem } from "../../lib/api";

interface PreviewMenuItemCardProps {
  item: MenuItem;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

const PreviewMenuItemCard = ({ item, addToCart, removeFromCart, isInCart }: PreviewMenuItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const getDietaryIcon = () => {
    const dietaryTag = item.tags?.find(tag => tag.type === 'dietary');
    if (dietaryTag?.name.toLowerCase() === 'vegetarian') {
      return '/veg-icon.png';
    }
    if (dietaryTag?.name.toLowerCase() === 'non-vegetarian') {
      return '/non-veg-icon.png';
    }
    return null;
  };

  const dietaryIcon = getDietaryIcon();

  useEffect(() => {
    const checkOverflow = () => {
      const element = descriptionRef.current;
      if (element) {
        setIsOverflowing(element.scrollHeight > element.clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [item.description]);

  const handleCartAction = () => {
    if (isInCart(item)) {
      removeFromCart(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="w-full py-4 px-4 sm:px-6 sm:py-2  last:border-b-0">
      <div className="flex justify-between items-start gap-4 sm:gap-6">
        {/* Left side - Content */}
        <div className="flex-1 min-w-0 pr-4">
          {/* Dietary icon */}
          {dietaryIcon && (
            <div className="mb-3">
              <img
                src={dietaryIcon}
                alt="dietary icon"
                className="w-4 h-4"
              />
            </div>
          )}

          {/* Item name */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-tight">
            {item.name}
          </h3>

       
          {/* Description */}
          {item.description && (
            <div className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-none">
              <p 
                ref={descriptionRef} 
                className={`${!isExpanded ? 'line-clamp-2' : ''}`}
              >
                {item.description}
              </p>
              {(isOverflowing || isExpanded) && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="text-gray-500 font-medium text-sm mt-2 hover:text-gray-700 transition-colors"
                >
                  {isExpanded ? '...less' : '...more'}
                </button>
              )}
            </div>
          )}

          {/* Customizable label for mobile */}
          
        </div>

        {/* Right side - Image and button */}
        <div className="flex-shrink-0 relative">
          {item.imageUrl ? (
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-xl shadow-sm"
              />
              <button
                onClick={handleCartAction}
                className={`
                  absolute -bottom-3 left-1/2 -translate-x-1/2
                  text-sm font-semibold
                  px-4 py-2
                  rounded-lg
                  border shadow-md
                  transition-all duration-200
                  min-w-[80px]
                  ${isInCart(item) 
                    ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                    : 'bg-white text-green-600 border-green-600 hover:bg-green-50'
                  }
                `}
              >
                {isInCart(item) ? 'ADDED' : 'ADD'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-3">
              
             
              <button
                onClick={handleCartAction}
                className={`
                  text-sm font-semibold
                  px-5 py-2.5
                  rounded-lg
                  border shadow-md
                  transition-all duration-200
                  min-w-[90px]
                  ${isInCart(item) 
                    ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                    : 'bg-white text-green-600 border-green-600 hover:bg-green-50'
                  }
                `}
              >
                {isInCart(item) ? 'ADDED' : 'ADD'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewMenuItemCard;