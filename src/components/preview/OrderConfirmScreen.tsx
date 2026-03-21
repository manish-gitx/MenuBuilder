"use client"
import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Category, MenuItem } from "../../lib/api";

interface OrderConfirmScreenProps {
  cart: MenuItem[];
  menuName: string;
  storageKey: string;
  onClose: () => void;
  onConfirm: () => void;
  categories: Category[];
}

const ls = {
  get: (key: string) => { try { return localStorage.getItem(key); } catch { return null; } },
  set: (key: string, val: string) => { try { localStorage.setItem(key, val); } catch {} },
  del: (key: string) => { try { localStorage.removeItem(key); } catch {} },
};

const OrderConfirmScreen = ({
  cart,
  menuName,
  storageKey,
  onClose,
  onConfirm,
  categories,
}: OrderConfirmScreenProps) => {
  const eventKey = `mb_event_${storageKey}`;

  const [vegGuests, setVegGuests] = useState<number>(() => {
    const saved = ls.get(eventKey);
    if (saved) { try { return JSON.parse(saved).vegGuests ?? 0; } catch {} }
    return 0;
  });
  const [nonVegGuests, setNonVegGuests] = useState<number>(() => {
    const saved = ls.get(eventKey);
    if (saved) { try { return JSON.parse(saved).nonVegGuests ?? 0; } catch {} }
    return 0;
  });
  const [date, setDate] = useState<string>(() => {
    const saved = ls.get(eventKey);
    if (saved) { try { return JSON.parse(saved).date ?? ""; } catch {} }
    return "";
  });
  const [phone, setPhone] = useState<string>(() => {
    const saved = ls.get(eventKey);
    if (saved) { try { return JSON.parse(saved).phone ?? ""; } catch {} }
    return "";
  });

  // First category with cart items auto-opened
  const [expandedCatId, setExpandedCatId] = useState<string | null>(() => {
    const cartIds = new Set(cart.map(i => i.id));
    const first = categories.find(cat => {
      if (cat.childCategories?.length) {
        return cat.childCategories.some(sub =>
          (sub.menuItems ?? []).some(i => cartIds.has(i.id))
        );
      }
      return (cat.menuItems ?? []).some(i => cartIds.has(i.id));
    });
    return first?.id ?? null;
  });

  // Persist event details
  useEffect(() => {
    ls.set(eventKey, JSON.stringify({ vegGuests, nonVegGuests, date, phone }));
  }, [vegGuests, nonVegGuests, date, phone, eventKey]);

  const cartIds = new Set(cart.map(i => i.id));

  // Build a list of categories that have at least one cart item
  const categoriesWithCart: Array<{
    cat: Category;
    items: MenuItem[];
    subGroups: Array<{ subCat: Category; items: MenuItem[] }>;
  }> = [];

  for (const cat of categories) {
    const hasSubCats = cat.childCategories && cat.childCategories.length > 0;
    if (hasSubCats) {
      const subGroups: Array<{ subCat: Category; items: MenuItem[] }> = [];
      for (const subCat of cat.childCategories!) {
        const items = (subCat.menuItems ?? []).filter(i => cartIds.has(i.id));
        if (items.length > 0) subGroups.push({ subCat, items });
      }
      if (subGroups.length > 0) {
        categoriesWithCart.push({ cat, items: [], subGroups });
      }
    } else {
      const items = (cat.menuItems ?? []).filter(i => cartIds.has(i.id));
      if (items.length > 0) {
        categoriesWithCart.push({ cat, items, subGroups: [] });
      }
    }
  }

  const toggleCat = (catId: string) =>
    setExpandedCatId(prev => (prev === catId ? null : catId));

  const isCatExpanded = (catId: string) => expandedCatId === catId;

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${menuName} — Order Summary`, 14, 15);

    const rows: string[][] = [];
    for (const { cat, items, subGroups } of categoriesWithCart) {
      if (subGroups.length > 0) {
        for (const { subCat, items: sItems } of subGroups) {
          for (const item of sItems) {
            rows.push([cat.name, subCat.name, item.name, item.description ?? ""]);
          }
        }
      } else {
        for (const item of items) {
          rows.push([cat.name, "", item.name, item.description ?? ""]);
        }
      }
    }

    autoTable(doc, {
      head: [["Category", "Sub-category", "Item", "Description"]],
      body: rows,
      startY: 25,
    });

    if (vegGuests > 0 || nonVegGuests > 0 || date || phone) {
      const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Event Details", 14, finalY);
      autoTable(doc, {
        body: [
          ["Vegetarian Guests", String(vegGuests)],
          ["Non-Veg Guests", String(nonVegGuests)],
          ["Preferred Date", date],
          ["Phone", phone],
        ],
        startY: finalY + 5,
      });
    }

    doc.save(`${menuName}_order.pdf`);
    // Clear all persisted data for this menu session
    ls.del(eventKey);
    ls.del(`mb_cart_${storageKey}`);
    ls.del(`mb_openCat_${storageKey}`);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fdfdfd] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 backdrop-blur-[6px] bg-[rgba(249,249,251,0.8)] border-b border-[#ebeef2] px-4 py-4 flex items-center gap-3">
        <button
          onClick={onClose}
          className="size-[40px] rounded-full flex items-center justify-center text-[#2d3338]"
          aria-label="Go back"
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </button>
        <span className="text-[18px] font-bold text-[#2d3338] tracking-[-0.45px]">
          Review &amp; Confirm
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32 flex flex-col gap-8">

        {/* Selected Items */}
        <section className="px-4 pt-6">
          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-[20px] font-bold text-[#2d3338] tracking-[-0.5px]">
              Selected Items
            </span>
            <span className="text-[14px] font-medium text-[#596065]">
              {cart.length} {cart.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {categoriesWithCart.map(({ cat, items, subGroups }) => {
              const totalInCat =
                subGroups.reduce((s, g) => s + g.items.length, 0) + items.length;
              const expanded = isCatExpanded(cat.id);

              return (
                <div
                  key={cat.id}
                  className="bg-white border border-[#e4e9ee] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                  {/* Category header */}
                  <button
                    onClick={() => toggleCat(cat.id)}
                    className="w-full border-b border-[#f2f4f6] px-4 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] font-bold text-[#2d3338]">
                        {cat.name}
                      </span>
                      <span className="bg-[#f2f4f6] rounded-[4px] px-2 py-[2px] text-[10px] font-bold text-[#596065] uppercase tracking-[1px]">
                        {totalInCat}
                      </span>
                    </div>
                    {expanded ? (
                      <ChevronUp style={{ width: 16, height: 16 }} className="text-[#596065]" />
                    ) : (
                      <ChevronDown style={{ width: 16, height: 16 }} className="text-[#596065]" />
                    )}
                  </button>

                  {/* Items */}
                  {expanded && (
                    <div className="max-h-[320px] overflow-y-auto">
                    <div className="gap-6 p-4 flex flex-col">
                      {subGroups.length > 0 ? (
                        subGroups.map(({ subCat, items: sItems }, idx) => {
                          const dietaryTag = sItems[0]?.tags?.find(t => t.type === "dietary");
                          const isNonVeg =
                            dietaryTag?.name.toLowerCase().includes("non-vegetarian") ||
                            dietaryTag?.name.toLowerCase().includes("non vegetarian");

                          return (
                            <div key={subCat.id}>
                              {idx > 0 && <div className="bg-[#f2f4f6] h-px mb-6" />}
                              {/* Sub-cat label */}
                              <div className="flex items-center gap-1 mb-3">
                                <div
                                  className="size-[6px] rounded-full flex-shrink-0"
                                  style={{ backgroundColor: isNonVeg ? "#dc2626" : "#16a34a" }}
                                />
                                <span
                                  className="text-[10px] font-extrabold uppercase tracking-[1px]"
                                  style={{ color: isNonVeg ? "#b91c1c" : "#15803d" }}
                                >
                                  {subCat.name}
                                </span>
                              </div>
                              {/* Items in sub-cat */}
                              <div className="flex flex-col gap-4">
                                {sItems.map(item => (
                                  <ConfirmItemRow key={item.id} item={item} />
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        items.map(item => (
                          <ConfirmItemRow key={item.id} item={item} />
                        ))
                      )}
                    </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Event Details */}
        <section className="px-4 flex flex-col gap-8">
          <span className="text-[20px] font-bold text-[#2d3338] tracking-[-0.5px] px-2">
            Event Details
          </span>

          {/* Serving Size */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#596065] px-2">
              Serving Size
            </span>

            {/* Veg Guests */}
            <div className="bg-white border border-[#e4e9ee] rounded-[16px] p-[17px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-[32px] rounded-full bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                  {/* Leaf SVG */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <span className="text-[16px] font-semibold text-[#2d3338]">
                  Vegetarian Guests
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVegGuests(v => Math.max(0, v - 1))}
                  className="size-[32px] rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#2d3338] font-bold text-[16px]"
                >
                  −
                </button>
                <span className="text-[16px] font-bold text-[#2d3338] min-w-[24px] text-center">
                  {vegGuests}
                </span>
                <button
                  onClick={() => setVegGuests(v => v + 1)}
                  className="size-[32px] rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#2d3338] font-bold text-[16px]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Non-Veg Guests */}
            <div className="bg-white border border-[#e4e9ee] rounded-[16px] p-[17px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-[32px] rounded-full bg-[#fef2f2] flex items-center justify-center flex-shrink-0">
                  {/* Fork SVG */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
                    <path d="M7 2v20" />
                    <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
                  </svg>
                </div>
                <span className="text-[16px] font-semibold text-[#2d3338]">
                  Non-Veg Guests
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNonVegGuests(v => Math.max(0, v - 1))}
                  className="size-[32px] rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#2d3338] font-bold text-[16px]"
                >
                  −
                </button>
                <span className="text-[16px] font-bold text-[#2d3338] min-w-[24px] text-center">
                  {nonVegGuests}
                </span>
                <button
                  onClick={() => setNonVegGuests(v => v + 1)}
                  className="size-[32px] rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#2d3338] font-bold text-[16px]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Preferred Date */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#596065] px-2">
              Preferred Date
            </span>
            <div className="bg-white border border-[#e4e9ee] rounded-[16px] px-[17px] py-[17px] relative">
              {/* Calendar icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#596065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full pl-[32px] text-[16px] text-[#2d3338] bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#596065] px-2">
              Contact Info
            </span>
            <div className="bg-white border border-[#e4e9ee] rounded-[16px] relative">
              {/* Phone icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#596065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                </svg>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full pl-[49px] pr-[17px] py-[17px] text-[16px] text-[#2d3338] placeholder:text-[#6b7280] bg-transparent outline-none rounded-[16px]"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-[12px] bg-[rgba(255,255,255,0.8)] border-t border-[#f2f4f6] px-4 pt-[17px] pb-8 flex-shrink-0">
        <button
          onClick={generatePdf}
          className="bg-[#a04100] rounded-[16px] w-full py-4 text-[18px] font-bold text-white text-center shadow-[0px_10px_15px_-3px_rgba(160,65,0,0.2),0px_4px_6px_-4px_rgba(160,65,0,0.2)]"
        >
          Confirm Request
        </button>
      </div>
    </div>
  );
};

// Small item row used inside confirm screen
const ConfirmItemRow = ({ item }: { item: MenuItem }) => {
  const dietaryTag = item.tags?.find(t => t.type === "dietary");
  const highlightTags = item.tags?.filter(t => t.type !== "dietary") ?? [];
  const isNonVeg =
    dietaryTag?.name.toLowerCase().includes("non-vegetarian") ||
    dietaryTag?.name.toLowerCase().includes("non vegetarian");
  const isVeg =
    dietaryTag?.name.toLowerCase().includes("vegetarian") &&
    !dietaryTag?.name.toLowerCase().includes("non");

  return (
    <div className="flex items-start gap-3">
      {/* Image */}
      <div className="size-[80px] rounded-[12px] bg-[#f2f4f6] flex-shrink-0 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#f2f4f6]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-bold text-[#2d3338] leading-snug">{item.name}</p>
        {item.description && (
          <p className="text-[12px] text-[#596065] mt-[2px] line-clamp-2 leading-snug">
            {item.description}
          </p>
        )}
        {(dietaryTag || highlightTags.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-[6px]">
            {dietaryTag && (
              <span
                className="inline-flex items-center bg-[#f2f4f6] rounded-[4px] px-[6px] py-[0.5px] text-[9px] font-bold uppercase tracking-[0.45px]"
                style={{ color: isNonVeg ? "#b91c1c" : isVeg ? "#15803d" : "#525154" }}
              >
                {dietaryTag.name}
              </span>
            )}
            {highlightTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center bg-[#f2f4f6] rounded-[4px] px-[6px] py-[0.5px] text-[9px] font-bold text-[#525154] uppercase tracking-[0.45px]"
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

export default OrderConfirmScreen;
