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
  const inCart = isInCart(item);

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
    if (inCart) {
      removeFromCart(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="px-5 py-4">
      <div className="flex items-start gap-4">
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          {/* Dietary badge */}
          {dietaryIcon && (
            <img src={dietaryIcon} alt="dietary" className="w-4 h-4 mb-2" />
          )}

          {/* Name */}
          <h3 className="text-base font-bold text-gray-800 leading-snug mb-1.5">
            {item.name}
          </h3>

          {/* Description */}
          {item.description && (
            <div className="text-sm text-gray-500 leading-relaxed">
              <p
                ref={descriptionRef}
                className={!isExpanded ? 'line-clamp-2' : ''}
              >
                {item.description}
              </p>
              {(isOverflowing || isExpanded) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary font-medium text-xs mt-1.5 hover:text-primary-hover transition-colors"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Image + Add button */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          {item.imageUrl ? (
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl shadow-sm"
              />
              {/* Overlay ADD button on image */}
              <button
                onClick={handleCartAction}
                className={`
                  absolute -bottom-3 left-1/2 -translate-x-1/2
                  text-xs font-bold px-4 py-1.5 rounded-lg
                  border shadow-md transition-all duration-200
                  min-w-[72px] whitespace-nowrap
                  ${inCart
                    ? 'bg-primary text-white border-primary hover:bg-primary-hover'
                    : 'bg-white text-primary border-primary hover:bg-primary/5'
                  }
                `}
              >
                {inCart ? '✓ ADDED' : '+ ADD'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleCartAction}
              className={`
                text-xs font-bold px-4 py-2 rounded-xl
                border transition-all duration-200
                min-w-[72px]
                ${inCart
                  ? 'bg-primary text-white border-primary hover:bg-primary-hover'
                  : 'bg-white text-primary border-primary hover:bg-primary/5'
                }
              `}
            >
              {inCart ? '✓ ADDED' : '+ ADD'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewMenuItemCard;
