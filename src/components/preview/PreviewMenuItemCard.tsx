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
      return '/veg-icon.svg';
    }
    if (dietaryTag?.name.toLowerCase() === 'non-vegetarian') {
      return '/non-veg-icon.svg';
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
    <div className="flex justify-between items-start">
      {/* Left side */}
      <div className="flex-1 pr-4 min-w-0">
        {dietaryIcon && (
          <div className="mb-1">
            <img
              src={dietaryIcon}
              alt="dietary icon"
              className="w-6 h-6"
            />
          </div>
        )}
        <div className="text-base font-bold">{item.name}</div>
        {item.description && (
          <div className="mt-3 break-words font-light text-base leading-[21px] tracking-[-0.4px] text-[rgba(2,6,12,0.6)]">
            <p 
              ref={descriptionRef} 
              className={`${!isExpanded ? 'line-clamp-2' : ''}`}>
              {item.description}
            </p>
            {(isOverflowing || isExpanded) && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="text-gray-400 font-bold text-xs mt-1"
              >
                {isExpanded ? '...less' : 'more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex-shrink-0 w-32 md:w-40">
        <div className="relative">
          <div className="w-full h-28 md:h-36 mb-2 rounded-md">
            {item.imageUrl ? (
              <img
                style={{borderRadius:"5px"}}
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-md"></div>
            )}
          </div>
          <div className="absolute bottom-[-1rem] left-1/2 -translate-x-1/2">
            <button
              onClick={handleCartAction}
              className={`
                font-semibold
                text-lg
                leading-[22px]
                tracking-tight
                w-28
                text-center
                py-2
                px-3
                rounded-lg
                shadow-md
                transition-colors duration-300 ease-in-out
                ${isInCart(item) ? 'bg-[#1ba672] text-white' : 'bg-white text-[#1ba672] border border-gray-200'}`
              }
            >
              {isInCart(item) ? 'ADDED' : 'ADD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMenuItemCard;