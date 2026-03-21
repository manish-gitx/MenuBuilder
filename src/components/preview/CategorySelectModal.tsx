"use client"
import React, { useState } from "react";
import { X } from "lucide-react";
import { Category } from "../../lib/api";

interface CategorySelectModalProps {
  categories: Category[];
  onClose: () => void;
  onSelectCategory: (categoryId: string, subCategoryId?: string) => void;
}

const getTotalCount = (cat: Category): number => {
  const direct = cat.menuItems?.length ?? cat._count?.menuItems ?? 0;
  const sub =
    cat.childCategories?.reduce(
      (s, c) => s + (c.menuItems?.length ?? c._count?.menuItems ?? 0),
      0
    ) ?? 0;
  return direct + sub;
};

const CategorySelectModal = ({
  categories,
  onClose,
  onSelectCategory,
}: CategorySelectModalProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string, subCategoryId?: string) => {
    onSelectCategory(categoryId, subCategoryId);
    onClose();
  };

  const handleToggleExpand = (categoryId: string, hasSubCats: boolean) => {
    if (!hasSubCats) {
      handleCategoryClick(categoryId);
      return;
    }
    setExpandedId(prev => (prev === categoryId ? null : categoryId));
  };

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-[6px] flex items-end justify-center"
      style={{ backgroundColor: 'var(--preview-overlay-bg)' }}
    >
      <div
        className="flex flex-col w-full max-w-[512px] max-h-[80vh] rounded-tl-[24px] rounded-tr-[24px] shadow-[0px_24px_48px_0px_rgba(45,51,56,0.06)] overflow-hidden"
        style={{ backgroundColor: 'var(--preview-surface)' }}
      >
        {/* Modal Header */}
        <div
          className="border-b flex items-center justify-between py-5 px-6 flex-shrink-0"
          style={{ borderColor: 'var(--preview-border)' }}
        >
          <span
            className="text-[20px] font-bold tracking-[-0.5px] leading-[28px]"
            style={{ color: 'var(--preview-text-primary)' }}
          >
            Select Category
          </span>
          <button
            onClick={onClose}
            className="rounded-full size-[40px] flex items-center justify-center"
            style={{ backgroundColor: 'var(--preview-surface-low)' }}
            aria-label="Close"
          >
            <X style={{ width: 14, height: 14, color: 'var(--preview-text-secondary)' }} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {categories.map(cat => {
            const count = getTotalCount(cat);
            const hasSubCats = !!cat.childCategories && cat.childCategories.length > 0;
            const isExpanded = expandedId === cat.id;

            return (
              <div key={cat.id}>
                {/* Category Row */}
                <button
                  onClick={() => handleToggleExpand(cat.id, hasSubCats)}
                  className={`w-full flex items-center justify-between p-4 rounded-[8px] transition-colors ${
                    isExpanded ? "rounded-bl-none rounded-br-none" : ""
                  }`}
                  style={{
                    backgroundColor: isExpanded ? 'var(--preview-surface-low)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-[16px] font-semibold leading-[24px]"
                      style={{ color: isExpanded ? 'var(--preview-accent)' : 'var(--preview-text-primary)' }}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2 py-1 rounded-full text-[12px] leading-[16px]"
                      style={
                        isExpanded
                          ? { backgroundColor: 'var(--preview-accent-subtle)', color: 'var(--preview-accent)' }
                          : { backgroundColor: 'var(--preview-tag-bg)', color: 'var(--preview-text-secondary)' }
                      }
                    >
                      {count}
                    </span>
                    {hasSubCats ? (
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M1 1L6 6L11 1"
                          stroke="var(--preview-text-secondary)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                        <path
                          d="M1 1L6 6L1 11"
                          stroke="var(--preview-text-secondary)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Sub-categories */}
                {isExpanded && hasSubCats && (
                  <div
                    className="rounded-bl-[8px] rounded-br-[8px] flex flex-col pb-2 pl-16 pr-4"
                    style={{ backgroundColor: 'var(--preview-surface-low)' }}
                  >
                    {cat.childCategories!.map((subCat, idx) => {
                      const subCount = subCat.menuItems?.length ?? subCat._count?.menuItems ?? 0;
                      return (
                        <button
                          key={subCat.id}
                          onClick={() => handleCategoryClick(cat.id, subCat.id)}
                          className={`w-full flex items-center justify-between py-3 px-2 rounded-[6px] ${
                            idx < cat.childCategories!.length - 1 ? "border-b" : ""
                          }`}
                          style={{ borderColor: 'var(--preview-border)' }}
                        >
                          <span
                            className="text-[14px] leading-[20px]"
                            style={{ color: 'var(--preview-text-primary)' }}
                          >
                            {subCat.name}
                          </span>
                          <span
                            className="rounded-full px-2 py-[2px] text-[10px] leading-[15px]"
                            style={{ backgroundColor: 'var(--preview-image-placeholder)', color: 'var(--preview-text-secondary)' }}
                          >
                            {subCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-6 flex-shrink-0" style={{ backgroundColor: 'var(--preview-surface-low)' }}>
          <button
            onClick={onClose}
            className="w-full rounded-[12px] py-4 flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            style={{ backgroundColor: 'var(--preview-accent)' }}
          >
            <span className="text-[18px] font-bold leading-[28px]" style={{ color: 'var(--preview-accent-text)' }}>
              Show All Items
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectModal;
