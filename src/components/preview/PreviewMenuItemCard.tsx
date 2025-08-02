import React, { useState, useRef, useEffect } from "react";
import { MenuItem } from "../../lib/api";

const PreviewMenuItemCard = ({ item }: { item: MenuItem }) => {
  const [isAdded, setIsAdded] = useState(false);
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
    const element = descriptionRef.current;
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [item.description]);

  return (
    <div className={`flex justify-between ${!isExpanded ? 'max-h-[164px]' : ''}`}>
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
      <div className="flex-shrink-0 flex flex-col items-center justify-start w-[156px]">
        <div className="w-[156px] h-[110px] mb-2 rounded-md">
          {item.imageUrl ? (
            <img
              style={{borderRadius:"5px"}}
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-scale-down"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md"></div>
          )}
        </div>

        <div>
          <button
            onClick={() => setIsAdded(!isAdded)}
            className={`
              font-semibold
              text-lg
              leading-[22px]
              tracking-tight
              w-[120px]
              text-center
              p-3
              rounded-lg
              shadow-md
              transition-colors duration-300 ease-in-out
              ${isAdded ? 'bg-[#1ba672] text-white' : 'bg-white text-[#1ba672]'}
            `}
          >
            {isAdded ? 'ADDED' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewMenuItemCard;