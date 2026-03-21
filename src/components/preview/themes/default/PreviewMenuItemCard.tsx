"use client"
import React, { useState, useRef, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import { MenuItem } from "../../../../lib/api";

interface PreviewMenuItemCardProps {
  item: MenuItem;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

const PreviewMenuItemCard = ({
  item,
  addToCart,
  removeFromCart,
  isInCart,
}: PreviewMenuItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const dietaryTag = item.tags?.find(t => t.type === "dietary");
  const highlightTags = item.tags?.filter(t => t.type !== "dietary") ?? [];

  const isVeg =
    dietaryTag?.name.toLowerCase().includes("vegetarian") &&
    !dietaryTag?.name.toLowerCase().includes("non");
  const isNonVeg =
    dietaryTag?.name.toLowerCase().includes("non-vegetarian") ||
    dietaryTag?.name.toLowerCase().includes("non vegetarian");

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;
    const check = () => setIsOverflowing(el.scrollHeight > el.clientHeight + 2);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [item.description]);

  const handleCartAction = () => {
    if (isInCart(item)) removeFromCart(item);
    else addToCart(item);
  };

  const inCart = isInCart(item);

  return (
    <div className="bg-white border border-[rgba(172,179,184,0.05)] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-[13px] flex gap-4 items-start w-full">
      {/* LEFT: image */}
      <div className="flex-shrink-0 w-[96px] h-[96px] rounded-[12px] bg-[#ebeef2] overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#ebeef2] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#acb3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* RIGHT: content */}
      <div className="flex-1 flex flex-col justify-between self-stretch min-w-0">
        {/* Top row: name + add button */}
        <div className="flex items-start gap-2">
          <p className="text-[14px] font-bold text-[#2d3338] leading-[20px] flex-1 min-w-0">
            {item.name}
          </p>
          <button
            onClick={handleCartAction}
            className="flex-shrink-0 size-[20px] rounded-full bg-[#a04100] flex items-center justify-center"
          >
            {inCart ? (
              <Check className="text-white" style={{ width: 12, height: 12 }} />
            ) : (
              <Plus className="text-white" style={{ width: 12, height: 12 }} />
            )}
          </button>
        </div>

        {/* Description */}
        {item.description && (
          <div className="mt-[4px]">
            <p
              ref={descriptionRef}
              className={`text-[11px] text-[#596065] leading-[15.13px] ${!isExpanded ? "line-clamp-2" : ""}`}
            >
              {item.description}
            </p>
            {(isOverflowing || isExpanded) && (
              <button
                onClick={() => setIsExpanded(e => !e)}
                className="text-[10px] font-bold text-[#a04100] mt-[2px]"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        {/* Tags row */}
        {(dietaryTag || highlightTags.length > 0) && (
          <div className="mt-[8px] flex gap-1 flex-wrap">
            {dietaryTag && (
              <span
                className="inline-flex items-center bg-[#e4e9ee] rounded-[6px] px-[8px] py-[2px] text-[9px] font-bold uppercase"
                style={{
                  color: isNonVeg ? "#b91c1c" : isVeg ? "#15803d" : "#596065",
                }}
              >
                {dietaryTag.name}
              </span>
            )}
            {highlightTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center bg-[#e4e9ee] rounded-[6px] px-[8px] py-[2px] text-[9px] font-bold text-[#596065] uppercase"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewMenuItemCard;
