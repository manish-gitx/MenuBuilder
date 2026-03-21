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

  const inCart = isInCart(item);

  return (
    <div
      className="relative flex gap-[16px] items-start overflow-hidden p-[16px] w-full"
      style={{ backgroundColor: 'var(--preview-surface)', borderRadius: '8px' }}
    >
      {/* Image — square, small radius */}
      <div
        className="flex-shrink-0 w-[96px] h-[96px] overflow-hidden rounded-[4px]"
        style={{ backgroundColor: 'var(--preview-image-placeholder)' }}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--preview-image-placeholder)' }}>
            <svg className="w-8 h-8" fill="none" stroke="var(--preview-text-muted)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content — right padding avoids button overlap */}
      <div className="flex-1 flex flex-col gap-[8px] min-w-0 pr-[40px]">
        <p
          className="text-[14px] font-bold leading-[20px]"
          style={{ color: 'var(--preview-text-primary)', letterSpacing: '-0.35px' }}
        >
          {item.name}
        </p>

        {item.description && (
          <div>
            <p
              ref={descriptionRef}
              className={`text-[12px] leading-[19.5px] ${!isExpanded ? "line-clamp-2" : ""}`}
              style={{ color: 'var(--preview-text-secondary)' }}
            >
              {item.description}
            </p>
            {(isOverflowing || isExpanded) && (
              <button
                onClick={() => setIsExpanded(e => !e)}
                className="text-[10px] font-semibold mt-[2px] uppercase tracking-[1px]"
                style={{ color: 'var(--preview-accent)' }}
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        {/* Tags — amber-bordered chips */}
        {(dietaryTag || highlightTags.length > 0) && (
          <div className="flex gap-[8px] flex-wrap pt-[4px]">
            {dietaryTag && (
              <span
                className="inline-flex items-center border px-[9px] py-[3px] text-[9px] font-semibold uppercase rounded-[2px]"
                style={{
                  backgroundColor: isNonVeg ? 'rgba(147,0,10,0.2)' : isVeg ? 'rgba(0,100,20,0.15)' : 'rgba(255,224,190,0.1)',
                  borderColor: isNonVeg ? 'rgba(255,180,171,0.2)' : isVeg ? 'rgba(134,239,172,0.2)' : 'rgba(255,185,90,0.2)',
                  color: isNonVeg ? '#ffb4ab' : isVeg ? '#86efac' : 'var(--preview-accent)',
                  letterSpacing: '-0.45px',
                }}
              >
                {dietaryTag.name}
              </span>
            )}
            {highlightTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center border px-[9px] py-[3px] text-[9px] font-semibold uppercase rounded-[2px]"
                style={{
                  backgroundColor: 'rgba(255,224,190,0.1)',
                  borderColor: 'rgba(255,185,90,0.2)',
                  color: 'var(--preview-accent)',
                  letterSpacing: '-0.45px',
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add button — gradient, absolute top-right */}
      <button
        onClick={() => inCart ? removeFromCart(item) : addToCart(item)}
        className="absolute top-[10px] right-[16px] size-[32px] rounded-[10px] flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        style={{ background: 'linear-gradient(135deg, #ffe0be 0%, #ffbd65 100%)' }}
      >
        {inCart ? (
          <Check style={{ width: 12, height: 12, color: '#462a00', flexShrink: 0 }} />
        ) : (
          <Plus style={{ width: 12, height: 12, color: '#462a00', flexShrink: 0 }} />
        )}
      </button>
    </div>
  );
};

export default PreviewMenuItemCard;
